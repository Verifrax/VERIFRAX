#!/bin/bash
# VERIFRAX v2.5.0 Freeze Completion Script
# 
# This script completes the freeze process by:
# 1. Verifying /pay endpoint is disabled
# 2. Generating SHA256SUMS.txt
# 3. Committing freeze artifacts
# 4. Creating annotated tag v2.5.0
#
# CRITICAL: Run this only after:
# - All v2.5.0 artifacts are finalized
# - /pay endpoint is disabled (see FREEZE_BLOCKER.md)

set -e

echo "VERIFRAX v2.5.0 Freeze Completion"
echo "==================================="
echo ""

# Check if we're in the right directory
if [ ! -d "freeze/v2.5.0" ]; then
    echo "ERROR: Must run from VERIFRAX repository root"
    exit 1
fi

# CRITICAL: Verify /pay endpoint is disabled
echo "0. Verifying /pay endpoint is disabled..."
echo "   Checking: curl -i https://verifrax.net/pay"
PAY_RESPONSE=$(curl -s https://verifrax.net/pay || echo "ERROR")
PAY_HEADERS=$(curl -s -i https://verifrax.net/pay | head -n 10 || echo "ERROR")

# Check for Stripe.js
if echo "$PAY_RESPONSE" | grep -qi "js.stripe.com"; then
    echo "❌ ERROR: /pay endpoint is still loading Stripe.js"
    echo "   This means /pay is still functional and executing."
    echo "   See DISABLE_PAY_INSTRUCTIONS.md - you must delete routes on verifrax-edge-production"
    echo ""
    echo "   You MUST disable /pay before freezing v2.5.0."
    exit 1
fi

# Check for PaymentIntent references
if echo "$PAY_RESPONSE" | grep -qi "create-payment-intent\|PaymentIntent\|stripe"; then
    echo "❌ ERROR: /pay endpoint still references payment processing"
    echo "   This means /pay is still functional and executing."
    echo "   See DISABLE_PAY_INSTRUCTIONS.md - you must delete routes on verifrax-edge-production"
    echo ""
    echo "   You MUST disable /pay before freezing v2.5.0."
    exit 1
fi

# Check for 404/403 (acceptable)
if echo "$PAY_HEADERS" | grep -qi "404\|403"; then
    echo "✅ /pay endpoint returns 404/403 (disabled)"
elif [ -z "$PAY_RESPONSE" ] || [ "$PAY_RESPONSE" = "ERROR" ]; then
    echo "✅ /pay endpoint appears disabled (no response or error)"
else
    echo "⚠️  WARNING: /pay endpoint returns content (verify it's static HTML without Stripe)"
    echo "   Response preview:"
    echo "$PAY_RESPONSE" | head -n 5
    read -p "   Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verify API endpoint is dead
echo ""
echo "   Checking: curl -i -X POST https://verifrax.net/api/create-payment-intent"
API_RESPONSE=$(curl -s -i -X POST https://verifrax.net/api/create-payment-intent | head -n 5 || echo "ERROR")
if echo "$API_RESPONSE" | grep -qi "404\|403"; then
    echo "✅ /api/create-payment-intent returns 404/403 (disabled)"
else
    echo "❌ ERROR: /api/create-payment-intent is still functional"
    echo "   See DISABLE_PAY_INSTRUCTIONS.md - you must delete routes on verifrax-edge-production"
    exit 1
fi
echo ""

# Check git status
echo "1. Checking git status..."
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "WARNING: Uncommitted changes detected"
    echo "Please commit or stash changes before freezing"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Generate SHA256SUMS.txt
echo ""
echo "2. Generating SHA256SUMS.txt..."
cd freeze/v2.5.0
find . -type f \( -name "*.md" -o -name "*.js" -o -name "*.json" -o -name "*.txt" -o -name "*.sh" \) | sort | xargs sha256sum > SHA256SUMS.txt
echo "✅ SHA256SUMS.txt generated"

# Go back to root
cd ../..

# Get commit hash (will be created in next step)
echo ""
echo "3. Preparing to commit freeze artifacts..."
FREEZE_DATE=$(date -u +%Y-%m-%d)
echo "Freeze date: $FREEZE_DATE"

# Stage all freeze artifacts
git add freeze/v2.5.0/

# Commit
echo ""
echo "4. Committing freeze artifacts..."
git commit -m "Freeze v2.5.0: hashes and final artifacts" || {
    echo "ERROR: Commit failed. Check git status."
    exit 1
}

# Get the commit hash
FREEZE_COMMIT=$(git rev-parse HEAD)
echo "✅ Freeze commit: $FREEZE_COMMIT"

# Update SPEC and VERSION with freeze commit hash
echo ""
echo "5. Updating SPEC_v2.5.0_FINAL.md and VERSION.md with freeze commit hash..."
sed -i.bak "s/<TO_BE_FILLED>/$FREEZE_COMMIT/g" freeze/v2.5.0/SPEC_v2.5.0_FINAL.md
sed -i.bak "s/<TO_BE_FILLED>/$FREEZE_COMMIT/g" freeze/v2.5.0/VERSION.md
sed -i.bak "s/<DATE>/$FREEZE_DATE/g" freeze/v2.5.0/SPEC_v2.5.0_FINAL.md

# Remove backup files
rm -f freeze/v2.5.0/*.bak

# Commit the updated files
git add freeze/v2.5.0/SPEC_v2.5.0_FINAL.md freeze/v2.5.0/VERSION.md
git commit -m "Update v2.5.0 freeze commit hash and date" || {
    echo "WARNING: Could not commit updated freeze hash. Please commit manually."
}

# Create annotated tag
echo ""
echo "6. Creating annotated tag v2.5.0..."
git tag -a v2.5.0 -m "VERIFRAX v2.5.0 — Institution-Grade Delivery

This release adds structure and clarity, not power or custody.
All authority remains documentary + cryptographic.

Features:
- Verification Classification (informational only)
- Failure Class Taxonomy (taxonomic only)
- Trust Context Bundles (TCB) support (optional, external)
- Multi-Profile Attestation (parallel, non-collapsing)

Core Invariant:
v2.5.0 adds structure and clarity, not power or custody.
All authority remains documentary + cryptographic.

Freeze Commit: $FREEZE_COMMIT
Freeze Date: $FREEZE_DATE"

echo "✅ Tag v2.5.0 created"

# Verify
echo ""
echo "7. Verifying freeze completion..."
if git tag -l v2.5.0 | grep -q v2.5.0; then
    echo "✅ Tag v2.5.0 exists"
else
    echo "❌ ERROR: Tag v2.5.0 not found"
    exit 1
fi

if [ -f "freeze/v2.5.0/SHA256SUMS.txt" ]; then
    echo "✅ SHA256SUMS.txt exists"
else
    echo "❌ ERROR: SHA256SUMS.txt not found"
    exit 1
fi

echo ""
echo "==================================="
echo "✅ FREEZE COMPLETE"
echo "==================================="
echo ""
echo "Freeze commit: $FREEZE_COMMIT"
echo "Freeze date: $FREEZE_DATE"
echo "Tag: v2.5.0"
echo ""
echo "Next steps:"
echo "1. Push tag: git push origin v2.5.0"
echo "2. Verify /pay endpoint is disabled (see CLOUDFLARE_PAY_DISABLE.md)"
echo "3. Proceed to PHASE 7 release"

