#!/usr/bin/env bash
set -euo pipefail
OUT="${1:?outdir required}"
rm -rf "$OUT"
mkdir -p "$OUT"
cp -R public/spec/. "$OUT/"

cat > "$OUT/README.md" <<'EOF'
# VERIFRAX-SPEC

Published SPEC artifacts derived from `Verifrax/VERIFRAX` (`public/spec`).

**DO NOT EDIT MANUALLY.**
EOF

# normalize timestamps to reduce diff noise (best-effort)
find "$OUT" -type f -print0 | xargs -0 touch -t 202601010000 || true
