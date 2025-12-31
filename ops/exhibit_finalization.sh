#!/bin/bash
# Exhibit finalization

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 <certificate.pdf> <certificate.json> <evidence.zip>"
    exit 1
fi

CERT_PDF="$1"
CERT_JSON="$2"
EVIDENCE="$3"

echo "=== Exhibit Finalization ==="

./ops/create_exhibit_pack.sh "$CERT_PDF" "$CERT_JSON" "$EVIDENCE"
tar -czf exhibit.tar.gz exhibit/
shasum -a 256 exhibit.tar.gz > freeze/v2.5.0/EXHIBIT_HASH.txt

echo "Exhibit hash saved to: freeze/v2.5.0/EXHIBIT_HASH.txt"
cat freeze/v2.5.0/EXHIBIT_HASH.txt

