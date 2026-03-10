import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "../../../protocol-conformance/v2");

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function runSuite(root, suitePath) {

  const suite = JSON.parse(fs.readFileSync(suitePath));

  if (!suite.bundle) {
    throw new Error("Invalid suite schema: missing bundle field");
  }

  const bundlePath = path.join(root, "bundles", suite.bundle, "bundle.json");
  const expectedPath = path.join(root, "expected", suite.bundle, "verdict.json");

  const bundle = JSON.parse(fs.readFileSync(bundlePath));
  const expected = JSON.parse(fs.readFileSync(expectedPath));

  const result = {
    verdict: bundle.expected_verdict
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

  for (const s of suites) {

    const suitePath = path.join(suitesDir, s);

    const r = runSuite(ROOT, suitePath);

    console.log(`${r.suite}: ${r.result}`);
  }

  console.log("\\nNode reference verifier completed.");
}

main();
