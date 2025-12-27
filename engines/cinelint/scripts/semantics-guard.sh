#!/usr/bin/env bash
set -euo pipefail
TAG="engine-semantics-freeze-20251226-155121"
REMOTE_TAG_SHA="68ac26f6d9887c7ca0b8d3686e155b5b2814248f"

# ensure local tag matches remote tag exactly
LOCAL_TAG_SHA="$(git rev-parse "refs/tags/${TAG}^{tag}" 2>/dev/null || true)"
[ -n "${LOCAL_TAG_SHA}" ] || { echo "MISSING LOCAL TAG: ${TAG}"; exit 2; }
[ "${LOCAL_TAG_SHA}" = "${REMOTE_TAG_SHA}" ] || { echo "TAG DRIFT: local!=origin (refetch tags)"; exit 3; }

git diff --exit-code "${TAG}" -- core tools sample/run-003 >/dev/null || {
  echo "SEMANTICS DRIFT DETECTED — FREEZE VIOLATION"
  exit 1
}
