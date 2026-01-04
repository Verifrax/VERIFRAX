#!/bin/bash
# Freeze verifier hash

if [ -z "$1" ]; then
    echo "Usage: $0 <certificate.json>"
    exit 1
fi

CERT="$1"
HASH=$(shasum -a 256 "$CERT" | cut -d' ' -f1)

echo "$HASH" > freeze/v2.5.0/REFERENCE_CERT_HASH.txt

echo "Reference certificate hash: $HASH"
echo "Saved to: freeze/v2.5.0/REFERENCE_CERT_HASH.txt"

