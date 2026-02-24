#!/usr/bin/env bash
# ARCHICUSTOS v1.0.0
# Custody tracking utility
# Records custody claims with continuity enforcement.
# No execution. No remediation.

set -eu

# --- Preconditions ---------------------------------------------------------

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "ARCHICUSTOS: not a git repository" >&2
  exit 2
}

LEDGER_DIR="${1:?LEDGER_PATH_REQUIRED}"
[ -d "$LEDGER_DIR" ] || exit 2
LOG="$LEDGER_DIR/archicustos.log"

# --- Input ----------------------------------------------------------------

INPUT="$(cat || true)"

[ -z "$INPUT" ] && {
  printf '%s\n' "DENIED"
  exit 1
}

TEXT="$(printf '%s' "$INPUT")"

# --- Custody Rules ---------------------------------------------------------

# No ambiguity allowed
printf '%s' "$TEXT" | grep -Eiq \
  '(^|[^a-z])(maybe|might|could|unclear|unknown|assumed)([^a-z]|$)' && {
  printf '%s\n' "DENIED"
  exit 1
}

# Require explicit custodian identity
printf '%s' "$TEXT" | grep -Eq \
  '(@[A-Za-z0-9_-]+|custodian:[[:space:]]*[A-Za-z0-9_-]+|team|org|user)' || {
  printf '%s\n' "DENIED"
  exit 1
}

# --- Continuity Enforcement -----------------------------------------------

if [ -f "$LOG" ] && grep -q '^CUSTODY:' "$LOG"; then
  LAST_CUSTODY="$(awk '
    /^CUSTODY:/ {flag=1; next}
    /^---/ {flag=0}
    flag {print}
  ' "$LOG" | tail -n 1)"

  printf '%s' "$TEXT" | grep -Fq "$LAST_CUSTODY" || {
    printf '%s\n' "DENIED"
    exit 1
  }
fi

# --- Ledger ----------------------------------------------------------------

TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
COMMIT="$(git rev-parse --verify HEAD 2>/dev/null || printf '%s' UNCOMMITTED)"
REPO="$(git rev-parse --show-toplevel)"

{
  printf 'TIME: %s\n' "$TIMESTAMP"
  printf 'REPO: %s\n' "$REPO"
  printf 'COMMIT: %s\n' "$COMMIT"
  printf 'CUSTODY:\n%s\n' "$TEXT"
  printf '%s\n' '---'
} >> "$LOG"

# --- Verdict ---------------------------------------------------------------

printf '%s\n' "ACCEPTED"
exit 0
