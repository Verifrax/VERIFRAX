#!/bin/sh
# ORIGINSEAL v0.1.1
# Provenance sealing utility.
#
# The seal is appended to ORIGINSEAL_LEDGER when provided. Otherwise it is
# written to a process-local temporary ledger outside the repository.

set -eu

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "ORIGINSEAL: not a git repository" >&2
  exit 2
}

INPUT="$(cat)"

if [ -z "$INPUT" ]; then
  printf '%s\n' "DENIED"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
BIRTH_COMMIT="$(git rev-list --max-parents=0 HEAD 2>/dev/null | head -n 1)"

if [ -z "$BIRTH_COMMIT" ]; then
  BIRTH_COMMIT="UNCOMMITTED"
  BIRTH_TREE="UNCOMMITTED"
else
  BIRTH_TREE="$(git rev-parse "$BIRTH_COMMIT^{tree}")"
fi

TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
LEDGER="${ORIGINSEAL_LEDGER:-${TMPDIR:-/tmp}/verifrax-originseal-${USER:-unknown}.log}"

case "$LEDGER" in
  /*) ;;
  *) LEDGER="$REPO_ROOT/$LEDGER" ;;
esac

LEDGER_DIR="$(dirname "$LEDGER")"
mkdir -p "$LEDGER_DIR"
umask 077

{
  printf 'TIME: %s\n' "$TIMESTAMP"
  printf 'REPO: %s\n' "$REPO_ROOT"
  printf 'BIRTH_COMMIT: %s\n' "$BIRTH_COMMIT"
  printf 'BIRTH_TREE: %s\n' "$BIRTH_TREE"
  printf 'ORIGIN_CONTEXT:\n%s\n' "$INPUT"
  printf '%s\n' '---'
} >> "$LEDGER"

printf '%s\n' "SEALED"
