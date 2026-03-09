#!/bin/sh
# ATTESTORIUM v0.1.0
# Deterministic attestation utility
# Witness only. No execution. No mutation. No remediation.

set -eu

# --- Preconditions ---------------------------------------------------------

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "ATTESTORIUM: not a git repository" >&2
  exit 2
}

# --- Input Capture ----------------------------------------------------------

INPUT="$(cat)"

[ -z "$INPUT" ] && {
  printf '%s\n' "ATTESTORIUM: INVALID"
  exit 1
}

# --- Attestation Context ----------------------------------------------------

REPO_ROOT="$(git rev-parse --show-toplevel)"

HEAD_COMMIT="$(git rev-parse --verify HEAD 2>/dev/null || printf '%s' UNCOMMITTED)"
HEAD_TREE="$(git rev-parse --verify HEAD^{tree} 2>/dev/null || printf '%s' UNCOMMITTED)"

TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

STATUS="$(git status --porcelain=v1 -z | LC_ALL=C sort -z || true)"

# --- Deterministic Digest ---------------------------------------------------

ATTESTATION_PAYLOAD="$(printf '%s\n%s\n%s\n%s' \
  "$HEAD_COMMIT" \
  "$HEAD_TREE" \
  "$STATUS" \
  "$INPUT"
)"

DIGEST="$(printf '%s' "$ATTESTATION_PAYLOAD" | sha256sum | awk '{print $1}')"

# --- Output ----------------------------------------------------------------

printf '%s\n' "ATTESTATION"
printf '%s\n' "----------"
printf 'repo:      %s\n' "$REPO_ROOT"
printf 'commit:    %s\n' "$HEAD_COMMIT"
printf 'tree:      %s\n' "$HEAD_TREE"
printf 'time:      %s\n' "$TIMESTAMP"
printf 'digest:    %s\n\n' "$DIGEST"
printf '%s\n' "stdin:"
printf '%s\n' "$INPUT"

exit 0
