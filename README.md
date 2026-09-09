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
Firestore, web app, seeded admin doc). Remote state: `gs://kh-infra` (see the
[ajh-infrastructure](https://github.com/ajhammond12345/ajh-infrastructure)
repo; local state via `terraform/backend_override.tf` until that bucket
exists). `ajh-infrastructure` is the management project — it carries billing
and API quota attribution; this project stays on the free Spark plan.

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
certificate on its own (usually under an hour, up to 24h). Admin sign-in from
the new domain also needs it listed under Authentication → Settings →
Authorized domains (automatic once `auth_managed` is on).

Billing-gated (deliberately deferred):
- **Runtime image uploads** — need Cloud Storage for Firebase (Blaze);
  `storage.rules` is ready, the admin UI shows uploads as locked
- **Terraform-managed Auth config** — `initializeAuth` requires billing, so
  Auth providers are enabled once by hand in the Firebase console
  (Authentication → Sign-in method → enable **Google** and **Email link**);
  set `auth_managed = true` + `terraform import` after billing exists
