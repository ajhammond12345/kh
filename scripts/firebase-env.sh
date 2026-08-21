#!/usr/bin/env bash
set -euo pipefail
# Prints NUXT_PUBLIC_FIREBASE_* lines for the requested environment, read
# from terraform's local state. Usage:
#   eval "$(scripts/firebase-env.sh dev)"            # in a script (with set -a)
#   scripts/firebase-env.sh prod > packages/frontend/.env   # for local `nuxt dev`
cd "$(dirname "$0")/.."

ENV="${1:-prod}"
case "$ENV" in
  prod) OUTPUT=web_app_config ;;
  dev)  OUTPUT=web_app_config_dev ;;
  *) echo "usage: firebase-env.sh [prod|dev]" >&2; exit 1 ;;
esac

terraform -chdir=terraform output -json "$OUTPUT" | python3 -c '
import json, sys
c = json.load(sys.stdin)
for key, env in [
    ("apiKey", "API_KEY"),
    ("authDomain", "AUTH_DOMAIN"),
    ("projectId", "PROJECT_ID"),
    ("appId", "APP_ID"),
    ("messagingSenderId", "MESSAGING_SENDER_ID"),
]:
    print("NUXT_PUBLIC_FIREBASE_" + env + "=" + c[key])
'
