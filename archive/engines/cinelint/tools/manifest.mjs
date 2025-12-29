import fs from "fs";
import path from "path";
import crypto from "crypto";

const root = process.argv[2] || ".";
const out = process.argv[3] || "MANIFEST.sha256";

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .sort((a,b) => a.name.localeCompare(b.name)); // deterministic
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(p));
    else if (e.isFile()) files.push(p);
  }
  return files;
};

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

// Contract scope: these directories only
const scope = ["inputs", "outputs", "transparency"];
const fileList = [];
for (const s of scope) {
  const p = path.join(root, s);
  if (!fs.existsSync(p)) continue;
  fileList.push(...walk(p));
}

// Write relative paths + hashes
const lines = fileList.map(fp => {
  const rel = path.relative(root, fp).replaceAll("\\", "/");
  if (rel.startsWith("/") || rel.includes("..")) throw new Error("invalid path: " + rel);
  const h = sha256(fs.readFileSync(fp));
  return `${h}  ${rel}`;
});

fs.writeFileSync(path.join(root, out), lines.join("\n") + "\n");
console.log(out);

