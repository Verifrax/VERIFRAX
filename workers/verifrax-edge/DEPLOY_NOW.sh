#!/bin/bash
# DEPLOY verifrax-edge Worker
# 
# Run this from the workers/verifrax-edge directory
# 
# Prerequisites:
# - wrangler CLI installed: npm install -g wrangler
# - wrangler authenticated: wrangler login

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

echo "=== Deploying verifrax-edge Worker ==="
echo ""
echo "Current directory: $(pwd)"
echo ""

# Verify files exist
if [ ! -f "wrangler.toml" ]; then
  echo "✗ Error: wrangler.toml not found"
  echo "You must run this from the workers/verifrax-edge directory"
  exit 1
fi

if [ ! -f "src/index.js" ]; then
  echo "✗ Error: src/index.js not found"
  exit 1
fi

# Verify the route is in the code
if ! grep -q "/what-is-verifrax" src/index.js; then
  echo "✗ Error: /what-is-verifrax route not found in src/index.js"
  exit 1
fi

echo "✓ Files verified"
echo ""

# Deploy
echo "Deploying to Cloudflare..."
echo "Command: npx wrangler deploy --env=\"\""
echo ""

npx wrangler deploy --env=""

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Verify with:"
echo "  curl -i https://verifrax.net/what-is-verifrax"
echo ""
echo "Expected:"
echo "  HTTP/2 200"
echo "  VERIFRAX is a deterministic verification system that produces a final, reproducible verdict for an evidence bundle."

