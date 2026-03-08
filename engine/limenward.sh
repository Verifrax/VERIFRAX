#!/bin/sh
set -euo pipefail

# determinism hardening (CI)
: ${VF_DETERMINISTIC:=1}
export VF_DETERMINISTIC
export LC_ALL=C
export LANG=C
export TZ=UTC
umask 022
export PYTHONHASHSEED=0
export SOURCE_DATE_EPOCH=${SOURCE_DATE_EPOCH:-1709510400}
# LIMENWARD v0.1.0
# Boundary enforcement utility
# Guards transitions. No execution. No mutation. No remediation.

set -eu

# --- Preconditions ---------------------------------------------------------

# Must be inside a git repository
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "LIMENWARD: not a git repository" >&2
  exit 2
}

# --- Input ----------------------------------------------------------------

INPUT="$(cat)"

# Silence is a blocked transition
[ -z "$INPUT" ] && {
  printf '%s\n' "DENIED"
  exit 1
}

TEXT="$(printf '%s' "$INPUT")"

# --- Boundary Rules --------------------------------------------------------

# No uncertainty allowed at a boundary
printf '%s' "$TEXT" | grep -Eiq \
  '(^|[^a-z])(maybe|might|could|should|approx|guess|probably|likely|unclear|unknown)([^a-z]|$)' && {
  printf '%s\n' "DENIED"
  exit 1
}

# Require explicit marker of intent or finality
printf '%s' "$TEXT" | grep -Eq \
  '(^|[^a-z])(final|approved|ready|commit|publish|release|execute)([^a-z]|$)' || {
  printf '%s\n' "DENIED"
  exit 1
}

# --- Ledger ---------------------------------------------------------------

TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
COMMIT="$(git rev-parse --verify HEAD 2>/dev/null || printf '%s' UNCOMMITTED)"

{
  printf 'TIME: %s\n' "$TIMESTAMP"
  printf 'COMMIT: %s\n' "$COMMIT"
  printf 'INPUT:\n%s\n' "$TEXT"
  printf '---\n'
} >> LIMENWARD.log

# --- Verdict --------------------------------------------------------------

printf '%s\n' "ALLOWED"
exit 0
