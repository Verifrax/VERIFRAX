#!/usr/bin/env bash
set -euo pipefail

# Minimal deterministic gate (marketplace-safe default).
# If your repo later provides real authority checks, replace this implementation.
mode="${VERIFRAX_MODE:-enforce}"
cfg="${VERIFRAX_CONFIG:-.verifrax/gate.yml}"
fail_on_warn="${VERIFRAX_FAIL_ON_WARN:-false}"

# Example: fail if config explicitly requests fail.
if [[ -f "$cfg" ]] && grep -Eq '(^|\s)decision:\s*fail(\s|$)' "$cfg"; then
  echo "::error::VERIFRAX gate: decision=fail from $cfg"
  echo "fail"
  exit 1
fi

# Example: warn path (optional)
if [[ "$mode" == "audit" ]]; then
  echo "::notice::VERIFRAX gate: audit mode (non-blocking)"
  echo "warn"
  exit 0
fi

echo "pass"
