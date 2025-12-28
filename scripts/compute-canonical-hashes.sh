#!/bin/bash
# Compute Canonical Hashes for Frozen Files
#
# Point of No Return

set -euo pipefail

OUTPUT="${1:-CANONICAL_HASHES_v1.txt}"

echo "# VERIFRAX Canonical Hashes v1" > "$OUTPUT"
echo "# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$OUTPUT"
echo "# Point of No Return" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# VERDICT_REFERENCE_v1.md
if [ -f "public/VERDICT_REFERENCE_v1.md" ]; then
    hash=$(shasum -a 256 "public/VERDICT_REFERENCE_v1.md" | cut -d' ' -f1)
    echo "VERDICT_REFERENCE_v1.md: sha256:$hash" >> "$OUTPUT"
fi

# Axioms
echo "" >> "$OUTPUT"
echo "## Axioms" >> "$OUTPUT"
for file in core/axioms/*.json; do
    if [ -f "$file" ]; then
        hash=$(shasum -a 256 "$file" | cut -d' ' -f1)
        echo "$(basename $file): sha256:$hash" >> "$OUTPUT"
    fi
done

# Contracts
echo "" >> "$OUTPUT"
echo "## Contracts" >> "$OUTPUT"
for file in core/contracts/*.json; do
    if [ -f "$file" ]; then
        hash=$(shasum -a 256 "$file" | cut -d' ' -f1)
        echo "$(basename $file): sha256:$hash" >> "$OUTPUT"
    fi
done

# Schemas
echo "" >> "$OUTPUT"
echo "## Schemas" >> "$OUTPUT"
for file in core/schemas/*.json; do
    if [ -f "$file" ]; then
        hash=$(shasum -a 256 "$file" | cut -d' ' -f1)
        echo "$(basename $file): sha256:$hash" >> "$OUTPUT"
    fi
done

# Golden bundles
echo "" >> "$OUTPUT"
echo "## Golden Bundles" >> "$OUTPUT"
find tests/bundles -name "verdict.json" -type f | while read file; do
    hash=$(shasum -a 256 "$file" | cut -d' ' -f1)
    relpath=$(echo "$file" | sed 's|^tests/bundles/||')
    echo "$relpath: sha256:$hash" >> "$OUTPUT"
done

echo "" >> "$OUTPUT"
echo "# End of Canonical Hashes" >> "$OUTPUT"
echo "# These hashes are IMMUTABLE" >> "$OUTPUT"

echo "Canonical hashes computed: $OUTPUT"

