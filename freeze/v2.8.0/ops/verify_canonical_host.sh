#!/bin/bash
# Verify canonical host enforcement

echo "=== Canonical Host Verification ==="

check_redirect() {
    local url=$1
    local expected=$2
    local response=$(curl -s -o /dev/null -w "%{http_code}|%{redirect_url}" -L "$url")
    local code=$(echo "$response" | cut -d'|' -f1)
    local redirect=$(echo "$response" | cut -d'|' -f2)
    
    if [ "$code" = "200" ] && [[ "$redirect" == *"www.verifrax.net"* ]] || [ "$code" = "301" ] || [ "$code" = "302" ]; then
        echo "PASS: $url → redirects to www.verifrax.net"
    else
        echo "FAIL: $url → code: $code, redirect: $redirect"
        return 1
    fi
}

FAILED=0

check_redirect "http://verifrax.net" "https://www.verifrax.net" || FAILED=1
check_redirect "https://verifrax.net" "https://www.verifrax.net" || FAILED=1
check_redirect "http://www.verifrax.net" "https://www.verifrax.net" || FAILED=1

final=$(curl -s -o /dev/null -w "%{http_code}" "https://www.verifrax.net/")
if [ "$final" = "200" ]; then
    echo "PASS: https://www.verifrax.net/ returns 200"
else
    echo "FAIL: https://www.verifrax.net/ returns $final"
    FAILED=1
fi

if [ $FAILED -eq 0 ]; then
    echo "=== ALL CHECKS PASSED ==="
    exit 0
else
    echo "=== CHECKS FAILED ==="
    exit 1
fi

