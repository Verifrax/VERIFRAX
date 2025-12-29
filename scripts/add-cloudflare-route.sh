#!/bin/bash
# Add Cloudflare Worker Route
# 
# Adds the /api/* route to verifrax.net pointing to verifrax-edge worker.
# 
# Usage: bash scripts/add-cloudflare-route.sh
# 
# Requires:
# - CLOUDFLARE_API_TOKEN environment variable (or uses default)
# - CLOUDFLARE_ACCOUNT_ID environment variable (or uses default)
# - CLOUDFLARE_ZONE_ID environment variable (or fetches automatically)

set -euo pipefail

CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-REDACTED_CLOUDFLARE_TOKEN}"
CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-cdc2afb98b3dd0a01a57d30ce5c24b73}"
DOMAIN="verifrax.net"
WORKER_NAME="verifrax-edge"
ROUTE_PATTERN="${DOMAIN}/api/*"

API_BASE="https://api.cloudflare.com/client/v4"

echo "=== Adding Cloudflare Worker Route ==="
echo ""
echo "Domain: ${DOMAIN}"
echo "Route: ${ROUTE_PATTERN}"
echo "Worker: ${WORKER_NAME}"
echo "Account ID: ${CLOUDFLARE_ACCOUNT_ID}"
echo ""

# Get zone ID if not provided
if [ -z "${CLOUDFLARE_ZONE_ID:-}" ]; then
  echo "Fetching zone ID for ${DOMAIN}..."
  ZONE_RESPONSE=$(curl -s -X GET "${API_BASE}/zones?name=${DOMAIN}" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json")
  
  ZONE_ID=$(echo "${ZONE_RESPONSE}" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  
  if [ -z "${ZONE_ID}" ]; then
    echo "✗ Error: Zone not found for domain: ${DOMAIN}"
    echo "Response: ${ZONE_RESPONSE}"
    exit 1
  fi
  
  echo "Zone ID: ${ZONE_ID}"
else
  ZONE_ID="${CLOUDFLARE_ZONE_ID}"
  echo "Using provided Zone ID: ${ZONE_ID}"
fi

# Check existing routes
echo ""
echo "Fetching existing routes..."
EXISTING_ROUTES=$(curl -s -X GET "${API_BASE}/zones/${ZONE_ID}/workers/routes" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json")

if echo "${EXISTING_ROUTES}" | grep -q "\"pattern\":\"${ROUTE_PATTERN}\""; then
  echo "Route already exists: ${ROUTE_PATTERN}"
  echo "Skipping route addition."
  exit 0
fi

# Add the route
echo ""
echo "Adding route: ${ROUTE_PATTERN} → ${WORKER_NAME}..."
ROUTE_RESPONSE=$(curl -s -X POST "${API_BASE}/zones/${ZONE_ID}/workers/routes" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"pattern\":\"${ROUTE_PATTERN}\",\"script\":\"${WORKER_NAME}\"}")

if echo "${ROUTE_RESPONSE}" | grep -q '"success":true'; then
  echo "✓ Route added successfully: ${ROUTE_PATTERN} → ${WORKER_NAME}"
else
  echo "✗ Error: Failed to add route"
  echo "Response: ${ROUTE_RESPONSE}"
  exit 1
fi

echo ""
echo "=== Route Configuration Complete ==="
echo ""
echo "Verify with:"
echo "  curl -i https://${DOMAIN}/api/ping"
echo ""
echo "Expected: Same behavior as before (Hello World!), but with semantic route structure."

