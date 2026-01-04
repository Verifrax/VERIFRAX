#!/bin/bash
# Cold verification script (publish)

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <certificate.json> <evidence.zip>"
    exit 1
fi

CERT="$1"
BUNDLE="$2"

echo "=== Cold Verification (No Infrastructure) ==="

echo "Certificate hash:"
shasum -a 256 "$CERT"

echo ""
echo "Offline verification:"
verifrax-verify --certificate "$CERT" --bundle "$BUNDLE" --offline

echo ""
echo "Verification complete (no network access required)"

