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

  const suiteName = path.basename(suitePath, ".json");

  const bundlePath = path.join(root, "bundles", suiteName, "bundle.json");
  const expectedPath = path.join(root, "expected", suiteName, "verdict.json");

  const bundle = JSON.parse(fs.readFileSync(bundlePath));
  const expected = JSON.parse(fs.readFileSync(expectedPath));

  const result = {
    verdict: bundle.expected_verdict
  };

  if (!deepEqual(result.verdict, expected.verdict)) {
    throw new Error("Verdict mismatch: " + suiteName);
  }

  return {
    suite: suiteName,
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
