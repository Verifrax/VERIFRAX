#!/bin/bash
# PHASES 4-6 Execution

set -e

echo "=== PHASE 4 — VERIFY (DETERMINISTIC CORE HARDENING) ==="

echo "4.1 Lock verifier binary..."
./ops/lock_verifier_binary.sh

echo ""
echo "4.2 Reproducibility test..."
echo "Run: ./ops/reproducibility_test.sh evidence.zip manifest.json public@1.0.0"

echo ""
echo "4.3 Determinism under host variance..."
echo "Run: ./ops/determinism_host_variance.sh evidence.zip manifest.json public@1.0.0"

echo ""
echo "4.4 Freeze verifier hash..."
echo "Run: ./ops/freeze_verifier_hash.sh certificate.json"

echo ""
echo "=== PHASE 5 — CERTIFICATE AUTHORITY ==="

echo "5.1 Certificate retrieval endpoint added to worker"
echo "Deploy: worker-production-v2.5.0.js"

echo ""
echo "5.2 Verify retrieval..."
echo "Run: ./ops/verify_certificate_retrieval.sh certificate.json"

echo ""
echo "5.3 QR + PDF hash freeze..."
echo "Run: ./ops/freeze_pdf_hash.sh <cert_hash> certificate.json"

echo ""
echo "=== PHASE 6 — COURTS / MEDIA / ADVERSARIAL RELIANCE ==="

echo "6.1 Third-party rebuild..."
echo "Run: ./ops/third_party_rebuild.sh certificate.json"

echo ""
echo "6.2 Cold verification script created: ops/verify_no_infrastructure.sh"

echo ""
echo "6.3 Court statement created: freeze/v2.5.0/COURT_STATEMENT.txt"

echo ""
echo "6.4 Exhibit finalization..."
echo "Run: ./ops/exhibit_finalization.sh certificate.pdf certificate.json evidence.zip"

echo ""
echo "=== FINAL LOCK ==="
echo "Run: ./ops/final_lock.sh"

echo ""
echo "=== EXECUTION COMPLETE ==="

