#!/usr/bin/env python3

from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path.cwd()

FORBIDDEN = re.compile(
    r"""
    \b(?:
        recommend(?:ation|ations|ed|ing|s)?
        |should
        |why
        |guide(?:d|s)?
        |help(?:ed|ful|ing|s)?
        |tutorial(?:s)?
        |advice
    )\b
    |
    \bhow\s+to\b
    |
    \bbest\s+practice(?:s)?\b
    """,
    re.IGNORECASE | re.VERBOSE,
)

targets = sorted((ROOT / "public").rglob("*.html"))

worker = ROOT / "edge-spec-worker/worker.js"

if worker.is_file():
    targets.append(worker)

targets = sorted(set(targets))

if not targets:
    raise SystemExit(
        "UI contract has no declared runtime surfaces to inspect"
    )

violations: list[str] = []

for path in targets:
    text = path.read_text(
        encoding="utf-8",
        errors="replace",
    )

    relative = path.relative_to(ROOT)

    for line_number, line in enumerate(text.splitlines(), 1):
        if FORBIDDEN.search(line):
            violations.append(
                f"{relative}:{line_number}:{line.strip()}"
            )

if violations:
    print(
        "Forbidden interpretive or operational UI language detected:",
        file=sys.stderr,
    )

    for violation in violations:
        print(violation, file=sys.stderr)

    raise SystemExit(1)

print(
    f"UI contract verified across {len(targets)} runtime surfaces"
)
