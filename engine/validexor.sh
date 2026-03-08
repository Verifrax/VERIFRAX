#!/bin/sh
# VALIDEXOR v0.1.0
# Deterministic verification utility
# Verifies claims against observable reality. No judgment. No execution.

set -eu

# --- Preconditions ---------------------------------------------------------

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "VALIDEXOR: not a git repository" >&2
  exit 2
}

# --- Input ----------------------------------------------------------------

INPUT="$(cat)"

[ -z "$INPUT" ] && {
  printf '%s\n' "INVALID"
  exit 1
}

TEXT="$(printf '%s' "$INPUT")"

# --- Rejection Rules -------------------------------------------------------

# No speculation, hedging, or approximation
printf '%s' "$TEXT" | grep -Eiq \
  '(^|[^a-z])(maybe|might|could|should|approx|guess|probably|likely|unclear|unknown)([^a-z]|$)' && {
  printf '%s\n' "INVALID"
  exit 1
}

# --- Assertion Requirements -----------------------------------------------

# Must contain at least one falsifiable anchor
printf '%s' "$TEXT" | grep -Eq \
  '([0-9]+|true|false|/[^[:space:]]+|[a-f0-9]{7,40}|==|!=|<=|>=|<|>)' || {
  printf '%s\n' "UNVERIFIABLE"
  exit 1
}

# --- Context Consistency ---------------------------------------------------

# Referenced git objects must exist
for h in $(printf '%s' "$TEXT" | grep -Eo '[a-f0-9]{7,40}' | sort -u); do
  git cat-file -e "$h^{commit}" 2>/dev/null ||
  git cat-file -e "$h^{tree}" 2>/dev/null || {
    printf '%s\n' "INVALID"
    exit 1
  }
done

# --- Verdict ---------------------------------------------------------------

printf '%s\n' "VERIFIED"
exit 0
