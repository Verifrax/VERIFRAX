"use strict";

const fs = require("fs");
const path = require("path");

const adapters = require("../adapters");
const { die, canonicalHash, stableStringify } = require("../core/canonical");
const { buildEvaluationSurface } = require("../core/eval_surface");
const { loadPolicy, evaluate } = require("../core/engine/policy");
const { makeSeal } = require("../core/seal/seal");

const ACTION_ROOT = path.resolve(__dirname, "..");
const WORKSPACE_ROOT = path.resolve(process.env.GITHUB_WORKSPACE || process.cwd());

function resolveInputPath(inputPath) {
  if (!inputPath) return "";
  return path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(WORKSPACE_ROOT, inputPath);
}

function readFile(inputPath) {
  if (!inputPath) return "";

  const resolved = resolveInputPath(inputPath);

  try {
    return fs.readFileSync(resolved, "utf8");
  } catch {
    die("E_IO", `cannot read: ${resolved}`);
  }
}

function readJson(inputPath) {
  const raw = readFile(inputPath);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    die("E_PARSE", `invalid JSON: ${resolveInputPath(inputPath)}`);
  }
}

function detectSbom(obj) {
  if (!obj || typeof obj !== "object") return null;
  if (typeof obj.spdxVersion === "string" && Array.isArray(obj.packages)) return "spdx";
  if (obj.bomFormat === "CycloneDX" && typeof obj.specVersion === "string") return "cyclonedx";
  return null;
}

function detectAttestation(obj) {
  if (!obj || typeof obj !== "object") return null;
  if (typeof obj._type === "string" && String(obj._type).includes("in-toto")) return "intoto";
  if (typeof obj.predicateType === "string" && String(obj.predicateType).includes("slsa")) return "slsa";
  if (typeof obj.type === "string" && String(obj.type).includes("in-toto")) return "intoto";
  return null;
}

function coreInputsFromArtifacts(sbomNorm, provNorm, sigNorm) {
  const artifactHash = sbomNorm
    ? sbomNorm.hash
    : provNorm
      ? provNorm.hash
      : sigNorm
        ? sigNorm.hash
        : "";

  if (!artifactHash) {
    die(
      "E_INPUT",
      "need at least one input producing artifact_hash (sbom/provenance/sigstore bundle)",
    );
  }

  const builderId =
    provNorm &&
    provNorm.normalized &&
    provNorm.normalized.builder &&
    provNorm.normalized.builder.id
      ? String(provNorm.normalized.builder.id)
      : "";

  const sourceUri =
    provNorm &&
    provNorm.normalized &&
    provNorm.normalized.invocation &&
    provNorm.normalized.invocation.source_uri
      ? String(provNorm.normalized.invocation.source_uri)
      : "";

  const dependencies =
    sbomNorm && sbomNorm.normalized
      ? sbomNorm.normalized.packages || sbomNorm.normalized.components || []
      : [];

  const dependencyKeys = [];

  for (const dependency of dependencies) {
    if (!dependency || typeof dependency !== "object") continue;

    const key =
      dependency.purl ||
      dependency.name ||
      dependency.spdxid ||
      dependency.bom_ref ||
      "";

    const version = dependency.version || "";

    if (key) {
      dependencyKeys.push(version ? `${key}@${version}` : key);
    }
  }

  return {
    artifact_hash: artifactHash,
    builder_id: builderId,
    source_uri: sourceUri,
    dependencies: dependencyKeys,
    vulnerabilities: [],
    signature_valid:
      sigNorm && sigNorm.normalized
        ? Boolean(sigNorm.normalized.signature_valid)
        : false,
    provenance_valid: Boolean(provNorm),
    metadata_hash: canonicalHash({
      sbom: sbomNorm ? sbomNorm.hash : "",
      provenance: provNorm ? provNorm.hash : "",
      sigstore: sigNorm ? sigNorm.hash : "",
    }),
  };
}

