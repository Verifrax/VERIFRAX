#!/bin/bash
# Canonical certificate hash

if [ -z "$1" ]; then
    echo "Usage: $0 <certificate.json>"
    exit 1
fi

CERT="$1"
HASH=$(shasum -a 256 "$CERT" | cut -d' ' -f1)

echo "Certificate: $CERT"
echo "SHA256: $HASH"
echo ""
echo "Certificate URL: https://www.verifrax.net/certificate/$HASH"

