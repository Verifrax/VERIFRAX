import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = process.argv[2];
if (!dir) { console.error("usage: node tools/bundle-pack.mjs <bundleDir>"); process.exit(2); }
if (!fs.existsSync(dir)) { console.error("missing bundleDir"); process.exit(2); }

function walk(relBase, absBase) {
  const out = [];
  const items = fs.readdirSync(absBase).sort(); // stable
  for (const name of items) {
    const abs = path.join(absBase, name);
    const rel = path.join(relBase, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      out.push(rel + "/");
      out.push(...walk(rel, abs));
    } else {
      out.push(rel);
    }
  }
  return out;
}

// Always copy verify.mjs template into bundle (overwrite to ensure latest)
const verifyTemplate = path.join(__dirname, "bundle-verify.mjs");
const verifyTarget = path.join(dir, "verify.mjs");
fs.copyFileSync(verifyTemplate, verifyTarget);

// Copy lib directory for external verification
const libSource = path.join(__dirname, "lib");
const libTarget = path.join(dir, "tools", "lib");
if (fs.existsSync(libSource)) {
  fs.mkdirSync(path.join(dir, "tools"), { recursive: true });
  if (fs.existsSync(libTarget)) fs.rmSync(libTarget, { recursive: true, force: true });
  fs.cpSync(libSource, libTarget, { recursive: true });
}

// Deterministic timestamps: set mtime/atime of all files in bundle to epoch (or fixed)
const FIXED_EPOCH_SEC = 0; // Jan 1, 1970 UTC
function touchTree(absBase) {
  for (const name of fs.readdirSync(absBase)) {
    const abs = path.join(absBase, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      touchTree(abs);
      fs.utimesSync(abs, FIXED_EPOCH_SEC, FIXED_EPOCH_SEC);
    } else {
      fs.utimesSync(abs, FIXED_EPOCH_SEC, FIXED_EPOCH_SEC);
    }
  }
}
touchTree(dir);

const base = path.basename(dir.replace(/\/$/, ""));
const out = path.join("out", `${base}.zip`);
fs.mkdirSync("out", { recursive: true });

// Create stable file list relative to parent of dir
const parent = path.dirname(dir);
const absOut = path.resolve(out);

const list = walk(base, path.join(parent, base))
  .filter(p => !p.endsWith("/.DS_Store"))
  .filter(p => !p.includes("/node_modules/"));

const stdin = list.join("\n") + "\n";

// Deterministic zip:
// -X : strip extra file attributes (macOS metadata)
// -q : quiet
// -@ : read file list from stdin (preserves order)
// -r is NOT used (we control recursion/order ourselves)
execSync(
  `/bin/sh -lc 'cd "${parent}" && /usr/bin/zip -X -q "${absOut}" -@'`,
  { input: stdin, stdio: ["pipe", "inherit", "inherit"] }
);

console.log(out);

