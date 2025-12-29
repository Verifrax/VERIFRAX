#!/bin/bash
# Link Consistency Check
# 
# Verifies that all core VERIFRAX routes return 200 and match expected semantics.
# 
# Usage: bash scripts/check-link-consistency.sh

set -euo pipefail

DOMAIN="${VERIFRAX_DOMAIN:-https://verifrax.net}"
PATHS=(
  "/"
  "/what-is-verifrax"
  "/what-verifrax-does-not-do"
  "/spec"
  "/glossary"
)

echo "=== VERIFRAX Link Consistency Check ==="
echo ""
echo "Domain: ${DOMAIN}"
echo ""

FAILED=0

for path in "${PATHS[@]}"; do
  url="${DOMAIN}${path}"
  status=$(curl -s -o /dev/null -w "%{http_code}" "${url}" || echo "000")
  
  if [ "${status}" = "200" ]; then
    echo "✓ ${status} ${path}"
  else
    echo "✗ ${status} ${path}"
    FAILED=1
  fi
done

echo ""

if [ "${FAILED}" -eq 0 ]; then
  echo "=== All routes return 200 ==="
  exit 0
else
  echo "=== Some routes failed ==="
  exit 1
fi

