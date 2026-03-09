#!/bin/sh
# GUILLOTINE v0.1.0
# Claude Code execution terminator
# One-way. No recovery. No discussion.

set -eu

# --- Input -----------------------------------------------------------------

INPUT="$(cat || true)"

[ -z "$INPUT" ] && {
  printf '%s\n' "INVALID"
  exit 1
}

# --- Preconditions ---------------------------------------------------------

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  printf '%s\n' "GUILLOTINE: not a git repository" >&2
  exit 2
}

# --- Termination -----------------------------------------------------------

# Null-delimited, space-safe
git status --porcelain=v1 -z | while IFS= read -r -d "" entry; do
  status=${entry%% *}
  path=${entry#?? }

  # Skip deletions already staged or removed
  [ "$status" = "D" ] && continue

  rm -rf -- "$path"
done

printf '%s\n' "TERMINATED"
exit 0
