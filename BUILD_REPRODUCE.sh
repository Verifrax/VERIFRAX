#!/bin/bash
# VERIFRAX Build Reproduction Script
# Outputs deterministic hashes for all authoritative artifacts

set -e

echo "VERIFRAX Build Reproduction"
echo "==========================="
echo ""
echo "Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "Git commit: $(git rev-parse HEAD 2>/dev/null || echo 'not in git')"
echo ""

echo "Engine Hashes:"
echo "--------------"
if [ -f "verifrax-engine/execute_v2_6_0.js" ]; then
    sha256sum verifrax-engine/execute_v2_6_0.js
else
    echo "Engine file not found"
fi
echo ""

echo "Reference Verifier Hashes:"
echo "--------------------------"
if [ -d "verifrax-reference-verifier" ]; then
    find verifrax-reference-verifier -name "*.js" -exec sha256sum {} \;
else
    echo "Reference verifier directory not found"
fi
echo ""

echo "Frozen Snapshot Hashes:"
echo "-----------------------"
if [ -d "verifrax-freeze" ]; then
    find verifrax-freeze -name "worker.js" -exec sha256sum {} \;
else
    echo "Freeze directory not found"
fi
echo ""

echo "Schema Hashes:"
echo "--------------"
if [ -d "core/schema" ]; then
    find core/schema -name "*.json" -exec sha256sum {} \;
else
    echo "Schema directory not found"
fi
echo ""

# Output combined hash
echo "Combined Build Hash:"
echo "--------------------"
{
    sha256sum verifrax-engine/execute_v2_6_0.js 2>/dev/null || true
    find verifrax-reference-verifier -name "*.js" -exec sha256sum {} \; 2>/dev/null || true
    find verifrax-freeze -name "worker.js" -exec sha256sum {} \; 2>/dev/null || true
} | sha256sum | cut -d' ' -f1 > BUILD_HASH.txt

cat BUILD_HASH.txt
echo ""
echo "Build hash written to BUILD_HASH.txt"
