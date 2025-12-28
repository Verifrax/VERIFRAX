#!/bin/bash
# Final Lock
#
# Compute hashes of all final documents

set -euo pipefail

echo "FINAL LOCK - Computing hashes of all final documents"
echo ""

FILES=(
    "CANONICAL_HASHES_v1.txt"
    "IMMUTABILITY_SEAL_v1.txt"
    "docs/EXTERNAL_BUILD_ATTESTATIONS.md"
    "docs/EXTERNAL_CITATIONS.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        HASH=$(shasum -a 256 "$file" | cut -d' ' -f1)
        echo "sha256:$HASH  $file"
    else
        echo "MISSING: $file"
    fi
done

echo ""
echo "Record these hashes externally."
echo "These are the final lock hashes."

