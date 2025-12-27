#!/usr/bin/env bash
set -euo pipefail
INPUT="${1:?usage: ./scripts/demo.sh <file>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
"$ROOT/scripts/verifrax" verify "$INPUT"
