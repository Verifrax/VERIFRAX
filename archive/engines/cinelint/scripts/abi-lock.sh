#!/usr/bin/env bash
git diff --exit-code HEAD~1 nodes/src/abi || {
  echo "❌ NODE ABI MODIFIED"
  exit 1
}
