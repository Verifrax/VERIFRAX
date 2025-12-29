#!/bin/bash
# Deploy verifrax-edge Worker to Cloudflare
#
# Usage: bash workers/verifrax-edge/deploy.sh
#
# Requires:
# - wrangler CLI installed (npm install -g wrangler)
# - CLOUDFLARE_API_TOKEN environment variable or wrangler login

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

echo "=== Deploying verifrax-edge Worker ==="
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
  echo "✗ Error: wrangler CLI not found"
  echo "Install with: npm install -g wrangler"
  exit 1
fi

# Deploy
echo "Deploying to Cloudflare..."
wrangler deploy

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Verify with:"
echo "  curl -i https://verifrax.net/"
echo "  curl -i https://verifrax.net/api/test"
echo "  curl -i https://verifrax.net/whatever"
echo ""
echo "Expected:"
echo "  / → 200, 'VERIFRAX\\nDeterministic verification system.\\n'"
echo "  /api/* → 501, 'VERIFRAX API: not implemented'"
echo "  /* → 404, 'Not found'"

