#!/bin/bash
# Verify certificate retrieval

if [ -z "$1" ]; then
    echo "Usage: $0 <certificate.json>"
    exit 1
fi

CERT="$1"
CERT_HASH=$(shasum -a 256 "$CERT" | cut -d' ' -f1)

echo "Certificate hash: $CERT_HASH"
echo "Testing retrieval..."

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://www.verifrax.net/certificate/$CERT_HASH")

if [ "$RESPONSE" = "200" ]; then
    echo "PASS: Certificate retrieval returns 200"
    curl -i "https://www.verifrax.net/certificate/$CERT_HASH"
    exit 0
else
    echo "FAIL: Certificate retrieval returns $RESPONSE"
    exit 1
fi

