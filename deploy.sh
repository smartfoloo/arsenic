set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree has uncommitted changes — aborting so nothing gets clobbered." >&2
  git status --short
  exit 1
fi

echo "==> git pull"
git pull --ff-only

echo "==> npm ci"
npm ci

echo "==> npm run build"
npm run build

echo "==> pm2 restart"
pm2 restart ecosystem.config.cjs

echo "Deployed $(git rev-parse --short HEAD)."
