#!/usr/bin/env bash
set -euo pipefail
INPUT="${1:?usage: ./scripts/demo.sh <file>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/out/demo"
mkdir -p "$OUT"

echo "STEP 1: HASH"
"$ROOT/scripts/verifrax" verify "$INPUT"

echo "STEP 2: FREEZE + CERT"
"$ROOT/scripts/verifrax" freeze "$INPUT" --out "$OUT"

echo "STEP 3: PROOF FILE"
PROOF="$("$ROOT/scripts/verifrax" prove "$INPUT" --out "$OUT")"
echo "PROOF_PATH: $PROOF"
echo "VERIFY_REF: https://github.com/Verifrax/VERIFRAX"
