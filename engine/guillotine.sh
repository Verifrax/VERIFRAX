#!/usr/bin/env bash
# GUILLOTINE v1.0.0
# Irreversible execution terminator
# One-way. Restricted. CI-safe.

set -eu

# --- Preconditions ---------------------------------------------------------

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 2

# --- CI SAFETY GUARD -------------------------------------------------------

# Guillotine is NEVER allowed to operate on arbitrary repo paths in CI.
# It may only clear CICULLIS internal state.

if [ "${CI:-}" = "true" ]; then
  printf '%s\n' "GUILLOTINE: REFUSED_IN_CI"
  exit 1
fi

STATE_DIR="internal/state"

[ -d "$STATE_DIR" ] || {
  printf '%s\n' "GUILLOTINE: NO_STATE"
  exit 1
}

# --- Restricted Execution --------------------------------------------------

rm -rf -- "$STATE_DIR"/*

printf '%s\n' "EXECUTED"
exit 1
