#!/bin/sh
# KAIROCLASP v0.1.0
# Temporal finality utility
# Binds state to time. No execution. No mutation. No remediation.

set -eu

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "KAIROCLASP: not a git repository" >&2
  exit 2
}

INPUT="$(cat)"

[ -z "$INPUT" ] && {
  printf '%s\n' "DENIED"
  exit 1
}

TEXT="$(printf '%s' "$INPUT")"

if [ -f KAIROCLASP.log ] && grep -q '^TIME:' KAIROCLASP.log; then
  printf '%s\n' "EXPIRED"
  exit 1
fi

LOCK_TIME="$(printf '%s' "$TEXT" | grep -Eo \
  '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z' | head -n 1)"

[ -z "$LOCK_TIME" ] && {
  printf '%s\n' "DENIED"
  exit 1
}

NOW="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

LOCK_EPOCH="$(
  date -u -d "$LOCK_TIME" +%s 2>/dev/null ||
  date -u -j -f '%Y-%m-%dT%H:%M:%SZ' "$LOCK_TIME" +%s 2>/dev/null
)"

[ -z "$LOCK_EPOCH" ] && {
  printf '%s\n' "DENIED"
  exit 1
}

NOW_EPOCH="$(date -u +%s)"

if [ "$NOW_EPOCH" -gt "$LOCK_EPOCH" ]; then
  printf '%s\n' "DENIED"
  exit 1
fi

TIMESTAMP="$NOW"
COMMIT="$(git rev-parse --verify HEAD 2>/dev/null || printf '%s' UNCOMMITTED)"
REPO="$(git rev-parse --show-toplevel)"

{
  printf 'TIME: %s\n' "$TIMESTAMP"
  printf 'REPO: %s\n' "$REPO"
  printf 'COMMIT: %s\n' "$COMMIT"
  printf 'LOCK_AT: %s\n' "$LOCK_TIME"
  printf 'NOW: %s\n' "$NOW"
  printf '%s\n' '---'
} >> KAIROCLASP.log

printf '%s\n' "CLASPED"
exit 0
