import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const tag = process.argv[2];
if (!tag) throw new Error("TAG required");

const outDir = `out/${tag}`;
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const writeJSON = (p, v) =>
  fs.writeFileSync(p, JSON.stringify(v, null, 2));

const hashFile = (p) =>
  crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

const copy = (src, dst) => {
  if (!fs.existsSync(src)) {
    throw new Error(`Source not found: ${src}`);
  }
  execSync(`cp -R ${src} ${dst}`);
};

// Copy required bundle components
if (fs.existsSync("run/inputs")) {
  copy("run/inputs", `${outDir}/inputs`);
} else if (fs.existsSync("sample/run-003/inputs")) {
  copy("sample/run-003/inputs", `${outDir}/inputs`);
} else {
  throw new Error("No inputs directory found in run/ or sample/run-003/");
}

if (fs.existsSync("run/outputs")) {
  copy("run/outputs", `${outDir}/outputs`);
} else if (fs.existsSync("sample/run-003/outputs")) {
  copy("sample/run-003/outputs", `${outDir}/outputs`);
} else {
  throw new Error("No outputs directory found in run/ or sample/run-003/");
}

if (fs.existsSync("run/transparency")) {
  copy("run/transparency", `${outDir}/transparency`);
} else if (fs.existsSync("sample/run-003/transparency")) {
  copy("sample/run-003/transparency", `${outDir}/transparency`);
} else {
  // Transparency is optional, create empty if missing
  fs.mkdirSync(`${outDir}/transparency`, { recursive: true });
}

// Copy embedded buyer verifier
if (fs.existsSync("tools/buyer-verify.mjs")) {
  fs.copyFileSync("tools/buyer-verify.mjs", `${outDir}/verify.mjs`);
} else {
  throw new Error("tools/buyer-verify.mjs not found");
}

// Create VERIFY.txt
fs.writeFileSync(
  `${outDir}/VERIFY.txt`,
  "node verify.mjs .\nExit 0=VERIFIED,1=INVALID,3=FRAUD\n"
);

// Generate run.id (mandatory, derived from MANIFEST bytes)
if (!fs.existsSync("tools/run-id.mjs")) {
  throw new Error("tools/run-id.mjs missing (run.id required)");
}
// run.id is computed after MANIFEST exists (see below)

// Create MANIFEST.sha256 (mandatory, deterministic)
if (!fs.existsSync("tools/manifest.mjs")) {
  throw new Error("tools/manifest.mjs missing (MANIFEST required)");
}
execSync(`node tools/manifest.mjs ${outDir} MANIFEST.sha256`, { stdio: "ignore" });

// Compute run.id from MANIFEST bytes
{
  const runId = execSync(`node tools/run-id.mjs ${outDir}/MANIFEST.sha256`, { encoding: "utf8" }).trim();
  if (!runId || runId.length !== 64) throw new Error("invalid run.id produced");
  fs.writeFileSync(`${outDir}/run.id`, runId);
}

// Create release.json
writeJSON(`${outDir}/release.json`, {
  tag,
  timestamp: new Date().toISOString(),
  git_commit: execSync("git rev-parse HEAD", { encoding: "utf8" }).trim()
});

// Normalize mtimes for reproducible zips (zip stores min 1980-01-01)
try {
  const epoch = new Date('1970-01-01T00:00:00Z');
  const walk = (dir) => {
    // Normalize directory timestamp first
    try {
      fs.utimesSync(dir, epoch, epoch);
    } catch {}
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(fullPath);
      } else if (item.isFile()) {
        // Set mtime to epoch (zip format minimum is 1980-01-01)
        fs.utimesSync(fullPath, epoch, epoch);
      }
    }
  };
  walk(outDir);
} catch (e) {
  // Ignore errors but don't fail the build
}

// Create bundle zip (deterministic: Node-generated file list + zip -X)
{
  const list = [];
  const walk = (dirRel) => {
    const abs = path.join(outDir, dirRel);
    const entries = fs.readdirSync(abs, { withFileTypes: true })
      .sort((a,b) => a.name.localeCompare(b.name));
    for (const e of entries) {
      const childRel = path.posix.join(dirRel, e.name);
      if (e.isDirectory()) walk(childRel);
      else if (e.isFile()) list.push(path.posix.join(tag, childRel));
    }
  };

  // include files at root of outDir (MANIFEST, VERIFY, etc.)
  const rootEntries = fs.readdirSync(outDir, { withFileTypes: true })
    .sort((a,b) => a.name.localeCompare(b.name));
  for (const e of rootEntries) {
    const rel = e.name;
    if (e.isDirectory()) walk(rel);
    else if (e.isFile()) list.push(path.posix.join(tag, rel));
  }

  const input = list.join("\n") + "\n";
  execSync(`cd out && zip -X -q ${tag}.zip -@`, { input });
}
fs.writeFileSync(
  `out/${tag}.zip.sha256`,
  hashFile(`out/${tag}.zip`)
);

console.log(`Bundle built: out/${tag}.zip`);

