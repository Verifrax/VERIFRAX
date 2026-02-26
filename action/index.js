"use strict";

const fs = require("fs");
const path = require("path");

const adapters = require("../adapters");
const { die, canonicalHash, stableStringify } = require("../core/canonical");
const { buildEvaluationSurface } = require("../core/eval_surface");
const { loadPolicy, evaluate } = require("../core/engine/policy");
const { makeSeal } = require("../core/seal/seal");

function readFile(p) {
  if (!p) return "";
  try { return fs.readFileSync(p, "utf8"); }
  catch { die("E_IO", `cannot read: ${p}`); }
}

function readJson(p) {
  const raw = readFile(p);
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch { die("E_PARSE", `invalid JSON: ${p}`); }
}

function detectSbom(obj) {
  if (!obj || typeof obj !== "object") return null;
  if (typeof obj.spdxVersion === "string" && Array.isArray(obj.packages)) return "spdx";
  if (obj.bomFormat === "CycloneDX" && typeof obj.specVersion === "string") return "cyclonedx";
  return null;
}

function detectAttestation(obj) {
  if (!obj || typeof obj !== "object") return null;
  // SLSA provenance typically: _type + predicateType, etc.
  if (typeof obj._type === "string" && String(obj._type).includes("in-toto")) return "intoto";
  if (typeof obj.predicateType === "string" && String(obj.predicateType).includes("slsa")) return "slsa";
  // Allow plain in-toto Statement
  if (typeof obj.type === "string" && String(obj.type).includes("in-toto")) return "intoto";
  return null;
}

function coreInputsFromArtifacts(sbomNorm, provNorm, sigNorm) {
  // Minimal deterministic mapping for surface.
  // Surface will evolve later; keep strict + stable.
  const artifact_hash = sbomNorm ? sbomNorm.hash : (provNorm ? provNorm.hash : (sigNorm ? sigNorm.hash : ""));
  if (!artifact_hash) die("E_INPUT", "need at least one input producing artifact_hash (sbom/provenance/sigstore bundle)");

  const builder_id = (provNorm && provNorm.normalized && provNorm.normalized.builder && provNorm.normalized.builder.id) ? String(provNorm.normalized.builder.id) : "";
  const source_uri = (provNorm && provNorm.normalized && provNorm.normalized.invocation && provNorm.normalized.invocation.source_uri) ? String(provNorm.normalized.invocation.source_uri) : "";

  const dependencies = sbomNorm && sbomNorm.normalized ? (sbomNorm.normalized.packages || sbomNorm.normalized.components || []) : [];
  const depsKeys = (() => {
    const out = [];
    for (const d of dependencies) {
      if (!d || typeof d !== "object") continue;
      const key = d.purl || d.name || d.spdxid || d.bom_ref || "";
      const ver = d.version || "";
      if (key) out.push(ver ? `${key}@${ver}` : key);
    }
    return out;
  })();

  const vulnerabilities = []; // not ingested yet

  const signature_valid =
    sigNorm && sigNorm.normalized ? !!sigNorm.normalized.signature_valid : false;

  const provenance_valid = !!provNorm;

  const metadata_hash = canonicalHash({
    sbom: sbomNorm ? sbomNorm.hash : "",
    provenance: provNorm ? provNorm.hash : "",
    sigstore: sigNorm ? sigNorm.hash : "",
  });

  return {
    artifact_hash,
    builder_id,
    source_uri,
    dependencies: depsKeys,
    vulnerabilities,
    signature_valid,
    provenance_valid,
    metadata_hash,
  };
}

function main() {
  const get = (k) => process.env[`INPUT_${k.toUpperCase()}`] || "";
  const sbomPath = get("sbom_path");
  const provPath = get("provenance_path");
  const sigPath = get("sigstore_bundle_path");
  const policyPath = get("policy_path");
  const mode = (get("mode") || "enforce").toLowerCase();
  const outPath = get("out_path") || "verifrax.seal.json";

  if (!policyPath) die("E_ARG", "policy_path required");
  if (mode !== "enforce" && mode !== "audit") die("E_ARG", "mode must be enforce|audit");

  const sbomObj = sbomPath ? readJson(sbomPath) : null;
  const provObj = provPath ? readJson(provPath) : null;
  const sigObj = sigPath ? readJson(sigPath) : null;

  const sbomNorm = (() => {
    if (!sbomObj) return null;
    const t = detectSbom(sbomObj);
    if (t === "spdx") return adapters.spdx.normalize(sbomObj);
    if (t === "cyclonedx") return adapters.cyclonedx.normalize(sbomObj);
    die("E_INPUT", "unsupported SBOM format (need SPDX JSON or CycloneDX JSON)");
  })();

  const provNorm = (() => {
    if (!provObj) return null;
    const t = detectAttestation(provObj);
    if (t === "slsa") return adapters.slsa.normalize(provObj);
    if (t === "intoto") return adapters.intoto.normalize(provObj);
    // allow "SLSA provenance JSON" as predicateType-based
    if (typeof provObj.predicateType === "string") return adapters.slsa.normalize(provObj);
    die("E_INPUT", "unsupported provenance/attestation (need SLSA v1 or in-toto Statement)");
  })();

  const sigNorm = (() => {
    if (!sigObj) return null;
    // structural verify only in action (no trusted root material passed)
    return adapters.sigstore.normalizeAndVerify(sigObj, null, null);
  })();

  const surfaceInput = coreInputsFromArtifacts(sbomNorm, provNorm, sigNorm);
  const built = buildEvaluationSurface(surfaceInput);

  const policyText = readFile(policyPath);
  const loaded = loadPolicy(policyObjOrText);
  const evalOut = evaluate(built.surface, policyText);

  const pkg = JSON.parse(fs.readFileSync("package.json","utf8"));
  const ver = typeof pkg.version === "string" ? pkg.version : "dev";

  const sealOut = makeSeal({
    artifact_hash: built.surface.artifact_hash,
    policy_hash: loaded.policy_hash,
    evaluation_hash: evalOut.evaluation_hash,
    decision: evalOut.decision,
    verifrax_version: ver,
    timestamp: "",
    freeze_version: "policy-snapshot",
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

  fs.writeFileSync(outPath, stableStringify(full) + "\n");

  if (mode === "enforce" && evalOut.decision === "fail") {
    die("E_POLICY_FAIL", "policy evaluation failed");
  }
}

main();
