#!/bin/bash
# Client evidence freeze

if [ -z "$1" ]; then
    echo "Usage: $0 <evidence_directory>"
    exit 1
fi

EVIDENCE_DIR="$1"
BUNDLE_NAME="evidence.zip"

echo "=== Preparing Evidence Bundle ==="

# Create ZIP
zip -r "$BUNDLE_NAME" "$EVIDENCE_DIR"

# Compute hash
HASH=$(shasum -a 256 "$BUNDLE_NAME" | cut -d' ' -f1)

echo "Bundle: $BUNDLE_NAME"
echo "SHA256: $HASH"
echo ""
echo "Header required for upload:"
echo "X-Bundle-Hash: sha256:$HASH"

