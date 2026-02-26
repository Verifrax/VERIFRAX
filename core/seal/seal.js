"use strict";
const { die, canonicalHash, stableStringify } = require("../canonical");

function ensureString(v, name) {
  if (typeof v !== "string" || !v) die("E_SCHEMA", `${name}: required string`);
  return v;
}

function ensureDecision(v) {
  if (v !== "pass" && v !== "warn" && v !== "fail") die("E_SCHEMA", "decision: must be pass|warn|fail");
  return v;
}

function makeSeal(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) die("E_SCHEMA", "seal input: required object");

  const artifact_hash = ensureString(input.artifact_hash, "artifact_hash");
  const policy_hash = ensureString(input.policy_hash, "policy_hash");
  const evaluation_hash = ensureString(input.evaluation_hash, "evaluation_hash");
  const decision = ensureDecision(input.decision);

  const verifrax_version = ensureString(input.verifrax_version, "verifrax_version");
  const freeze_version = ensureString(input.freeze_version, "freeze_version");

  // deterministic timestamp: caller must provide exact RFC3339/ISO string OR empty
  const timestamp = typeof input.timestamp === "string" ? input.timestamp : "";
  if (timestamp && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(timestamp)) {
    die("E_SCHEMA", "timestamp: must be UTC ISO8601 (YYYY-MM-DDTHH:MM:SSZ)");
  }

  const seal = {
    artifact_hash,
    policy_hash,
    evaluation_hash,
    decision,
    verifrax_version,
    timestamp,
    freeze_version,
  };

  // determinism guard
  stableStringify(seal);

  const seal_hash = canonicalHash(seal);
  return { seal, seal_hash };
}

module.exports = { makeSeal };
