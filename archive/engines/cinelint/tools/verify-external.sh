#!/usr/bin/env bash
# Safe external verification workflow
# Usage: CINELINT_ETH_RPC='https://...' ./tools/verify-external.sh [bundle.zip]

set -euo pipefail
IFS=$'\n\t'

ZIP="${1:-out/run-003.zip}"
RPC="${CINELINT_ETH_RPC:-}"
: "${RPC:?Set CINELINT_ETH_RPC to a real https:// RPC endpoint}"

if [[ ! -f "$ZIP" ]]; then
  echo "ERROR: missing $ZIP" >&2
  exit 2
fi

TMP="$(mktemp -d 2>/dev/null || mktemp -d -t verifrax-run-003)"
: "${TMP:?TMP not set}"
unzip -q "$ZIP" -d "$TMP"
cd "$TMP/run-003"

if [[ ! -f "verify.mjs" ]]; then
  echo "ERROR: verify.mjs not found in extracted bundle" >&2
  exit 2
fi

echo "[1] preflight"
if ! CINELINT_ETH_RPC="$RPC" node verify.mjs . --external-preflight; then
  echo "FAILED: preflight check" >&2
  exit 1
fi

echo "[2] external"
if ! CINELINT_ETH_RPC="$RPC" node verify.mjs . --external; then
  echo "FAILED: external verification" >&2
  exit 1
fi

# Status is printed by verify.mjs, just confirm success
echo "SUCCESS: External verification completed"

