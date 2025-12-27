import fs from "fs";

const p = process.argv[2] || "out/cert-bundles/run-003/anchors/rekor.json";
const uuid = process.argv[3];

if (!uuid) {
  console.error("usage: node tools/anchors/set-rekor-uuid.mjs <rekor.json> <UUID>");
  process.exit(2);
}
if (!/^[0-9a-fA-F-]{16,64}$/.test(uuid)) {
  console.error("INVALID: uuid format unexpected");
  process.exit(1);
}

const j = JSON.parse(fs.readFileSync(p, "utf8"));
j.uuid = uuid;
fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
console.log("OK:", p, "uuid=", uuid);

