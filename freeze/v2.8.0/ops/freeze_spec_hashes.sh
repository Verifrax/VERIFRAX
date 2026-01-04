#!/bin/bash
# Freeze spec hashes

BASE_URL="https://www.verifrax.net"
OUTPUT_DIR="freeze/v2.5.0"

mkdir -p "$OUTPUT_DIR"

echo "=== Freezing Public Surface Hashes ==="

curl -s "$BASE_URL/spec" > spec.txt
curl -s "$BASE_URL/glossary" > glossary.txt

echo "VERIFRAX v2.5.0 — Public Surface Hashes" > "$OUTPUT_DIR/PUBLIC_SURFACE_HASHES.txt"
echo "Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$OUTPUT_DIR/PUBLIC_SURFACE_HASHES.txt"
echo "" >> "$OUTPUT_DIR/PUBLIC_SURFACE_HASHES.txt"

echo "GET /spec:" >> "$OUTPUT_DIR/PUBLIC_SURFACE_HASHES.txt"
shasum -a 256 spec.txt >> "$OUTPUT_DIR/PUBLIC_SURFACE_HASHES.txt"
echo "" >> "$OUTPUT_DIR/PUBLIC_SURFACE_HASHES.txt"

echo "GET /glossary:" >> "$OUTPUT_DIR/PUBLIC_SURFACE_HASHES.txt"
shasum -a 256 glossary.txt >> "$OUTPUT_DIR/PUBLIC_SURFACE_HASHES.txt"

cat "$OUTPUT_DIR/PUBLIC_SURFACE_HASHES.txt"

rm -f spec.txt glossary.txt

echo "=== Hashes frozen ==="

