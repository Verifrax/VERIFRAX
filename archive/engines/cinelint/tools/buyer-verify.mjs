import fs from "fs";
import path from "path";
import crypto from "crypto";

const root = process.argv[2] || ".";
const must = (p) => {
  const full = path.join(root, p);
  if (!fs.existsSync(full)) throw new Error(`missing: ${p}`);
};

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

const walk = (dir) => {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .sort((a,b) => a.name.localeCompare(b.name));
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile()) out.push(p);
  }
  return out;
};

try {
  // Required paths
  must("inputs");
  must("outputs");
  must("transparency");
  must("release.json");
  must("VERIFY.txt");
  must("run.id");
  must("MANIFEST.sha256");
  must("verify.mjs");

  // Root closure: only these files/dirs allowed at bundle root
  const allowedRoot = new Set([
    "inputs",
    "outputs",
    "transparency",
    "release.json",
    "VERIFY.txt",
    "run.id",
    "MANIFEST.sha256",
    "verify.mjs"
  ]);

  for (const name of fs.readdirSync(root)) {
    if (!allowedRoot.has(name)) {
      throw new Error(`unexpected root entry: ${name}`);
    }
  }

  // Load manifest
  const manifestLines = fs.readFileSync(path.join(root, "MANIFEST.sha256"), "utf8")
    .split("\n").filter(Boolean);
  if (manifestLines.length === 0) throw new Error("empty MANIFEST.sha256");

  const manifestSet = new Set();
  for (const line of manifestLines) {
    const m = line.match(/^([a-f0-9]{64})\s\s(.+)$/);
    if (!m) throw new Error("bad manifest line: " + line);
    const expected = m[1];
    const rel = m[2].replaceAll("\\", "/");
    manifestSet.add(rel);

    const fp = path.join(root, rel);
    if (!fs.existsSync(fp)) throw new Error(`missing file from manifest: ${rel}`);
    const actual = sha256(fs.readFileSync(fp));
    if (actual !== expected) throw new Error(`hash mismatch: ${rel}`);
  }

  // Scope closure: every file in scope must be listed in manifest
  const scopeDirs = ["inputs", "outputs", "transparency"];
  for (const d of scopeDirs) {
    const files = walk(path.join(root, d));
    for (const fp of files) {
      const rel = path.relative(root, fp).replaceAll("\\", "/");
      if (!manifestSet.has(rel)) {
        throw new Error(`unmanifested file present: ${rel}`);
      }
    }
  }

  // run.id = sha256(MANIFEST bytes)
  const computedRunId = sha256(fs.readFileSync(path.join(root, "MANIFEST.sha256")));
  const storedRunId = fs.readFileSync(path.join(root, "run.id"), "utf8").trim();
  if (computedRunId !== storedRunId) throw new Error("run.id mismatch (manifest drift)");

  console.log("VERIFIED");
  process.exit(0);
} catch (e) {
  console.error("INVALID:", e.message);
  process.exit(1);
}
