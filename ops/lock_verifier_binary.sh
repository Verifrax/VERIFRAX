#!/bin/bash
# Lock verifier binary (reproducibility)

docker pull verifrax/verifier:v2.5.0
DIGEST=$(docker inspect verifrax/verifier:v2.5.0 --format='{{.Id}}')

echo "$DIGEST" > freeze/v2.5.0/VERIFIER_IMAGE_DIGEST.txt

echo "Verifier image digest: $DIGEST"
echo "Saved to: freeze/v2.5.0/VERIFIER_IMAGE_DIGEST.txt"

