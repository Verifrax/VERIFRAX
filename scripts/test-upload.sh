#!/bin/bash
# VERIFRAX v2 Upload Integration Test
# Tests the /api/upload endpoint with a minimal bundle

set -e

API_URL="${API_URL:-https://verifrax.net/api/upload}"
PAYMENT_INTENT="${PAYMENT_INTENT:-pi_test_$(date +%s)}"
TEST_BUNDLE="/tmp/verifrax-test-bundle-$$.bin"

# Create a minimal test bundle (1KB)
dd if=/dev/urandom of="$TEST_BUNDLE" bs=1024 count=1 2>/dev/null

# Cleanup on exit
trap "rm -f $TEST_BUNDLE" EXIT

echo "Testing VERIFRAX v2 upload endpoint..."
echo "URL: $API_URL"
echo "Payment Intent: $PAYMENT_INTENT"
echo ""

# Perform upload
RESPONSE=$(curl -i -X POST "$API_URL" \
  -H "Content-Length: $(stat -f%z "$TEST_BUNDLE" 2>/dev/null || stat -c%s "$TEST_BUNDLE" 2>/dev/null)" \
  -H "Content-Type: application/octet-stream" \
  -H "x-payment-intent-id: $PAYMENT_INTENT" \
  --data-binary "@$TEST_BUNDLE" \
  2>&1)

# Extract status code
STATUS=$(echo "$RESPONSE" | grep -i "^HTTP" | head -1 | awk '{print $2}')

# Extract body (everything after first blank line)
BODY=$(echo "$RESPONSE" | awk '/^$/{flag=1; next} flag')

echo "Response Status: $STATUS"
echo "Response Body:"
echo "$BODY"
echo ""

# Validate status
if [ "$STATUS" != "201" ]; then
  echo "❌ FAIL: Expected status 201, got $STATUS"
  exit 1
fi

# Validate response structure
if ! echo "$BODY" | grep -q '"upload_id"'; then
  echo "❌ FAIL: Response missing 'upload_id'"
  exit 1
fi

if ! echo "$BODY" | grep -q '"bundle_hash"'; then
  echo "❌ FAIL: Response missing 'bundle_hash'"
  exit 1
fi

echo "✅ PASS: Upload endpoint returned 201 with upload_id and bundle_hash"
exit 0

