#!/bin/sh
git diff --exit-code core/src || exit 1
git diff --exit-code nodes/src || exit 1
git diff --exit-code policy || exit 1
