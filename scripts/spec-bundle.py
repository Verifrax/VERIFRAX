#!/usr/bin/env python3
import base64, json
from pathlib import Path

root = Path("public/spec")
out  = Path("edge-spec-worker/spec.bundle.js")

files = {}
for p in sorted(root.rglob("*")):
    if p.is_dir():
        continue
    rel = "/" + str(p.relative_to(root)).replace("\\","/")
    b64 = base64.b64encode(p.read_bytes()).decode("ascii")
    files[rel] = b64

out.write_text(
  "// AUTO-GENERATED. DO NOT EDIT.\n"
  "export const SPEC_B64 = " + json.dumps(files, separators=(",",":")) + ";\n"
)
print(f"wrote {out} files={len(files)}")
