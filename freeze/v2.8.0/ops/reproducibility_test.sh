#!/bin/bash
# Reproducibility test (bit-exact)

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 <evidence.zip> <manifest.json> <profile_id>"
    exit 1
fi

BUNDLE="$1"
MANIFEST="$2"
PROFILE="$3"

echo "=== Reproducibility Test ==="

./ops/verifrax_verify.sh "$BUNDLE" "$MANIFEST" "$PROFILE"
cp certificate.json certificate_run1.json

./ops/verifrax_verify.sh "$BUNDLE" "$MANIFEST" "$PROFILE"
cp certificate.json certificate_run2.json

echo "Comparing runs..."
if diff certificate_run1.json certificate_run2.json; then
    echo "PASS: Runs are identical"
    rm -f certificate_run1.json certificate_run2.json
    exit 0
else
    echo "FAIL: Runs differ"
    exit 1
fi

