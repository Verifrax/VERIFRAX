#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

ZIP="${1:-out/run-003.zip}"
RPC="${CINELINT_ETH_RPC:-}"
: "${RPC:?Set CINELINT_ETH_RPC to a real https:// RPC endpoint}"

TMP="$(mktemp -d 2>/dev/null || mktemp -d -t verifrax-run-003)"
: "${TMP:?TMP not set}"
unzip -q "$ZIP" -d "$TMP"
cd "$TMP/run-003"

echo "[1] preflight"
CINELINT_ETH_RPC="$RPC" node verify.mjs . --external-preflight

echo "[2] external (eth only)"
CINELINT_ETH_RPC="$RPC" node verify.mjs . --external=eth

