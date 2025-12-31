#!/bin/bash
# Final lock

set -e

echo "=== Final Lock ==="

git add freeze/v2.5.0
git commit -m "Freeze v2.5.0 operational artifacts"
git tag -s v2.5.0-final -m "VERIFRAX v2.5.0 FINAL FACT"
git push origin v2.5.0-final

echo "=== Lock complete ==="

