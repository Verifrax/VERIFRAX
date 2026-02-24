#!/usr/bin/env bash
set -euo pipefail
ver="${1:?version required (e.g. 2.8.0)}"
dir="public/spec/v"
cd "$dir"
tmp="$(mktemp)"
find . -type f ! -name 'MANIFEST.sha256' ! -name 'MANIFEST_SHA256.txt' -print0 \
  | LC_ALL=C sort -z \
  | xargs -0 shasum -a 256 \
  | sed 's|  \./|  |' > "$tmp"
mv -f "$tmp" MANIFEST.sha256
cp -f MANIFEST.sha256 MANIFEST_SHA256.txt
