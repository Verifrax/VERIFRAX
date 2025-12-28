#!/bin/bash
# Obtain Two External Build Attestations
#
# Zero coordination, independent entities

set -euo pipefail

echo "BUILD COMMAND (PROVIDE TO BOTH PARTIES):"
echo ""
echo "git clone https://github.com/verifrax/verifrax.git"
echo "cd verifrax/verifrax-verifier-min"
echo "cargo build --release --locked"
echo "shasum -a 256 target/release/verifrax-verifier-min*"
echo ""

echo "REQUIRED OUTPUT FROM EACH BUILDER:"
echo ""
echo "sha256:<hash>  verifrax-verifier-min-<platform>"
echo "signed statement + date + environment"
echo ""

echo "APPEND TO: docs/EXTERNAL_BUILD_ATTESTATIONS.md"
echo ""
echo "Status: TODO - Obtain two independent external builders"
echo ""
echo "Instructions:"
echo "1. Provide build command to Builder 1"
echo "2. Provide build command to Builder 2"
echo "3. Receive signed attestations from both"
echo "4. Append verbatim to docs/EXTERNAL_BUILD_ATTESTATIONS.md"

