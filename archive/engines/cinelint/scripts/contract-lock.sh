#!/usr/bin/env bash
git diff --exit-code HEAD~1 core/src/contracts core/src/profiles || {
  echo "❌ CONTRACT VIOLATION"
  exit 1
}
