#!/bin/bash
# PDF export with QR

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <certificate.json> <certificate.qr.png>"
    exit 1
fi

CERT="$1"
QR="$2"
OUTPUT="certificate.pdf"

verifrax-export \
  --certificate "$CERT" \
  --qr "$QR" \
  --format pdf \
  --out "$OUTPUT"

echo "PDF generated: $OUTPUT"

