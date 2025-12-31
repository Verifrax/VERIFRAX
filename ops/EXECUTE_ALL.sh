#!/bin/bash
# Execute all phases top to bottom

set -e

echo "=== VERIFRAX v2.5.0 — OPERATIONAL EXECUTION ==="
echo ""

# PHASE 1 — SEE (PUBLIC SURFACE INTEGRITY)
echo "=== PHASE 1 — PUBLIC SURFACE INTEGRITY ==="
echo "1. Configure Cloudflare redirect rule (manual):"
echo "   See: ops/cloudflare_redirect_rule.md"
echo ""
echo "2. Verify canonical enforcement:"
./ops/verify_canonical_host.sh
echo ""

echo "3. Add version headers (worker updated):"
echo "   Deploy: worker-production-v2.5.0.js"
echo ""

echo "4. Freeze spec hashes:"
./ops/freeze_spec_hashes.sh
echo ""

# PHASE 2 — STRIPE (ECONOMIC GATE – FROZEN OFF)
echo "=== PHASE 2 — STRIPE (FROZEN OFF) ==="
echo "5. Verify payment disabled:"
./ops/verify_payment_disabled.sh
echo ""

echo "6. Pre-create Stripe objects (optional, unused):"
echo "   Run: ./ops/stripe_create_objects.sh"
echo "   NOTE: Requires Stripe CLI and API keys"
echo ""

# PHASE 3 — CREATE (EVIDENCE INTAKE)
echo "=== PHASE 3 — EVIDENCE INTAKE ==="
echo "7. Create S3 bucket:"
echo "   Run: ./ops/s3_create_bucket.sh"
echo "   NOTE: Requires AWS CLI and credentials"
echo ""

echo "8. Prepare evidence bundle:"
echo "   Run: ./ops/prepare_evidence_bundle.sh <evidence_directory>"
echo ""

echo "9. Create manifest:"
echo "   Template: ops/manifest_template.json"
echo ""

# PHASE 4 — VERIFY (DETERMINISTIC ENGINE)
echo "=== PHASE 4 — VERIFY ==="
echo "10. Execution sandbox:"
echo "    Run: ./ops/docker_verification.sh <evidence.zip>"
echo ""

echo "11. Deterministic execution:"
echo "    Run: ./ops/verifrax_verify.sh <bundle> <manifest> <profile>"
echo ""

# PHASE 5 — CERTIFICATE / PDF / QR
echo "=== PHASE 5 — CERTIFICATE DELIVERY ==="
echo "12. Canonical hash:"
echo "    Run: ./ops/verify_certificate_hash.sh <certificate.json>"
echo ""

echo "13. QR generation:"
echo "    Run: ./ops/generate_qr.sh <certificate_hash>"
echo ""

echo "14. PDF export:"
echo "    Run: ./ops/verifrax_export.sh <certificate.json> <certificate.qr.png>"
echo ""

# PHASE 6 — DELIVERY / COURTS / MEDIA
echo "=== PHASE 6 — DELIVERY ==="
echo "15. Offline verification:"
echo "    Run: ./ops/offline_verify.sh <certificate.json> <evidence.zip> <profile>"
echo ""

echo "16. Court exhibit pack:"
echo "    Run: ./ops/create_exhibit_pack.sh <cert.pdf> <cert.json> <evidence.zip>"
echo ""

# PHASE 7 — FREEZE EXECUTION
echo "=== PHASE 7 — FREEZE ==="
echo "17. Git tag:"
echo "    git tag -s v2.5.0 -m 'VERIFRAX v2.5.0 FINAL'"
echo "    git push origin v2.5.0"
echo ""

echo "=== EXECUTION COMPLETE ==="

