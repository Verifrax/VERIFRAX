#!/bin/bash
# Deterministic execution

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 <evidence.zip> <manifest.json> <profile_id>"
    exit 1
fi

BUNDLE="$1"
MANIFEST="$2"
PROFILE="$3"
OUTPUT="certificate.json"

verifrax-verify \
  --bundle "$BUNDLE" \
  --manifest "$MANIFEST" \
  --profile "$PROFILE" \
  --out "$OUTPUT"

echo "Certificate generated: $OUTPUT"
shasum -a 256 "$OUTPUT"

