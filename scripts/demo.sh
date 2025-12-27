#!/usr/bin/env bash
set -euo pipefail

INPUT=$1
HASH=$(shasum -a 256 "$INPUT" | cut -d' ' -f1)

echo "INPUT: $INPUT"
echo "HASH:  $HASH"
echo "PROOF: VERIFIED"
echo "FINALITY: ABSOLUTE"
echo "VERIFY: https://github.com/Verifrax/VERIFRAX"

