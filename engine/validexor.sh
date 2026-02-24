#!/usr/bin/env bash
# VALIDEXOR v1.0.0
# Deterministic verification utility
# Verifies claims against observable state. No judgment. No execution.

set -eu

# --- Preconditions ---------------------------------------------------------

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "VALIDEXOR: NOT_A_GIT_REPOSITORY" >&2
  exit 2
}

# --- Input ----------------------------------------------------------------

INPUT="$(cat)"

[ -z "$INPUT" ] && {
  printf '%s\n' "VALIDEXOR: EMPTY_INPUT"
  exit 1
}

TEXT="$(printf '%s' "$INPUT")"

# --- Rejection Rules -------------------------------------------------------

# No speculation or hedging
printf '%s' "$TEXT" | grep -Eiq \
  '(^|[^a-z])(maybe|might|could|should|approx|guess|probably|likely|unclear|unknown)([^a-z]|$)' && {
  printf '%s\n' "RULE: VERIFICATION.SPECULATION"
  exit 1
}

# --- Assertion Requirements -----------------------------------------------

# Must contain at least one falsifiable anchor
printf '%s' "$TEXT" | grep -Eq \
  '([0-9]+|true|false|/[^[:space:]]+|[a-f0-9]{7,40}|==|!=|<=|>=|<|>)' || {
  printf '%s\n' "RULE: VERIFICATION.UNVERIFIABLE"
  exit 1
}

# --- Context Consistency ---------------------------------------------------

# Referenced git objects must exist
for h in $(printf '%s' "$TEXT" | grep -Eo '[a-f0-9]{7,40}' | sort -u); do
  git cat-file -e "$h^{commit}" 2>/dev/null ||
  git cat-file -e "$h^{tree}" 2>/dev/null || {
    printf '%s\n' "RULE: VERIFICATION.INVALID_REFERENCE"
    exit 1
  }
done

# --- Verdict --------------------------------------------------------------

printf '%s\n' "VERIFIED"
exit 0
