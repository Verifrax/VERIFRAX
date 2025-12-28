#!/bin/bash
# Final Commit and Tag Script
#
# Execute this when git write access is available.
# This is the TRUE TERMINAL COMMIT for VERIFRAX v1.

set -euo pipefail

echo "=== VERIFRAX v1 — Final Commit and Tag ==="
echo ""

# 1. Stage everything that defines v1 finality
echo "1. Staging all v1 finality files..."
git add \
README.md \
VERSION.txt \
FREEZE_NOTICE.md \
POSITION.md \
V1_TERMINAL.md \
.github \
core \
docs \
engines \
index \
public \
scripts \
verification \
verifrax-verifier-min \
CANONICAL_HASHES_v1.txt \
IMMUTABILITY_SEAL_v1.txt \
SCRIPTS_HASHES_v1.txt \
ENVIRONMENT_FINGERPRINT.txt \
BUILD_ATTESTATION.md \
build.provenance.json \
FINALITY_V1_STATUS.md \
FINAL_EXECUTION_STATUS.md \
EXECUTION_READY.md \
PHASE2_COMPLETE.md \
PHASE3_COMPLETE.md \
PHASE4_COMPLETE.md \
PHASE5_COMPLETE.md \
adapters \
archive 2>/dev/null || git add -A

echo "   ✅ Files staged"
echo ""

# 2. Create the true terminal commit
echo "2. Creating terminal commit..."
git commit -m "verifrax v1: finality locked, authority removed, references published"
COMMIT_HASH=$(git rev-parse HEAD)
echo "   ✅ Commit created: $COMMIT_HASH"
echo ""

# 3. Move the tag (CRITICAL)
echo "3. Moving tag to correct commit..."
git tag -d v1-finality 2>/dev/null || echo "   (Tag did not exist locally)"
git tag -a v1-finality -m "VERIFRAX v1 — Finality established, authority removed"
echo "   ✅ Tag created at: $COMMIT_HASH"
echo ""

# 4. Push (if remote exists)
if git remote | grep -q origin; then
    echo "4. Pushing to remote..."
    git push origin :refs/tags/v1-finality 2>/dev/null || echo "   (Tag did not exist on remote)"
    git push origin v1-finality
    echo "   ✅ Tag pushed"
else
    echo "4. No remote configured. Tag created locally."
fi
echo ""

# 5. Final verification
echo "5. Verifying tag points to correct commit..."
git show v1-finality --stat | head -50
echo ""

echo "=== VERIFRAX v1 — FINAL ==="
echo ""
echo "Terminal commit: $COMMIT_HASH"
echo "Tag: v1-finality"
echo ""
echo "All v1 finality files committed and tagged."

