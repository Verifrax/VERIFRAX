#!/usr/bin/env bash
set -euo pipefail
tag="${1:?tag required (e.g. v2.8.0)}"
ver="${tag#v}"
dir="public/spec/v"
test -d "$dir" || { echo "missing $dir"; exit 1; }
mkdir -p public/spec/latest
cat > public/spec/latest/index.html <<HTML
<!doctype html>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=../${ver}/">
<link rel="canonical" href="../${ver}/">
<title>VERIFRAX Spec — latest</title>
<p>Redirecting…</p>
<script>location.replace("../${ver}/");</script>
HTML
