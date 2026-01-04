#!/bin/bash
# VERIFRAX v2.7.0 Deployment Verification Script
# Purpose: Verify deployment integrity and operational correctness

set -euo pipefail

echo "=== VERIFRAX v2.7.0 Deployment Verification ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS="${GREEN}✓${NC}"
FAIL="${RED}✗${NC}"
WARN="${YELLOW}⚠${NC}"

# Track failures
FAILURES=0

check() {
    local name="$1"
    local cmd="$2"
    echo -n "Checking $name... "
    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "$PASS"
        return 0
    else
        echo -e "$FAIL"
        FAILURES=$((FAILURES + 1))
        return 1
    fi
}

warn() {
    local name="$1"
    local cmd="$2"
    echo -n "Checking $name... "
    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "$PASS"
        return 0
    else
        echo -e "$WARN (non-critical)"
        return 1
    fi
}

echo "1. Git Tag Verification"
echo "----------------------"
check "v2.7.0 tag exists" "git ls-remote https://github.com/Verifrax/VERIFRAX refs/tags/v2.7.0"
check "v2.4.0 tag exists (backward compatibility)" "git ls-remote https://github.com/Verifrax/VERIFRAX refs/tags/v2.4.0"

echo ""
echo "2. DNS Resolution"
echo "----------------"
check "verifrax.net resolves" "dig verifrax.net +short | grep -q ."
check "www.verifrax.net resolves" "dig www.verifrax.net +short | grep -q ."

echo ""
echo "3. TLS/HTTPS Connectivity"
echo "-------------------------"
# Accept HTTP/1.1 or HTTP/2, and status codes 200, 301, 302 (redirects are valid)
check "HTTPS accessible (verifrax.net)" "curl -I https://verifrax.net/ -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)'"
check "HTTPS accessible (www.verifrax.net)" "curl -I https://www.verifrax.net/ -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)'"
check "Cloudflare server header (verifrax.net)" "curl -I https://verifrax.net/ -s | grep -qi 'server: cloudflare'"
check "Cloudflare server header (www.verifrax.net)" "curl -I https://www.verifrax.net/ -s | grep -qi 'server: cloudflare'"

echo ""
echo "3a. Root Path Routing (First-Class Surface)"
echo "-------------------------------------------"
# Root path '/' is intentionally a first-class surface (see ROUTING_ARCHITECTURE_v2.7.0.md)
# This checks that Worker route is configured correctly, not just TLS
check "Root path '/' returns 200 (not 404)" "curl -I https://verifrax.net/ -s | grep -Eq 'HTTP/(1.1|2) 200'"
check "Root path content is HTML" "curl -s https://verifrax.net/ | grep -qi '<!doctype html>'"

echo ""
echo "4. Authoritative Documentation"
echo "------------------------------"
# Accept any successful HTTP response (200, 301, 302) for documentation endpoints
check "Spec endpoint accessible" "curl -I https://verifrax.net/spec -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)' && curl -s https://verifrax.net/spec | grep -q 'VERIFRAX'"
warn "Glossary endpoint accessible" "curl -I https://verifrax.net/glossary -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)' && curl -s https://verifrax.net/glossary | grep -q ."

echo ""
echo "5. Negative Path Verification (Must Fail)"
echo "----------------------------------------"
check "POST /api/upload without auth (must fail)" "curl -X POST https://verifrax.net/api/upload -s | grep -q 'error\|404\|401'"
check "POST /api/verify without token (must fail)" "curl -X POST https://verifrax.net/api/verify -s | grep -q 'error\|401'"
check "GET /api/certificate invalid (must fail)" "curl -s https://verifrax.net/api/certificate | grep -q 'error\|404'"

echo ""
echo "6. Status Endpoints"
echo "-------------------"
check "/status accessible" "curl -I https://verifrax.net/status -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)'"
check "/status returns JSON" "curl -s https://verifrax.net/status | grep -q 'version'"
check "/status includes do_not_route_when" "curl -s https://verifrax.net/status | grep -q 'do_not_route_when'"

