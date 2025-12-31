#!/bin/bash
# Third-party rebuild (no network)

if [ -z "$1" ]; then
    echo "Usage: $0 <certificate.json>"
    exit 1
fi

CERT="$1"
EXPECTED_HASH=$(shasum -a 256 "$CERT" | cut -d' ' -f1)

echo "Expected hash: $EXPECTED_HASH"
echo "Testing third-party rebuild (no network)..."

ACTUAL_HASH=$(docker run --rm --network none -v "$(pwd):/input" alpine:latest \
  sh -c "apk add -q sha256sum > /dev/null 2>&1 && sha256sum /input/$CERT" | cut -d' ' -f1)

if [ "$EXPECTED_HASH" = "$ACTUAL_HASH" ]; then
    echo "PASS: Hash matches"
    exit 0
else
    echo "FAIL: Hash mismatch"
    echo "Expected: $EXPECTED_HASH"
    echo "Actual: $ACTUAL_HASH"
    exit 1
fi

