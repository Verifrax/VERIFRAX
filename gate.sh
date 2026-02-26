#!/usr/bin/env bash
set -euo pipefail

mode="${VERIFRAX_MODE:-enforce}"
cfg="${VERIFRAX_CONFIG:-.verifrax/gate.yml}"
fail_on_warn="${VERIFRAX_FAIL_ON_WARN:-false}"

# Canonical profile path (used by repo integrity checks).
profile_path="${VERIFRAX_PROFILE:-.verifrax/profile.json}"

# Exit code contract:
#  - 0: pass/warn (non-fatal)
#  - 1: fail (policy failure)
#  - 2: malformed/invalid profile (format/schema parse failure)

is_malformed_profile() {
  local p="$1"
  [[ -f "$p" ]] || return 1

  case "$p" in
    *.json)
      python3 - <<PY "$p" >/dev/null 2>&1 || return 0
import json,sys
with open(sys.argv[1],'r',encoding='utf-8') as f:
  json.load(f)
PY
      return 1
      ;;
    *.yml|*.yaml)
      # minimal YAML sanity: reject tabs + require at least one ':' key delimiter
      if grep -n $'\t' "$p" >/dev/null 2>&1; then return 0; fi
      if ! grep -Eq '^[[:space:]]*[A-Za-z0-9_.-]+[[:space:]]*:' "$p"; then return 0; fi
      return 1
      ;;
    *)
      return 0
      ;;
  esac
}

if is_malformed_profile "$profile_path"; then
  echo "::error::VERIFRAX malformed profile: $profile_path"
  exit 2
fi

# Example: explicit fail directive in cfg
if [[ -f "$cfg" ]] && grep -Eq '(^|[[:space:]])decision:[[:space:]]*fail([[:space:]]|$)' "$cfg"; then
  echo "::error::VERIFRAX gate: decision=fail from $cfg"
  echo "fail"
  exit 1
fi

if [[ "$mode" == "audit" ]]; then
  echo "::notice::VERIFRAX gate: audit mode"
  echo "warn"
  exit 0
fi

echo "pass"
exit 0
