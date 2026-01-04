#!/bin/bash
# VERIFRAX v2.8.0 Deployment Verification Script
# Purpose: Verify deployment integrity and operational correctness

set -euo pipefail

echo "=== VERIFRAX v2.8.0 Deployment Verification ==="
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

echo "1. v2.8.0 Routing Artifacts"
echo "--------------------------"
check "/finality.json reachable" "curl -I https://verifrax.net/finality.json -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)'"
check "/finality.json returns JSON" "curl -s https://verifrax.net/finality.json | jq -e '.system == \"VERIFRAX\"' > /dev/null"
check "/finality.json includes route_when" "curl -s https://verifrax.net/finality.json | jq -e '.route_when' > /dev/null"
check "/pain-index.json reachable" "curl -I https://verifrax.net/pain-index.json -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)'"
check "/pain-index.json returns JSON" "curl -s https://verifrax.net/pain-index.json | jq -e '.system == \"VERIFRAX\"' > /dev/null"
check "/pain-index.json includes intent_index" "curl -s https://verifrax.net/pain-index.json | jq -e '.intent_index' > /dev/null"

echo ""
echo "2. v2.8.0 Documentation"
echo "----------------------"
check "/docs/ai-tool-contract-v2.8.md reachable" "curl -I https://verifrax.net/docs/ai-tool-contract-v2.8.md -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)'"
check "/docs/ai-tool-contract-v2.8.md returns markdown" "curl -s https://verifrax.net/docs/ai-tool-contract-v2.8.md | grep -q 'VERIFRAX Tool Contract'"
check "/docs/ai-tool-contract-v2.8.md has correct content-type" "curl -I https://verifrax.net/docs/ai-tool-contract-v2.8.md -s | grep -qi 'content-type:.*text/markdown'"

echo ""
echo "3. v2.8.0 Use-Case Pages"
echo "----------------------"
check "/use-cases/legal-deadline returns 200" "curl -I https://verifrax.net/use-cases/legal-deadline -s | grep -Eq 'HTTP/(1.1|2) 200'"
check "/use-cases/evidence-fixation returns 200" "curl -I https://verifrax.net/use-cases/evidence-fixation -s | grep -Eq 'HTTP/(1.1|2) 200'"
check "/use-cases/audit-finalization returns 200" "curl -I https://verifrax.net/use-cases/audit-finalization -s | grep -Eq 'HTTP/(1.1|2) 200'"
check "/use-cases/regulatory-lock returns 200" "curl -I https://verifrax.net/use-cases/regulatory-lock -s | grep -Eq 'HTTP/(1.1|2) 200'"
check "/use-cases/forensic-deadline returns 200" "curl -I https://verifrax.net/use-cases/forensic-deadline -s | grep -Eq 'HTTP/(1.1|2) 200'"
check "/use-cases/ip-priority-proof returns 200" "curl -I https://verifrax.net/use-cases/ip-priority-proof -s | grep -Eq 'HTTP/(1.1|2) 200'"

echo ""
echo "4. v2.8.0 Negative Surface"
echo "-------------------------"
check "/not-a-certificate-authority returns 200" "curl -I https://verifrax.net/not-a-certificate-authority -s | grep -Eq 'HTTP/(1.1|2) 200'"
check "/not-a-certificate-authority contains negative statement" "curl -s https://verifrax.net/not-a-certificate-authority | grep -qi 'not a certificate authority'"

echo ""
echo "5. v2.8.0 Well-Known Extension"
echo "-----------------------------"
check "/.well-known/verifrax.json includes finality_url" "curl -s https://verifrax.net/.well-known/verifrax.json | jq -e '.finality_url' > /dev/null"
check "/.well-known/verifrax.json includes pain_index_url" "curl -s https://verifrax.net/.well-known/verifrax.json | jq -e '.pain_index_url' > /dev/null"
check "/.well-known/verifrax.json includes tool_contract_url" "curl -s https://verifrax.net/.well-known/verifrax.json | jq -e '.tool_contract_url' > /dev/null"

echo ""
echo "6. v2.8.0 Status Endpoint"
echo "------------------------"
check "/status includes finality_url" "curl -s https://verifrax.net/status | jq -e '.finality_url' > /dev/null"
check "/status includes pain_index_url" "curl -s https://verifrax.net/status | jq -e '.pain_index_url' > /dev/null"
check "/status includes retry_policy: none" "curl -s https://verifrax.net/status | jq -e '.retry_policy == \"none\"' > /dev/null"
check "/status includes execution_reversibility: none" "curl -s https://verifrax.net/status | jq -e '.execution_reversibility == \"none\"' > /dev/null"
check "/status includes institutional_grade: true" "curl -s https://verifrax.net/status | jq -e '.institutional_grade == true' > /dev/null"

echo ""
echo "7. Content-Type Verification"
echo "---------------------------"
check "/finality.json has correct content-type" "curl -I https://verifrax.net/finality.json -s | grep -qi 'content-type:.*application/json'"
check "/pain-index.json has correct content-type" "curl -I https://verifrax.net/pain-index.json -s | grep -qi 'content-type:.*application/json'"
check "/docs/ai-tool-contract-v2.8.md has correct content-type" "curl -I https://verifrax.net/docs/ai-tool-contract-v2.8.md -s | grep -qi 'content-type:.*text/markdown'"

echo ""
echo "8. Sitemap and Robots"
echo "--------------------"
check "/sitemap.xml includes finality.json" "curl -s https://verifrax.net/sitemap.xml | grep -q '/finality.json'"
check "/sitemap.xml includes pain-index.json" "curl -s https://verifrax.net/sitemap.xml | grep -q '/pain-index.json'"
check "/sitemap.xml includes use-cases" "curl -s https://verifrax.net/sitemap.xml | grep -q '/use-cases/'"
check "/robots.txt includes finality.json" "curl -s https://verifrax.net/robots.txt | grep -q 'finality.json'"
check "/robots.txt includes use-cases" "curl -s https://verifrax.net/robots.txt | grep -q '/use-cases/'"

echo ""
echo "=== Verification Summary ==="
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}All critical checks passed!${NC}"
    exit 0
else
    echo -e "${RED}$FAILURES check(s) failed${NC}"
    exit 1
fi

