#!/bin/bash
# Verify payment endpoints are disabled

echo "=== Payment Disabled Verification ==="

check_payment_endpoint() {
    local url=$1
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    local headers=$(curl -s -I "$url")
    
    if [ "$response" = "410" ]; then
        if echo "$headers" | grep -q "X-Payment-Status: disabled"; then
            echo "PASS: $url returns 410 with X-Payment-Status: disabled"
            return 0
        else
            echo "FAIL: $url returns 410 but missing X-Payment-Status header"
            return 1
        fi
    else
        echo "FAIL: $url returns $response (expected 410)"
        return 1
    fi
}

FAILED=0

check_payment_endpoint "https://www.verifrax.net/pay" || FAILED=1
check_payment_endpoint "https://www.verifrax.net/api/create-payment-intent" || FAILED=1

if [ $FAILED -eq 0 ]; then
    echo "=== ALL CHECKS PASSED ==="
    exit 0
else
    echo "=== CHECKS FAILED ==="
    exit 1
fi