echo ""
echo "7. Well-Known Endpoints"
echo "----------------------"
check "/.well-known/verifrax.json accessible" "curl -I https://verifrax.net/.well-known/verifrax.json -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)' && curl -s https://verifrax.net/.well-known/verifrax.json | grep -q 'VERIFRAX'"
check "/.well-known/verifrax.json includes do_not_route_when" "curl -s https://verifrax.net/.well-known/verifrax.json | grep -q 'do_not_route_when'"

echo ""
echo "8. Profile Manifests (Level-Up #1)"
echo "----------------------------------"
check "Profile manifest endpoint accessible" "curl -I https://verifrax.net/profiles/public@1.0.0.json -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)'"
check "Profile manifest endpoint exists" "curl -s https://verifrax.net/profiles/public@1.0.0.json | grep -q 'profile_manifest_hash'"
check "Profile manifest has valid hash" "curl -s https://verifrax.net/profiles/public@1.0.0.json | grep -q 'profile_manifest_hash.*[0-9a-f]\{64\}'"

echo ""
echo "9. Legal Documents (Level-Up #8)"
echo "---------------------------------"
check "Certificate Meaning Statement accessible" "curl -I https://verifrax.net/legal/CERTIFICATE_MEANING_STATEMENT_v2.7.0.md -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)' && curl -s https://verifrax.net/legal/CERTIFICATE_MEANING_STATEMENT_v2.7.0.md | grep -q 'CERTIFICATE MEANING'"
check "Non-Reliance Statement accessible" "curl -I https://verifrax.net/legal/NON_RELIANCE_AND_NON_ADVICE_STATEMENT_v2.7.0.md -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)' && curl -s https://verifrax.net/legal/NON_RELIANCE_AND_NON_ADVICE_STATEMENT_v2.7.0.md | grep -q 'NON-RELIANCE'"

echo ""
echo "10. Error Catalog (Level-Up #7)"
echo "-------------------------------"
check "Error catalog accessible" "curl -I https://verifrax.net/api/errors -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)' && curl -s https://verifrax.net/api/errors | grep -q 'version'"
check "Error catalog includes class field" "curl -s https://verifrax.net/api/errors | grep -q '\"class\"'"
check "Error catalog includes operator_action field" "curl -s https://verifrax.net/api/errors | grep -q 'operator_action'"

echo ""
echo "11. Certificate Schema (Level-Up #2)"
echo "------------------------------------"
check "Certificate schema v2 accessible" "test -f core/schemas/certificate.v2.schema.json"
check "Certificate schema includes cert_schema field" "grep -q 'cert_schema' core/schemas/certificate.v2.schema.json"
check "Certificate schema includes tool_identity" "grep -q 'tool_identity' core/schemas/certificate.v2.schema.json"
check "Certificate schema includes profile_manifest_hash" "grep -q 'profile_manifest_hash' core/schemas/certificate.v2.schema.json"

echo ""
echo "12. Stripe Integration (if credentials available)"
echo "------------------------------------------------"
if [ -n "${STRIPE_SECRET_KEY:-}" ]; then
    check "Stripe API accessible" "curl -s -u $STRIPE_SECRET_KEY: https://api.stripe.com/v1/account | grep -q 'id'"
    check "Payment intent creation endpoint" "curl -X POST https://verifrax.net/api/create-payment-intent -H 'Content-Type: application/json' -d '{\"tier\":\"A\"}' -s | grep -q 'checkout_url\|error'"
else
    echo -e "${WARN} STRIPE_SECRET_KEY not set, skipping Stripe checks"
fi

echo ""
echo "=== Verification Summary ==="
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}All critical checks passed!${NC}"
    exit 0
else
    echo -e "${RED}$FAILURES check(s) failed${NC}"
    exit 1
fi

