#!/bin/bash
# Create Court-Ready Packet
#
# Packet usable with NO VERIFRAX infrastructure

set -euo pipefail

BUNDLE_PATH="${1:-}"
OUTPUT="${2:-court_packet.zip}"

if [ -z "$BUNDLE_PATH" ]; then
    echo "Usage: $0 <bundle_path> [output.zip]"
    exit 1
fi

TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# Copy evidence bundle
cp -r "$BUNDLE_PATH" "$TMPDIR/bundle"

# Generate verdict
cd "$(dirname "$0")/.."
verdict=$(node engines/cinelint/apps/cli/bin/verifrax.js verify "$BUNDLE_PATH" 2>/dev/null || echo "{}")
echo "$verdict" > "$TMPDIR/verdict.json"

# Copy verifier binary (if available)
if [ -f "verifrax-verifier-min/target/release/verifrax-verifier-min-linux" ]; then
    cp verifrax-verifier-min/target/release/verifrax-verifier-min-linux "$TMPDIR/verifier"
    chmod +x "$TMPDIR/verifier"
fi

# Generate hash list
cd "$TMPDIR"
find . -type f -exec sha256sum {} \; > hash_list.txt

# Generate affidavit
cd "$(dirname "$0")/.."
node engines/cinelint/apps/cli/bin/verifrax.js export affidavit "$BUNDLE_PATH" --strict "$TMPDIR/affidavit.txt" 2>/dev/null || echo "Affidavit generation failed" > "$TMPDIR/affidavit.txt"

# Create packet
cd "$TMPDIR"
zip -r "$OUTPUT" . > /dev/null

echo "Court packet created: $OUTPUT"
echo "Contents:"
unzip -l "$OUTPUT"

