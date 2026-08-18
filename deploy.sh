#!/usr/bin/env bash
set -euo pipefail
# Build the frontend and deploy hosting + firestore rules to ajh-kh-gallery.
# Gallery images live OUTSIDE the repo (kh-data) and are merged into the
# hosting payload here; Firebase Hosting dedupes unchanged files across
# deploys, so the ~550MB image set uploads once, not every deploy.
cd "$(dirname "$0")"

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

firebase deploy --only hosting,firestore --project ajh-kh-gallery --non-interactive
