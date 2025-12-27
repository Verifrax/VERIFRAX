#!/bin/sh
git diff --exit-code core/src/consensus || {
  echo "❌ Consensus layer modified"
  exit 1
}
