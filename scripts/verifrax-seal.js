#!/usr/bin/env node
"use strict";

const fs = require("fs");
const { die, stableStringify, canonicalHash } = require("../core/canonical");
const { loadPolicy, evaluate } = require("../core/engine/policy");
const { buildEvaluationSurface } = require("../core/eval_surface");
const { makeSeal } = require("../core/seal/seal");

function readFile(p) {
  try { return fs.readFileSync(p, "utf8"); }
  catch { die("E_IO", `cannot read: ${p}`); }
}

function readJson(p) {
  const raw = readFile(p);
  try { return JSON.parse(raw); }
  catch { die("E_PARSE", `invalid JSON: ${p}`); }
}

function argvFlag(name) {
  const ix = process.argv.indexOf(name);
  if (ix === -1) return null;
  return process.argv[ix+1] || "";
}

function main() {
  const surfacePath = argvFlag("--surface");
  const policyPath = argvFlag("--policy");
  const outPath = argvFlag("--out") || "verifrax.seal.json";

  const ver = argvFlag("--verifrax-version") || "dev";
  const freeze = argvFlag("--freeze-version") || "unfrozen";
  const ts = argvFlag("--timestamp") || ""; // optional deterministic input

  if (!surfacePath) die("E_ARG", "--surface required");
  if (!policyPath) die("E_ARG", "--policy required");

  const surfaceInput = readJson(surfacePath);
  const built = buildEvaluationSurface(surfaceInput);

  const policyText = readFile(policyPath);
  const loaded = loadPolicy(policyText);
  const evalOut = evaluate(built.surface, policyText);

  const sealOut = makeSeal({
    artifact_hash: built.surface.artifact_hash,
    policy_hash: loaded.policy_hash,
    evaluation_hash: evalOut.evaluation_hash,
    decision: evalOut.decision,
    verifrax_version: ver,
    timestamp: ts,
    freeze_version: freeze,
  });

  const full = {
    surface: built.surface,
    surface_hash: canonicalHash(built.surface),
    policy_hash: loaded.policy_hash,
    decision: evalOut.decision,
    rule_failures: evalOut.rule_failures,
    evaluation_hash: evalOut.evaluation_hash,
    seal: sealOut.seal,
    seal_hash: sealOut.seal_hash,
  };

  const out = stableStringify(full) + "\n";
  fs.writeFileSync(outPath, out);
  process.stdout.write(out);
}

main();
