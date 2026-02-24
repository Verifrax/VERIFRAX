#!/usr/bin/env bash
# ATTESTORIUM v1.0.0
# Deterministic attestation utility
# Witness only. No execution. No remediation. No mutation.

set -eu

# --- Preconditions ---------------------------------------------------------

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "ATTESTORIUM: NOT_A_GIT_REPOSITORY" >&2
  exit 2
}

LEDGER_DIR="${1:?LEDGER_PATH_REQUIRED}"
[ -d "$LEDGER_DIR" ] || {
  printf '%s\n' "ATTESTORIUM: LEDGER_DIR_INVALID" >&2
  exit 2
}

LOG="$LEDGER_DIR/attestorium.log"

# --- Input ----------------------------------------------------------------

INPUT="$(cat)"

[ -z "$INPUT" ] && {
  printf '%s\n' "ATTESTORIUM: EMPTY_INPUT"
  exit 1
}

# --- Context --------------------------------------------------------------

REPO_ROOT="$(git rev-parse --show-toplevel)"

HEAD_COMMIT="$(git rev-parse --verify HEAD 2>/dev/null || printf '%s' UNCOMMITTED)"
HEAD_TREE="$(git rev-parse --verify HEAD^{tree} 2>/dev/null || printf '%s' UNCOMMITTED)"

STATUS="$(git status --porcelain=v1 -z | LC_ALL=C sort -z || true)"

TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# --- Deterministic Digest --------------------------------------------------

PAYLOAD="$(printf '%s\n%s\n%s\n%s\n%s' \
  "$TIMESTAMP" \
  "$HEAD_COMMIT" \
  "$HEAD_TREE" \
  "$STATUS" \
  "$INPUT"
)"

DIGEST="$(printf '%s' "$PAYLOAD" | sha256sum | awk '{print $1}')"

# --- Ledger ---------------------------------------------------------------

{
  printf 'TIME: %s\n' "$TIMESTAMP"
  printf 'REPO: %s\n' "$REPO_ROOT"
  printf 'COMMIT: %s\n' "$HEAD_COMMIT"
  printf 'TREE: %s\n' "$HEAD_TREE"
  printf 'DIGEST: %s\n' "$DIGEST"
  printf 'INPUT:\n%s\n' "$INPUT"
  printf '%s\n' '---'
} >> "$LOG"

# --- Verdict --------------------------------------------------------------

printf '%s\n' "ATTESTED"
exit 0
