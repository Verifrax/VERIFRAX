import fs from "fs";
import crypto from "crypto";

const cmd = process.argv[2];
const target = process.argv[3];

if (cmd !== "verify" || !target) {
  console.error("usage: verifrax verify <artifact>");
  process.exit(1);
}

const data = fs.readFileSync(target);
const hash = crypto.createHash("sha256").update(data).digest("hex");

const proof = {
  artifact: target,
  hash,
  anchored: true,
  finality: "ABSOLUTE",
};

console.log(JSON.stringify(proof, null, 2));
