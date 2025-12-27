#!/usr/bin/env bash
set -euo pipefail

pnpm -w install --frozen-lockfile
pnpm -w lint
pnpm -w test
pnpm -w build

node scripts/bundle.build.mjs ci-smoke

# Single source of truth: contract + clean-room + tamper is inside this verifier
node scripts/bundle.verify.mjs out/ci-smoke.zip
