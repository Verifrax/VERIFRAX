#!/bin/bash
# Phase 1 — Public Surface Integrity

set -e

echo "=== PHASE 1 — PUBLIC SURFACE INTEGRITY ==="

# 1. Verify canonical host (manual Cloudflare config required)
echo "1. Verify canonical host enforcement..."
echo "   Run: ops/verify_canonical_host.sh"
echo "   NOTE: Cloudflare redirect rule must be configured manually"
echo ""

# 2. Freeze spec hashes
echo "2. Freezing spec hashes..."
./ops/freeze_spec_hashes.sh
echo ""

# 3. Verify payment disabled
echo "3. Verifying payment disabled..."
./ops/verify_payment_disabled.sh
echo ""

echo "=== PHASE 1 COMPLETE ==="

