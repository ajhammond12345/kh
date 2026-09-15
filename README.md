# kh — Knighton-Hammond gallery site

Public gallery + admin for the Knighton-Hammond Charitable Trust art
collection. Live at https://knighton-hammond.com (`www.` 301s to the apex;
fallback URL https://ajh-kh-gallery.web.app, Firebase project `ajh-kh-gallery`).

## Architecture

- `packages/frontend` — Nuxt 3 SPA (`ssr: false`), deployed to Firebase Hosting
- **Firestore** — artwork metadata. `catalog/artworks` is a single summary doc
  the public site reads (one read per visit); `artworks/{slug}` holds full
  records; `admins/{email}` grants admin (doc ID = lowercased email;
  `ajhammond123@gmail.com` + the `firebase_admins` terraform var are pre-seeded)
- **Images** — pre-generated variants (`/images/{thumb|medium|large}/{slug}.{webp|jpg}`)
  served as Hosting static files from the `kh-data` tree (outside the repo)
- **Auth** — Firebase Auth (Google sign-in + email link) guarding `/admin`
- `packages/backend` — legacy Hono/SQLite server, no longer used by the site
- `firestore.rules` — global read, admin-only write; `storage.rules` staged
  for when Cloud Storage is enabled

## Local dev

```bash
npm install
npm run dev -w packages/frontend    # :3100; reads live Firestore
```

`packages/frontend/public/images` is a gitignored symlink to
`../kh-data/uploads` so images resolve locally.

## Deploy

```bash
./deploy.sh   # nuxt generate + merge images + firebase deploy (hosting, firestore rules)
```

## Data

`scripts/seed-firestore.mjs` (one-shot, idempotent) builds Firestore from
`packages/frontend/data/artworks-scraped.json`, enriching dominant colours
from the legacy SQLite db / thumbnails:

```bash
GOOGLE_APPLICATION_CREDENTIALS=<sa-key> node scripts/seed-firestore.mjs
```

## Infrastructure

`terraform/` manages the GCP/Firebase resources (project, hosting site,
Firestore, web app, Auth config, admins, custom domain). Remote state:
`gs://kh-infra` (see the
[ajh-infrastructure](https://github.com/ajhammond12345/ajh-infrastructure)
repo). `ajh-infrastructure` is the management project for API quota
attribution; the prod project is linked to the same billing account because
Identity Platform (the Auth config) needs billing on the project itself. Dev
stays on Spark, so dev has no Auth and no admin login.

### Custom domain / DNS

`knighton-hammond.com` and `www.knighton-hammond.com` are declared in
`terraform/` as `google_firebase_hosting_custom_domain` resources. Terraform
does not wait for DNS; the zone (nameservers at mydomain.com) has to be
updated by hand. Only touch the apex A record, the `www` CNAME and the
`hosting-site` TXT — leave MX / `mx.knighton-hammond.com` and any SPF TXT
alone, email runs on the same domain.

```bash
cd terraform
terraform apply -refresh-only -auto-approve
terraform output custom_domain_dns      # outstanding ADD / REMOVE records
terraform output custom_domain_status   # HOST_ACTIVE / OWNERSHIP_ACTIVE when done
```

Once the records propagate, Firebase verifies ownership and issues the
certificate on its own (usually under an hour, up to 24h). Both hostnames are
Auth authorized domains via terraform.

### Auth / admin login

- Email-link sign-in and the authorized-domain list are terraform-managed
  (`google_identity_platform_config.auth`, prod only).
- Who is an admin = `admins/{email}` docs (`firebase_admins` var + the seeded
  owner); `/admin/login` then works with an email link straight away.
- **Google sign-in** needs an OAuth client only the Firebase console can
  create: Authentication → Sign-in method → Google → Enable → pick the support
  email → Save. Then adopt it into terraform so it stays declared:

  ```bash
  cd terraform
  TOKEN=$(gcloud auth application-default print-access-token)
  curl -s -H "Authorization: Bearer $TOKEN" -H "x-goog-user-project: ajh-infrastructure" \
    https://identitytoolkit.googleapis.com/admin/v2/projects/ajh-kh-gallery/defaultSupportedIdpConfigs/google.com \
    | jq -r '"google_oauth_client_id = \"\(.clientId)\"\ngoogle_oauth_client_secret = \"\(.clientSecret)\""' >> terraform.tfvars
  terraform import 'google_identity_platform_default_supported_idp_config.google[0]' \
    projects/ajh-kh-gallery/defaultSupportedIdpConfigs/google.com
  terraform plan   # expect: no changes
  ```

Still deferred: **runtime image uploads** (Cloud Storage for Firebase) —
`storage.rules` is ready, the admin UI shows uploads as locked.
