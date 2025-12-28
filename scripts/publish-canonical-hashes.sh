#!/bin/bash
# Publish CANONICAL_HASHES_v1.txt to ≥3 non-coordinated archives

set -euo pipefail

HASHES_FILE="${1:-CANONICAL_HASHES_v1.txt}"

if [ ! -f "$HASHES_FILE" ]; then
    echo "Error: $HASHES_FILE not found"
    exit 1
fi

echo "Publishing $HASHES_FILE to 3 non-coordinated archives..."

# A) Static Web (Primary)
echo ""
echo "A) Static Web (Primary)"
echo "Command: scp $HASHES_FILE user@verifrax.org:/var/www/html/freeze/v1/"
echo "Command: curl -I https://verifrax.org/freeze/v1/$HASHES_FILE"
echo "Status: TODO - Requires server access"

# B) Git Read-Only Mirror
echo ""
echo "B) Git Read-Only Mirror"
echo "Commands:"
echo "  git clone --mirror https://github.com/verifrax/freeze-mirror.git"
echo "  cd freeze-mirror.git"
echo "  cp ../$HASHES_FILE ."
echo "  git add $HASHES_FILE"
echo "  git commit -m 'freeze: canonical hashes v1 (immutable)'"
echo "  git tag canonical-hashes-v1"
echo "  git push --mirror"
echo "Status: TODO - Requires git mirror repo"

# C) Archive-Grade (WORM)
echo ""
echo "C) Archive-Grade (WORM)"
echo "Command: ipfs add --pin=true $HASHES_FILE"
echo "Status: TODO - Requires IPFS node"
echo "Note: Record returned CID in IMMUTABILITY_SEAL_v1.txt"

echo ""
echo "Publication structure ready. Execute commands when external resources available."

