#!/bin/bash
# Replace Placeholder Hashes (TBD)
#
# AFTER reproducible builds match

set -euo pipefail

VERIFIER_DIR="${1:-verifrax-verifier-min}"

if [ ! -d "$VERIFIER_DIR" ]; then
    echo "Error: $VERIFIER_DIR not found"
    exit 1
fi

echo "Computing verifier binary hashes..."

# Compute hashes (when binaries exist)
LINUX_HASH="sha256:TBD"
MACOS_HASH="sha256:TBD"
WINDOWS_HASH="sha256:TBD"

if [ -f "$VERIFIER_DIR/target/release/verifrax-verifier-min-linux" ]; then
    LINUX_HASH=$(shasum -a 256 "$VERIFIER_DIR/target/release/verifrax-verifier-min-linux" | cut -d' ' -f1)
    LINUX_HASH="sha256:$LINUX_HASH"
fi

if [ -f "$VERIFIER_DIR/target/release/verifrax-verifier-min-macos" ]; then
    MACOS_HASH=$(shasum -a 256 "$VERIFIER_DIR/target/release/verifrax-verifier-min-macos" | cut -d' ' -f1)
    MACOS_HASH="sha256:$MACOS_HASH"
fi

if [ -f "$VERIFIER_DIR/target/release/verifrax-verifier-min-windows.exe" ]; then
    WINDOWS_HASH=$(shasum -a 256 "$VERIFIER_DIR/target/release/verifrax-verifier-min-windows.exe" | cut -d' ' -f1)
    WINDOWS_HASH="sha256:$WINDOWS_HASH"
fi

echo "Hashes computed:"
echo "  Linux: $LINUX_HASH"
echo "  macOS: $MACOS_HASH"
echo "  Windows: $WINDOWS_HASH"
echo ""

if [ "$LINUX_HASH" = "sha256:TBD" ] || [ "$MACOS_HASH" = "sha256:TBD" ] || [ "$WINDOWS_HASH" = "sha256:TBD" ]; then
    echo "Warning: Some binaries not found. Hashes remain TBD."
    echo "Run after reproducible builds are complete."
    exit 0
fi

# Replace in build.provenance.json
if [ -f "build.provenance.json" ]; then
    echo "Updating build.provenance.json..."
    # Use sed to replace TBD hashes
    sed -i.bak "s/sha256:TBD/$LINUX_HASH/g" build.provenance.json
    sed -i.bak "s/sha256:TBD/$MACOS_HASH/g" build.provenance.json
    sed -i.bak "s/sha256:TBD/$WINDOWS_HASH/g" build.provenance.json
    rm -f build.provenance.json.bak
    echo "  build.provenance.json updated"
fi

# Replace in IMMUTABILITY_SEAL_v1.txt
if [ -f "IMMUTABILITY_SEAL_v1.txt" ]; then
    echo "Updating IMMUTABILITY_SEAL_v1.txt..."
    sed -i.bak "s/Linux: sha256:TBD/Linux: $LINUX_HASH/g" IMMUTABILITY_SEAL_v1.txt
    sed -i.bak "s/macOS: sha256:TBD/macOS: $MACOS_HASH/g" IMMUTABILITY_SEAL_v1.txt
    sed -i.bak "s/Windows: sha256:TBD/Windows: $WINDOWS_HASH/g" IMMUTABILITY_SEAL_v1.txt
    rm -f IMMUTABILITY_SEAL_v1.txt.bak
    echo "  IMMUTABILITY_SEAL_v1.txt updated"
fi

# Compute seal hash
if [ -f "IMMUTABILITY_SEAL_v1.txt" ]; then
    SEAL_HASH=$(shasum -a 256 IMMUTABILITY_SEAL_v1.txt | cut -d' ' -f1)
    echo ""
    echo "Seal hash: sha256:$SEAL_HASH"
    echo "Record this hash externally."
fi

echo ""
echo "Placeholder hashes replaced."

