#!/usr/bin/env bash
if git diff HEAD~1 -- core/src/contracts | grep .; then
  echo "⚠️ CONTRACT CHANGE REQUIRES MAJOR VERSION"
  exit 1
fi
