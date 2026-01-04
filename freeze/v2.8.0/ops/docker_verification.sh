#!/bin/bash
# Execution sandbox

if [ -z "$1" ]; then
    echo "Usage: $0 <evidence.zip>"
    exit 1
fi

EVIDENCE="$1"

docker run --rm \
  --network none \
  --read-only \
  -v "$(pwd):/input:ro" \
  verifrax/verifier:v2.5.0 \
  --bundle "/input/$EVIDENCE"

