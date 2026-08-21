#!/usr/bin/env bash
set -euo pipefail
# Build the frontend and deploy hosting + firestore rules.
# Usage: ./deploy.sh [prod|dev]   (default prod)
# Gallery images live OUTSIDE the repo (kh-data) and are merged into the
# hosting payload here; Firebase Hosting dedupes unchanged files across
# deploys, so the ~550MB image set uploads once per project, not every deploy.
cd "$(dirname "$0")"

ENV="${1:-prod}"
case "$ENV" in
  prod) ;;
  dev)
    # Bakes the dev Firebase project into the static build (values are the
    # public web-app config from `terraform output web_app_config_dev`).
    export NUXT_PUBLIC_FIREBASE_API_KEY="REDACTED-FIREBASE-WEB-API-KEY"
    export NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN="ajh-kh-gallery-dev.firebaseapp.com"
    export NUXT_PUBLIC_FIREBASE_PROJECT_ID="ajh-kh-gallery-dev"
    export NUXT_PUBLIC_FIREBASE_APP_ID="1:656824599840:web:a29735b846cdf3fc7fc345"
    export NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="656824599840"
    ;;
  *) echo "usage: ./deploy.sh [prod|dev]" >&2; exit 1 ;;
esac

KH_DATA="${KH_DATA:-$(dirname "$PWD")/kh-data/uploads}"
[ -d "$KH_DATA/thumb" ] || { echo "image tree not found at $KH_DATA" >&2; exit 1; }

# public/images/{thumb,medium,large} are dev-only symlinks into the image
# tree; keep them out of the generate pass so nuxt doesn't copy ~550MB into
# .output — the variants are merged into deploy/ below instead.
for size in thumb medium large; do
  LINK="packages/frontend/public/images/$size"
  [ -L "$LINK" ] && rm "$LINK"
done
npm run generate -w packages/frontend
for size in thumb medium large; do
  ln -sfn "$KH_DATA/$size" "packages/frontend/public/images/$size"
done

OUT=packages/frontend/.output/public
[ -f "$OUT/200.html" ] || { echo "expected $OUT/200.html from nuxt generate" >&2; exit 1; }

rm -rf deploy
mkdir -p deploy/images
cp -Rc "$OUT"/ deploy/
for size in thumb medium large; do
  cp -Rc "$KH_DATA/$size" "deploy/images/$size"
done

firebase deploy --only hosting,firestore --project "$ENV" --non-interactive
