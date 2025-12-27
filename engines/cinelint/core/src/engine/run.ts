import fs from "fs";
import path from "path";
import crypto from "crypto";

const cfg = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const out = process.argv[3];

fs.mkdirSync(out + "/inputs", { recursive: true });
fs.mkdirSync(out + "/outputs", { recursive: true });
fs.mkdirSync(out + "/manifests", { recursive: true });

fs.writeFileSync(out + "/inputs/a.txt", "A\n");
fs.writeFileSync(out + "/outputs/b.txt", "B\n");

function hashDir(dir: string) {
  const h = crypto.createHash("sha256");
  for (const f of fs.readdirSync(dir).sort()) {
    h.update(fs.readFileSync(path.join(dir, f)));
  }
  return h.digest("hex");
}

fs.writeFileSync(
  out + "/manifests/inputs.manifest.json",
  JSON.stringify({ merkle_root: hashDir(out + "/inputs") }, null, 2)
);
fs.writeFileSync(
  out + "/manifests/outputs.manifest.json",
  JSON.stringify({ merkle_root: hashDir(out + "/outputs") }, null, 2)
);

