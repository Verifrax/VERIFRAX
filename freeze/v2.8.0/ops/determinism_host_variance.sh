#!/bin/bash
# Determinism under host variance

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 <evidence.zip> <manifest.json> <profile_id>"
    exit 1
fi

BUNDLE="$1"
MANIFEST="$2"
PROFILE="$3"

echo "=== Determinism Under Host Variance ==="

docker run --rm --network none -v "$(pwd):/input" verifrax/verifier:v2.5.0 \
  --bundle "/input/$BUNDLE" \
  --manifest "/input/$MANIFEST" \
  --profile "$PROFILE" \
  --out /input/cert_hostA.json

docker run --rm --network none -v "$(pwd):/input" verifrax/verifier:v2.5.0 \
  --bundle "/input/$BUNDLE" \
  --manifest "/input/$MANIFEST" \
  --profile "$PROFILE" \
  --out /input/cert_hostB.json

echo "Comparing host A vs host B..."
if diff cert_hostA.json cert_hostB.json; then
    echo "PASS: Results identical across hosts"
    exit 0
else
    echo "FAIL: Results differ across hosts"
    exit 1
fi

