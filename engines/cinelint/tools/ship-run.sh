#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
ZIP="${1:-out/run-003.zip}"

if [[ ! -f "$ZIP" ]]; then
  echo "NOSHIP: missing $ZIP" >&2
  exit 2
fi

sha="$(shasum -a 256 "$ZIP" | awk '{print $1}')"
echo "zip_sha256=$sha"

unzip -t "$ZIP" >/dev/null

TMP="$(mktemp -d 2>/dev/null || mktemp -d -t verifrax-ship)"
: "${TMP:?TMP not set}"
unzip -q "$ZIP" -d "$TMP"
cd "$TMP/run-003"

if [[ ! -f "verify.mjs" ]]; then
  echo "NOSHIP: verify.mjs not found in extracted bundle" >&2
  exit 2
fi

node verify.mjs . >/dev/null
echo "SHIP: VERIFIED"

if [[ "${CINELINT_EXTERNAL:-0}" == "1" ]]; then
  node verify.mjs . --external >/dev/null
  echo "SHIP: VERIFIED+EXTERNAL"
fi

