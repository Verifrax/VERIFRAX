#!/bin/bash
# Archive One Real External Citation
#
# Wait for natural occurrence — no outreach

set -euo pipefail

CITATION_URL="${1:-}"

if [ -z "$CITATION_URL" ]; then
    echo "Usage: $0 <external_document_url>"
    echo ""
    echo "When external citation appears:"
    echo "1. Download document"
    echo "2. Compute hash"
    echo "3. Archive to Wayback Machine"
    echo "4. Update docs/EXTERNAL_CITATIONS.md"
    exit 1
fi

echo "Archiving external citation: $CITATION_URL"

# Download
OUTPUT_FILE="external-citation-$(date +%Y%m%d).pdf"
echo "Downloading to: $OUTPUT_FILE"
wget "$CITATION_URL" -O "$OUTPUT_FILE" 2>/dev/null || curl -L "$CITATION_URL" -o "$OUTPUT_FILE"

# Compute hash
HASH=$(shasum -a 256 "$OUTPUT_FILE" | cut -d' ' -f1)
echo "Hash: sha256:$HASH"

# Archive to Wayback Machine
echo "Archiving to Wayback Machine..."
waybackpack "$CITATION_URL" 2>/dev/null || echo "Warning: waybackpack not available. Archive manually."

# Update EXTERNAL_CITATIONS.md
echo ""
echo "Add to docs/EXTERNAL_CITATIONS.md:"
echo "  URL: $CITATION_URL"
echo "  Hash: sha256:$HASH"
echo "  Archive: [Wayback Machine URL]"
echo "  Date: $(date -u +"%Y-%m-%d")"

echo ""
echo "Citation archived: $OUTPUT_FILE"

