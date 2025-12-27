#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const TAG = process.argv[2] || "engine-semantics-freeze-20251226-155121";
const MAN = `freeze-manifests/${TAG}.MANIFEST.sha256`;
const sh = (cmd) => execSync(cmd, { stdio: "inherit" });

sh("git fetch --tags --force >/dev/null 2>&1 || true");
if (!existsSync(MAN)) { console.error(`MISSING: ${MAN}`); process.exit(2); }

sh(`git diff --exit-code "${TAG}" -- core tools sample/run-003`);
sh(`node tools/bundle-verify.mjs sample/run-003`);
sh(`shasum -a 256 "${MAN}"`);
console.log(`OK: FREEZE VERIFIED: ${TAG}`);
