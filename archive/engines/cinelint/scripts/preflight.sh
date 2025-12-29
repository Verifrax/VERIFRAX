#!/usr/bin/env bash
set -euo pipefail
./scripts/semantics-guard.sh
node tools/bundle-verify.mjs sample/run-003 >/dev/null
echo "OK: semantics frozen + bundle verified"
