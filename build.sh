#!/usr/bin/env bash
set -euo pipefail

if [ -f requirements.txt ]; then
  python3 -m pip install --upgrade pip
  python3 -m pip install -r requirements.txt
fi

mkdir -p "$OUT"

# always build at least one python fuzzer
compile_python_fuzzer fuzzing/fuzz_dummy.py --target_name=fuzz_dummy
