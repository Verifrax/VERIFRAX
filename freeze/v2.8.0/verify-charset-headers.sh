#!/bin/bash
# VERIFRAX Charset Header Verification
# Verifies all endpoints return Content-Type with charset=utf-8

set -e

BASE_URL="https://www.verifrax.net"
FAIL=0

echo "=== VERIFRAX CHARSET HEADER VERIFICATION ==="
echo ""

check_url() {
  local url=$1
  local expected_type=$2
  
  echo "Checking: $url"
  
  # Get headers only
  headers=$(curl -sI "$url" 2>&1)
  
  if [ $? -ne 0 ]; then
    echo "  ❌ FAIL: curl error"
    FAIL=1
    return
  fi
  
  # Extract Content-Type
  content_type=$(echo "$headers" | grep -i "content-type:" | head -1 | cut -d' ' -f2- | tr -d '\r\n')
  
  if [ -z "$content_type" ]; then
    echo "  ❌ FAIL: No Content-Type header"
    FAIL=1
    return
  fi
  
  # Check for charset=utf-8
  if echo "$content_type" | grep -qi "charset=utf-8"; then
    echo "  ✅ PASS: $content_type"
  else
    echo "  ❌ FAIL: Missing charset=utf-8 (got: $content_type)"
    FAIL=1
  fi
  
  # Check for expected type
  if [ -n "$expected_type" ]; then
    if echo "$content_type" | grep -qi "$expected_type"; then
      echo "    Type matches: $expected_type"
    else
      echo "    ⚠️  Type mismatch (expected: $expected_type, got: $content_type)"
    fi
  fi
  
  echo ""
}

# Root & Canonical
check_url "$BASE_URL/" "text/html"
check_url "https://verifrax.net/" "text/html"  # Should redirect

# Core Product Surfaces
check_url "$BASE_URL/verify" "text/html"
check_url "$BASE_URL/pricing" "text/plain"
check_url "$BASE_URL/start?tier=public" "text/html"
check_url "$BASE_URL/start?tier=pro" "text/html"
check_url "$BASE_URL/institutional" "text/html"

# Legal / Governance
check_url "$BASE_URL/terms" "text/plain"
check_url "$BASE_URL/privacy" "text/plain"
check_url "$BASE_URL/refunds" "text/plain"
check_url "$BASE_URL/legal" "text/plain"
check_url "$BASE_URL/status" "application/json"

# Certificate (if exists - will 404 if no certs)
# This is expected to fail if no certificates exist
echo "Checking: $BASE_URL/certificate/test123"
cert_headers=$(curl -sI "$BASE_URL/certificate/test123" 2>&1)
cert_status=$(echo "$cert_headers" | head -1 | grep -oE "[0-9]{3}")
if [ "$cert_status" = "404" ]; then
  echo "  ⚠️  SKIP: No certificate exists (404 expected)"
else
  check_url "$BASE_URL/certificate/test123" "text/html"
fi
echo ""

# Final result
echo "=== VERIFICATION COMPLETE ==="
if [ $FAIL -eq 0 ]; then
  echo "✅ ALL CHECKS PASSED"
  exit 0
else
  echo "❌ SOME CHECKS FAILED"
  exit 1
fi

