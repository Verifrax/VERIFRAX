import fs from "fs";

const p = process.argv[2] || "out/cert-bundles/run-003/anchors/eth.json";
const tx = process.argv[3];

if (!tx) {
  console.error("usage: node tools/anchors/set-eth-tx.mjs <eth.json> <0xTXHASH>");
  process.exit(2);
}
if (!/^0x[0-9a-fA-F]{64}$/.test(tx)) {
  console.error("INVALID: tx_hash must be 0x + 64 hex");
  process.exit(1);
}

const j = JSON.parse(fs.readFileSync(p, "utf8"));
j.tx_hash = tx;
fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
console.log("OK:", p, "tx_hash=", tx);