function main() {
  const get = (key) => process.env[`INPUT_${key.toUpperCase()}`] || "";

  const surfacePath = get("surface_path");
  const sbomPath = get("sbom_path");
  const provenancePath = get("provenance_path");
  const sigstoreBundlePath = get("sigstore_bundle_path");
  const policyPath = get("policy_path");
  const mode = (get("mode") || "enforce").toLowerCase();
  const outputPath = resolveInputPath(get("out_path") || "verifrax.seal.json");

  if (!policyPath) die("E_ARG", "policy_path required");
  if (mode !== "enforce" && mode !== "audit") {
    die("E_ARG", "mode must be enforce|audit");
  }

  const artifactInputs = [sbomPath, provenancePath, sigstoreBundlePath].filter(Boolean);

  if (surfacePath && artifactInputs.length > 0) {
    die(
      "E_ARG",
      "surface_path is mutually exclusive with sbom_path, provenance_path and sigstore_bundle_path",
    );
  }

  if (!surfacePath && artifactInputs.length === 0) {
    die(
      "E_INPUT",
      "provide surface_path or at least one artifact input",
    );
  }

  let built;

  if (surfacePath) {
    const surfaceInput = readJson(surfacePath);
    if (!surfaceInput) {
      die("E_PARSE", `invalid JSON: ${resolveInputPath(surfacePath)}`);
    }
    built = buildEvaluationSurface(surfaceInput);
  } else {
    const sbomObject = sbomPath ? readJson(sbomPath) : null;
    const provenanceObject = provenancePath ? readJson(provenancePath) : null;
    const sigstoreObject = sigstoreBundlePath
      ? readJson(sigstoreBundlePath)
      : null;

    const sbomNormalized = (() => {
      if (!sbomObject) return null;

      const type = detectSbom(sbomObject);

      if (type === "spdx") return adapters.spdx.normalize(sbomObject);
      if (type === "cyclonedx") return adapters.cyclonedx.normalize(sbomObject);

      die("E_INPUT", "unsupported SBOM format (need SPDX JSON or CycloneDX JSON)");
    })();

    const provenanceNormalized = (() => {
      if (!provenanceObject) return null;

      const type = detectAttestation(provenanceObject);

      if (type === "slsa") return adapters.slsa.normalize(provenanceObject);
      if (type === "intoto") return adapters.intoto.normalize(provenanceObject);
      if (typeof provenanceObject.predicateType === "string") {
        return adapters.slsa.normalize(provenanceObject);
      }

      die(
        "E_INPUT",
        "unsupported provenance/attestation (need SLSA v1 or in-toto Statement)",
      );
    })();

    const sigstoreNormalized = sigstoreObject
      ? adapters.sigstore.normalizeAndVerify(sigstoreObject)
      : null;

    built = buildEvaluationSurface(
      coreInputsFromArtifacts(
        sbomNormalized,
        provenanceNormalized,
        sigstoreNormalized,
      ),
    );
  }

  const policyObject = readJson(policyPath);

  if (!policyObject) {
    die("E_PARSE", `invalid JSON: ${resolveInputPath(policyPath)}`);
  }

  const policyText = stableStringify(policyObject);
  const loadedPolicy = loadPolicy(policyObject);
  const evaluation = evaluate(built.surface, policyText);

  const packageObject = JSON.parse(
    fs.readFileSync(path.join(ACTION_ROOT, "package.json"), "utf8"),
  );

  const version =
    typeof packageObject.version === "string"
      ? packageObject.version
      : "dev";

  const sealOutput = makeSeal({
    artifact_hash: built.surface.artifact_hash,
    policy_hash: loadedPolicy.policy_hash,
    evaluation_hash: evaluation.evaluation_hash,
    decision: evaluation.decision,
    verifrax_version: version,
    timestamp: "",
    freeze_version: "policy-snapshot",
  });

  const output = {
    surface: built.surface,
    surface_hash: canonicalHash(built.surface),
    policy_hash: loadedPolicy.policy_hash,
    decision: evaluation.decision,
    rule_failures: evaluation.rule_failures,
    evaluation_hash: evaluation.evaluation_hash,
    seal: sealOutput.seal,
    seal_hash: sealOutput.seal_hash,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, stableStringify(output) + "\n");

  if (mode === "enforce" && evaluation.decision === "fail") {
    die("E_POLICY_FAIL", "policy evaluation failed");
  }
}

main();
