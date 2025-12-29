import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const zip = process.argv[2];
if (!zip) throw new Error("ZIP required");

const shaFile = zip + ".sha256";
if (!fs.existsSync(shaFile)) {
  console.error("INVALID: checksum file not found:", shaFile);
  process.exit(1);
}

const expected = fs.readFileSync(shaFile, "utf8").trim();

const actual = crypto
  .createHash("sha256")
  .update(fs.readFileSync(zip))
  .digest("hex");

if (expected !== actual) {
  console.error("INVALID: checksum mismatch");
  console.error(`Expected: ${expected}`);
  console.error(`Actual:   ${actual}`);
  process.exit(1);
}

const tmpDir = `/tmp/verifrax-verify-${Date.now()}`;
fs.mkdirSync(tmpDir, { recursive: true });

execSync(`unzip -q ${zip} -d ${tmpDir}`);

const extractedEntries = fs.readdirSync(tmpDir);
if (extractedEntries.length !== 1) {
  console.error("INVALID: zip must contain exactly one top-level directory");
  process.exit(1);
}

const bundleRoot = path.join(tmpDir, extractedEntries[0]);

// Contract paths enforced
const required = [
  "inputs",
  "outputs",
  "transparency",
  "verify.mjs",
  "VERIFY.txt",
  "release.json"
];

for (const p of required) {
  const full = path.join(bundleRoot, p);
  if (!fs.existsSync(full)) {
    console.error("INVALID: missing required path:", p);
    process.exit(1);
  }
}

// Clean-room execute embedded verifier
try {
  execSync(`node verify.mjs .`, { cwd: bundleRoot, stdio: "inherit" });
} catch (e) {
  // If embedded verifier fails, we treat as INVALID
  console.error("INVALID: embedded verify.mjs failed");
  process.exit(1);
}

// Tamper must fail
try {
  // mutate first file in outputs deterministically
  const outDir = path.join(bundleRoot, "outputs");
  const outs = fs.readdirSync(outDir).map(f => path.join(outDir, f)).filter(f => fs.statSync(f).isFile());
  if (outs.length > 0) fs.appendFileSync(outs[0], "\nTAMPER\n");

  execSync(`node verify.mjs .`, { cwd: bundleRoot, stdio: "ignore" });

  console.error("ERROR: tampered bundle still verified (must fail)");
  process.exit(1);
} catch {
  // Expected: tampered verify must fail
}

console.log("VERIFIED: bundle checksum + contract paths + clean-room verification + tamper resistance");
process.exit(0);
