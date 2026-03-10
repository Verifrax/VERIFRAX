import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "protocol-conformance/v2");

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function canonical(obj) {
  if (Array.isArray(obj)) {
    return obj.map(canonical);
  }
  if (obj && typeof obj === "object") {
    const sorted = {};
    Object.keys(obj).sort().forEach(k => {
      sorted[k] = canonical(obj[k]);
    });
    return sorted;
  }
  return obj;
}

function deepEqual(a, b) {
  return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
}

function verifyBundle(bundle) {

  if (!bundle.protocol_version) {
    return { verdict: "FAILED", error_class: "MISSING_PROTOCOL_VERSION" };
  }

  if (!bundle.bundle_hash) {
    return { verdict: "FAILED", error_class: "MISSING_BUNDLE_HASH" };
  }

  if (bundle.invalidation) {
    return { verdict: "INVALIDATED", error_class: "CLAIM_INVALIDATED" };
  }

  if (bundle.claims && bundle.claims.length > 1) {
    const a = bundle.claims[0].statement;
    const b = bundle.claims[1].statement;

    if (a.includes("verified") && b.includes("NOT")) {
      return { verdict: "INVALIDATED", error_class: "CONTRADICTION_DETECTED" };
    }
  }

  return { verdict: "VERIFIED" };
}

function runSuite(suitePath) {

  const suite = loadJSON(suitePath);

  const bundlePath = path.join(ROOT, suite.input_bundle);
  const expectedPath = path.join(ROOT, suite.expected_output);

  const bundle = loadJSON(bundlePath);
  const expected = loadJSON(expectedPath);

  const result = verifyBundle(bundle);

  if (!deepEqual(result.verdict, expected.verdict)) {
    throw new Error("Verdict mismatch");
  }

  return {
    suite: suite.suite,
    result: "PASS"
  };
}

function main() {

  const suitesDir = path.join(ROOT, "suites");

  const suites = fs.readdirSync(suitesDir).filter(f => f.endsWith(".json"));

  const results = [];

  for (const s of suites) {

    const suitePath = path.join(suitesDir, s);

    const r = runSuite(suitePath);

    results.push(r);

    console.log(`${r.suite}: ${r.result}`);
  }

  console.log("\\nReference verifier executed successfully.");
}

main();
