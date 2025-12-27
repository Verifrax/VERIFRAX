#!/usr/bin/env bash
# DNS/TLS diagnostics for RPC endpoint
# Usage: ./tools/check-rpc.sh <rpc-url>

set -euo pipefail
IFS=$'\n\t'

RPC="${1:-}"
if [[ -z "$RPC" ]]; then
  echo "usage: ./tools/check-rpc.sh <rpc-url>" >&2
  exit 2
fi

# Extract host from URL
RPC_HOST=$(echo "$RPC" | sed -E 's|^https?://([^/]+).*|\1|')

echo "Checking RPC: $RPC"
echo "Host: $RPC_HOST"
echo ""

echo "[1] DNS lookup (nslookup):"
if command -v nslookup >/dev/null 2>&1; then
  nslookup "$RPC_HOST" 2>&1 | head -5 || echo "  (nslookup failed)"
else
  echo "  (nslookup not available)"
fi

echo ""
echo "[2] DNS lookup (dig):"
if command -v dig >/dev/null 2>&1; then
  dig +short "$RPC_HOST" 2>&1 | head -5 || echo "  (dig failed)"
else
  echo "  (dig not available)"
fi

echo ""
echo "[3] HTTPS connectivity:"
if command -v curl >/dev/null 2>&1; then
  curl -sS -I --max-time 5 "$RPC" 2>&1 | head -10 || echo "  (curl failed)"
else
  echo "  (curl not available)"
fi

echo ""
echo "If all checks pass, the RPC endpoint should be resolvable by Node.js fetch."

