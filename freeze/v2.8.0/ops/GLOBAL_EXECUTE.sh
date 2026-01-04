#!/bin/bash
# GLOBAL EXECUTION — VERIFRAX v2.5.0 FINAL

set -e

echo "=== GLOBAL PRE-FLIGHT ==="
git status
git pull --ff-only
chmod +x ops/*.sh

echo ""
echo "=== GITHUB — CANONICAL AUTHORITY ==="
echo "G1 — Protect main branch (requires gh CLI)..."
gh api repos/:owner/:repo/branches/main/protection \
  -X PUT \
  -f required_status_checks.strict=true \
  -f enforce_admins=true \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_pull_request_reviews.required_approving_review_count=1

echo "G2 — Push freeze artifacts..."
git add freeze/v2.5.0 ops
git commit -m "VERIFRAX v2.5.0 — operational freeze complete"
git push origin main

echo "G3 — Signed tag..."
git tag -s v2.5.0-final -m "VERIFRAX v2.5.0 FINAL AUTHORITY"
git push origin v2.5.0-final

echo ""
echo "=== CLOUDFLARE — PUBLIC SURFACE LIVE ==="
echo "C1 — Deploy Worker..."
wrangler deploy worker-production-v2.5.0.js --env production

echo "C2 — Verify hard kill..."
curl -i https://www.verifrax.net/pay
curl -i https://www.verifrax.net/api/create-payment-intent

echo "C3 — Verify surfaces..."
curl -i https://www.verifrax.net/
curl -i https://www.verifrax.net/spec
curl -i https://www.verifrax.net/glossary
curl -i https://www.verifrax.net/status
curl -i https://www.verifrax.net/reference-verifier

echo "C4 — Enforce canonical host (manual)..."
echo "Apply: ops/cloudflare_redirect_rule.md"
./ops/verify_canonical_host.sh

echo ""
echo "=== AWS — EVIDENCE STORAGE LIVE ==="
echo "A1 — Create locked bucket..."
./ops/s3_create_bucket.sh

echo "A2 — Verify bucket state..."
aws s3api get-bucket-object-lock-configuration --bucket verifrax-evidence
aws s3api get-bucket-versioning --bucket verifrax-evidence
aws s3api get-public-access-block --bucket verifrax-evidence

echo ""
echo "=== STRIPE — PRE-ARM (INERT, READY) ==="
echo "S1 — Create objects..."
./ops/stripe_create_objects.sh

echo "S2 — Lock Stripe keys..."
wrangler secret put STRIPE_SECRET_KEY --env production
wrangler secret put STRIPE_WEBHOOK_SECRET --env production

echo "S3 — DO NOT ENABLE ROUTES (payment disabled)"

echo ""
echo "=== PHASE 4 — VERIFY ==="
./ops/lock_verifier_binary.sh
./ops/reproducibility_test.sh evidence.zip manifest.json public@1.0.0
./ops/determinism_host_variance.sh evidence.zip manifest.json public@1.0.0
./ops/freeze_verifier_hash.sh certificate.json

echo ""
echo "=== PHASE 5 — CERTIFICATE AUTHORITY ==="
./ops/verify_certificate_retrieval.sh certificate.json
CERT_HASH=$(shasum -a 256 certificate.json | cut -d' ' -f1)
./ops/freeze_pdf_hash.sh "$CERT_HASH" certificate.json

echo ""
echo "=== PHASE 6 — COURTS / MEDIA ==="
./ops/third_party_rebuild.sh certificate.json
./ops/verify_no_infrastructure.sh certificate.json evidence.zip
./ops/exhibit_finalization.sh certificate.pdf certificate.json evidence.zip

echo ""
echo "=== FINAL GLOBAL LOCK ==="
./ops/final_lock.sh

echo ""
echo "=== SYSTEM STATE ==="
echo "GitHub = canonical authority"
echo "Cloudflare = public immutable surface"
echo "AWS = locked evidence vault"
echo "Stripe = armed but inert"
echo "Certificates = court-grade"
echo "Operator = irrelevant post-execution"

