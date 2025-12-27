#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
case "${1:-}" in
  demo)
    shift
    "$ROOT/scripts/demo.sh" "${1:?usage: ./scripts/console.sh demo <file>}"
    ;;
  verify)
    shift
    "$ROOT/scripts/verifrax" verify "${1:?usage: ./scripts/console.sh verify <file>}"
    ;;
  freeze)
    shift
    "$ROOT/scripts/verifrax" freeze "${1:?usage: ./scripts/console.sh freeze <file>}" --out "$ROOT/out/console"
    ;;
  prove)
    shift
    "$ROOT/scripts/verifrax" prove "${1:?usage: ./scripts/console.sh prove <file>}" --out "$ROOT/out/console"
    ;;
  *)
    echo "usage: ./scripts/console.sh <demo|verify|freeze|prove> <file>"
    exit 1
    ;;
esac

