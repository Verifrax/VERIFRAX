#!/usr/bin/env bash
# IRREVOCULL v1.0.0
# Irreversible Judgment Utility
# Judgment only. No execution. No mitigation. No appeal.

set -eu

# --- Input ----------------------------------------------------------------

INPUT="$(cat)"

# Rule 0 — Silence is invalid
[ -z "$INPUT" ] && {
  printf '%s\n' "RULE: JUDGMENT.EMPTY_INPUT"
  exit 2
}

TEXT="$(printf '%s' "$INPUT")"

# Rule 1 — Incompleteness is terminal
printf '%s' "$TEXT" | grep -Eiq \
  '(^|[^a-z])(todo|tbd|fixme|wip|partial|incomplete|later|edge case|skipped|hack)([^a-z]|$)' && {
  printf '%s\n' "RULE: JUDGMENT.INCOMPLETE"
  exit 1
}

# Rule 2 — Uncertainty voids judgment
printf '%s' "$TEXT" | grep -Eiq \
  '(^|[^a-z])(maybe|might|could|should|approx|guess|try|attempt|assume|probably)([^a-z]|$)' && {
  printf '%s\n' "RULE: JUDGMENT.UNCERTAIN"
  exit 2
}

# Rule 3 — Questions indicate misalignment
printf '%s' "$TEXT" | grep -Eq '\?' && {
  printf '%s\n' "RULE: JUDGMENT.QUESTION"
  exit 2
}

# Rule 4 — Over-explanation signals lack of conviction
LINES="$(printf '%s' "$TEXT" | wc -l | tr -d ' ')"
[ "$LINES" -gt 300 ] && {
  printf '%s\n' "RULE: JUDGMENT.OVEREXPLAINED"
  exit 2
}

# Rule 5 — Excessive qualification density
WORDS="$(printf '%s' "$TEXT" | wc -w | tr -d ' ')"
QUALS="$(printf '%s' "$TEXT" | grep -Eio \
  '(however|but|although|generally|typically|in most cases)' | wc -l | tr -d ' ')"

[ "$WORDS" -gt 0 ] && [ "$QUALS" -gt $((WORDS / 100)) ] && {
  printf '%s\n' "RULE: JUDGMENT.QUALIFIED"
  exit 2
}

# --- Verdict --------------------------------------------------------------

printf '%s\n' "PASS"
exit 0
