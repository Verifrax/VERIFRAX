#!/usr/bin/env bash
set -e
node core/dist/engine/run.js sample/engine-run/run.json /tmp/fuzz-run >/dev/null
