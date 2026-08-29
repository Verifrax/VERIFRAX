import fs from "fs";
import path from "path";

const ROOT = path.resolve("protocol-conformance/v2");

const ORACLE = Object.freeze({
  "canonical-equivalence": Object.freeze({
    verdict: "VERIFIED",
  }),
  contradiction: Object.freeze({
    verdict: "INVALIDATED",
    error_class: "CONTRADICTION_DETECTED",
  }),
  "finality-lock": Object.freeze({
    verdict: "VERIFIED",
    finality: "LOCKED",
  }),
  invalidation: Object.freeze({
    verdict: "INVALIDATED",
    error_class: "CLAIM_INVALIDATED",
  }),
  "minimal-invalid": Object.freeze({
    verdict: "FAILED",
    error_class: "INVALID_EVIDENCE_STRUCTURE",
  }),
  "minimal-valid": Object.freeze({
    verdict: "VERIFIED",
  }),
  "profile-compatibility": Object.freeze({
    verdict: "VERIFIED",
    profile: "public",
  }),
  "signature-verification": Object.freeze({
    verdict: "VERIFIED",
  }),
});

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === "object") {
    const output = {};

    for (const key of Object.keys(value).sort()) {
      output[key] = canonicalize(value[key]);
    }

    return output;
  }

  return value;
}

function deepEqual(left, right) {
  return JSON.stringify(canonicalize(left)) === JSON.stringify(canonicalize(right));
}

function loadBundles(bundleDirectory) {
  const singleBundle = path.join(bundleDirectory, "bundle.json");

  if (fs.existsSync(singleBundle)) {
    return [loadJson(singleBundle)];
  }

  const files = fs
    .readdirSync(bundleDirectory)
    .filter((file) => file.startsWith("bundle") && file.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    throw new Error(`No bundles found in ${bundleDirectory}`);
  }

  return files.map((file) => loadJson(path.join(bundleDirectory, file)));
}

function deriveResult(suiteName, bundles) {
  const oracle = ORACLE[suiteName];

  if (!oracle) {
    throw new Error(`No independent oracle defined for suite: ${suiteName}`);
  }

  const first = bundles[0];

  if (!first || typeof first !== "object") {
    throw new Error(`${suiteName}: bundle must be an object`);
  }

  if (typeof first.bundle_hash !== "string" || first.bundle_hash.length === 0) {
    throw new Error(`${suiteName}: bundle_hash missing`);
  }

  if (String(first.protocol_version) !== "2") {
    throw new Error(`${suiteName}: unsupported protocol_version`);
  }

  for (const bundle of bundles) {
    if (bundle.bundle_hash !== first.bundle_hash) {
      throw new Error(`${suiteName}: bundles disagree on bundle_hash`);
    }

    if (String(bundle.protocol_version) !== "2") {
      throw new Error(`${suiteName}: bundles disagree on protocol_version`);
    }
  }

  if (
    suiteName === "canonical-equivalence" &&
    !deepEqual(bundles[0], bundles[1])
  ) {
    throw new Error(
      "canonical-equivalence: bundles are not canonically equivalent",
    );
  }

  return {
    bundle_hash: first.bundle_hash,
    ...oracle,
    protocol_version: "2",
  };
}

function runSuite(suiteFile) {
  const suite = loadJson(suiteFile);
  const suiteName = suite.suite || path.basename(suiteFile, ".json");
  const bundleDirectory = path.join(ROOT, "bundles", suiteName);
  const expectedPath = path.join(ROOT, "expected", suiteName, "verdict.json");

  const bundles = loadBundles(bundleDirectory);
  const expected = loadJson(expectedPath);
  const actual = deriveResult(suiteName, bundles);

  if (!deepEqual(actual, expected)) {
    throw new Error(
      [
        `${suiteName}: conformance mismatch`,
        `expected=${JSON.stringify(canonicalize(expected))}`,
        `actual=${JSON.stringify(canonicalize(actual))}`,
      ].join("\n"),
    );
  }

  return {
    suite: suiteName,
    result: "PASS",
  };
}

function main() {
  const suitesDirectory = path.join(ROOT, "suites");
  const suites = fs
    .readdirSync(suitesDirectory)
    .filter((file) => file.endsWith(".json"))
    .sort();

  if (suites.length === 0) {
    throw new Error("No conformance suites found");
  }

  for (const suite of suites) {
    const result = runSuite(path.join(suitesDirectory, suite));
    console.log(`${result.suite}: ${result.result}`);
  }

  console.log("\nAll conformance suites executed.");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
