#!/usr/bin/env bash
set -euo pipefail

mode="${VERIFRAX_MODE:-enforce}"
cfg="${VERIFRAX_CONFIG:-.verifrax/gate.yml}"

profile_path="profiles/default.profile"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile)
      shift
      profile_path="${1:-}"
      shift || true
      ;;
    --profile=*)
      profile_path="${1#*=}"
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# malformed profile contract: exit 2 (Integrity Checks expects this)
if [[ -n "${profile_path:-}" ]] && [[ -f "$profile_path" ]]; then
  if grep -Eq '[{}]' "$profile_path"; then
    echo "::error::VERIFRAX malformed profile: $profile_path"
    exit 2
  fi
else
  # missing/unreadable profile is also a profile load error -> exit 2
  echo "::error::VERIFRAX profile missing/unreadable: ${profile_path:-<empty>}"
  exit 2
fi

# explicit fail directive in cfg
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
