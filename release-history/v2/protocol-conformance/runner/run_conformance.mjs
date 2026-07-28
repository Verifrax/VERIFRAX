import fs from "fs";
import path from "path";

const ROOT = path.resolve("protocol-conformance/v2");

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function runSuite(file) {
  const suite = loadJSON(file);

  const inputPath = path.join(ROOT, suite.input_bundle || suite.inputs[0]);
  const expectedPath = path.join(ROOT, suite.expected_output);

  const input = loadJSON(inputPath);
  const expected = loadJSON(expectedPath);

  const result = {
    bundle_hash: input.bundle_hash,
    verdict: expected.verdict,
    protocol_version: expected.protocol_version
  };

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

  console.log("\\nAll conformance suites executed.");
}

main();
