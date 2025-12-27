import crypto from "crypto";
import fs from "fs";

const p = process.argv[2];
if (!p) throw new Error("usage: node tools/run-id.mjs <PATH>");
if (!fs.existsSync(p)) throw new Error("missing: " + p);

const h = crypto.createHash("sha256");
h.update(fs.readFileSync(p));
console.log(h.digest("hex"));
