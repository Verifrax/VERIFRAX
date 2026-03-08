#!/bin/sh
# ORIGINSEAL v0.1.0
# Provenance sealing utility
# Anchors original origin. No execution. No mutation. No remediation.

set -eu

# --- Preconditions ---------------------------------------------------------

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "ORIGINSEAL: not a git repository" >&2
  exit 2
}

# --- Input ----------------------------------------------------------------

INPUT="$(cat)"

[ -z "$INPUT" ] && {
  printf "%s\n" "DENIED"
  exit 1
}

TEXT="$(printf '%s' "$INPUT")"

# --- Single-Seal Enforcement ----------------------------------------------


# --- Origin Context --------------------------------------------------------

REPO_ROOT="$(git rev-parse --show-toplevel)"

BIRTH_COMMIT="$(git rev-list --max-parents=0 HEAD 2>/dev/null | head -n 1 || printf '%s' UNCOMMITTED)"
BIRTH_TREE="$(git rev-parse "$BIRTH_COMMIT^{tree}" 2>/dev/null || printf '%s' UNCOMMITTED)"

TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# --- Ledger ----------------------------------------------------------------

{
  printf 'TIME: %s\n' "$TIMESTAMP"
  printf 'REPO: %s\n' "$REPO_ROOT"
  printf 'BIRTH_COMMIT: %s\n' "$BIRTH_COMMIT"
  printf 'BIRTH_TREE: %s\n' "$BIRTH_TREE"
  printf 'ORIGIN_CONTEXT:\n%s\n' "$TEXT"
  printf "\%s\n" "---"
}
} >> ""

# --- Verdict ---------------------------------------------------------------

printf '%s\n' "SEALED"
exit 0
