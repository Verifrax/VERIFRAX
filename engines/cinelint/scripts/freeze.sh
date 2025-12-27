#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

TAG="${1:?usage: freeze.sh <TAG>}"

# 0) Governance: clean tree
git diff --exit-code >/dev/null || { echo "ERROR: working tree dirty" >&2; exit 1; }

# 1) Governance: CI gates
"$ROOT/scripts/ci.sh"

# 2) Build + verify
node "$ROOT/scripts/bundle.build.mjs" "${TAG}"
node "$ROOT/scripts/bundle.verify.mjs" "$ROOT/out/${TAG}.zip"

# 3) Ensure sha exists (bundle.build writes it, but fail closed)
test -f "$ROOT/out/${TAG}.zip.sha256" || { echo "ERROR: missing sha256" >&2; exit 1; }

# 4) Write release record (commit-pinned)
mkdir -p "$ROOT/freeze"
COMMIT="$(git rev-parse HEAD)"
ZIP_SHA="$(cat "$ROOT/out/${TAG}.zip.sha256")"
RUN_ID="$(cat "$ROOT/out/${TAG}/run.id")"

cat > "$ROOT/freeze/${TAG}.json" <<JSON
{
  "tag": "${TAG}",
  "git_commit": "${COMMIT}",
  "zip_sha256": "${ZIP_SHA}",
  "run_id": "${RUN_ID}"
}
JSON

# 5) Commit + tag + push (uncomment to enforce)
git add -f "$ROOT/freeze/${TAG}.json"
git commit -m "chore(freeze): ${TAG}" || true
git tag -a "${TAG}" -m "Freeze ${TAG}"

# If you want full automation:
# git push origin HEAD
# git push origin "${TAG}"

echo "FROZEN ${TAG}"
