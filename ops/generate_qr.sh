#!/bin/bash
# Generate QR code for certificate

if [ -z "$1" ]; then
    echo "Usage: $0 <certificate_hash>"
    exit 1
fi

CERT_HASH="$1"
URL="https://www.verifrax.net/certificate/$CERT_HASH"
OUTPUT="certificate.qr.png"

qrencode "$URL" -o "$OUTPUT"

echo "QR code generated: $OUTPUT"
echo "URL: $URL"

