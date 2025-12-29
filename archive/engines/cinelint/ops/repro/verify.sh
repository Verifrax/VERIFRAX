#!/usr/bin/env bash
set -euo pipefail
TAG="${1:-engine-semantics-freeze-20251226-155121}"
git fetch --tags --force >/dev/null 2>&1 || true
git checkout -f "$TAG" >/dev/null
git diff --exit-code "$TAG" -- core tools sample/run-003
shasum -a 256 "freeze-manifests/${TAG}.MANIFEST.sha256"
node tools/bundle-verify.mjs sample/run-003
echo "OK: REPRO VERIFIED $TAG"
