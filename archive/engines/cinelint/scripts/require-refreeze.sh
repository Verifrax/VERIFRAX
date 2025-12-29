#!/usr/bin/env bash
set -euo pipefail

TAG="$1"
git diff --exit-code || {
  echo "ERROR: working tree dirty, must refreeze"
  exit 1
}

test -f "out/${TAG}.zip.sha256"
