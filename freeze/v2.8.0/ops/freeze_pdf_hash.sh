#!/bin/bash
# QR + PDF hash freeze

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <certificate_hash> <certificate.json>"
    exit 1
fi

CERT_HASH="$1"
CERT_JSON="$2"

echo "=== Generating QR and PDF ==="

./ops/generate_qr.sh "$CERT_HASH"
./ops/verifrax_export.sh "$CERT_JSON" certificate.qr.png

shasum -a 256 certificate.pdf > freeze/v2.5.0/CERTIFICATE_PDF_HASH.txt

echo "PDF hash saved to: freeze/v2.5.0/CERTIFICATE_PDF_HASH.txt"
cat freeze/v2.5.0/CERTIFICATE_PDF_HASH.txt

