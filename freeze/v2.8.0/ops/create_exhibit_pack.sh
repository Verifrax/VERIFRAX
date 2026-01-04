#!/bin/bash
# Court exhibit pack

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 <certificate.pdf> <certificate.json> <evidence.zip>"
    exit 1
fi

CERT_PDF="$1"
CERT_JSON="$2"
EVIDENCE="$3"
EXHIBIT_DIR="exhibit"

mkdir -p "$EXHIBIT_DIR"

cp "$CERT_PDF" "$EXHIBIT_DIR/"
cp "$CERT_JSON" "$EXHIBIT_DIR/"
cp "$EVIDENCE" "$EXHIBIT_DIR/"

echo "=== Exhibit Pack Created ==="
echo "Directory: $EXHIBIT_DIR"
echo ""
echo "Hashes:"
shasum -a 256 "$EXHIBIT_DIR"/*

