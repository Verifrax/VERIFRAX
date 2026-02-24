#!/usr/bin/env bash
# LIMENWARD v1.0.0
# Boundary enforcement utility
# Guards irreversible transitions. No execution. No remediation.

set -eu

# --- Preconditions ---------------------------------------------------------

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "LIMENWARD: not a git repository" >&2
  exit 2
}

LEDGER_DIR="${1:?LEDGER_PATH_REQUIRED}"
[ -d "$LEDGER_DIR" ] || exit 2
LOG="$LEDGER_DIR/limenward.log"

# --- Input ----------------------------------------------------------------

INPUT="$(cat)"

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

# Require explicit, anchored marker of finality
printf '%s' "$TEXT" | grep -Eq \
  '(^|[^a-z])(FINAL|APPROVED|READY|COMMIT|PUBLISH|RELEASE|EXECUTE)([^a-z]|$)' || {
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
  printf '%s\n' '---'
} >> "$LOG"

# --- Verdict --------------------------------------------------------------

printf '%s\n' "ALLOWED"
exit 0
