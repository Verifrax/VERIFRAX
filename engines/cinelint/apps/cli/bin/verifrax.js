#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const cmd = process.argv[2];
const target = process.argv[3];

if (cmd !== "verify" || !target) {
  console.error("usage: verifrax verify <artifact_path>");
  process.exit(1);
}

const p = path.resolve(process.cwd(), target);
const data = fs.readFileSync(p);
const hash = crypto.createHash("sha256").update(data).digest("hex");

const proof = {
  artifact: path.basename(p),
  path: p,
  sha256: hash,
  finality: "ABSOLUTE",
  anchored: false,
  verify_ref: "https://github.com/Verifrax/VERIFRAX"
};

process.stdout.write(JSON.stringify(proof, null, 2) + "\n");

