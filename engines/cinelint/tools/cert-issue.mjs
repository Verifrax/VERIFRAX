import fs from "fs";
import path from "path";
import crypto from "crypto";
import { sha256Cert } from "./lib/hash-cert.mjs";

function sha256(x){ return crypto.createHash("sha256").update(x).digest("hex"); }
function uuid(){
  // deterministic-enough for dev; replace with crypto.randomUUID() if allowed
  return (crypto.randomUUID ? crypto.randomUUID() : sha256(String(Date.now())+Math.random())).slice(0,36);
}

function main(){
  const inPath = process.argv[2];
  const outDir = process.argv[3] || "out/cert-bundles/run-001";
  if(!inPath){ console.error("usage: node tools/cert-issue.mjs <cert-input.json> <outDir>"); process.exit(2); }

  const partial = JSON.parse(fs.readFileSync(inPath,"utf8"));

  // Phase-1 issuance gates (fail-closed)
  if(!partial.issuer?.key_id || !String(partial.issuer.key_id).startsWith("intermediate-DEV-")){
    console.error("REFUSE: issuer.key_id must be intermediate-DEV-* in sandbox mode");
    process.exit(1);
  }
  if(!Array.isArray(partial.anchors) || partial.anchors.length < 2){
    console.error("REFUSE: requires >=2 anchors to issue certificate");
    process.exit(1);
  }
  const types = new Set(partial.anchors.map(a=>a.type));
  if(types.size < 2){
    console.error("REFUSE: anchors must be distinct types");
    process.exit(1);
  }
  if(!partial.consensus?.stake_snapshot_hash || !partial.consensus?.threshold_sig){
    console.error("REFUSE: missing stake snapshot or threshold signature");
    process.exit(1);
  }
  if(!partial.transparency?.log_root || !partial.transparency?.log_entry_hash){
    console.error("REFUSE: missing transparency proofs");
    process.exit(1);
  }
  const cert = {
    version: "v1",
    certificate_id: uuid(),
    issued_at: new Date().toISOString(),
    ...partial
  };

  fs.mkdirSync(outDir, { recursive: true });
  const certPath = path.join(outDir, "certificate.v1.json");
  fs.writeFileSync(certPath, JSON.stringify(cert, null, 2));

  const hash = sha256Cert(cert);
  fs.writeFileSync(path.join(outDir, "certificate.v1.sha256"), hash + "\n");
  process.stdout.write(hash + "\n");
}
main();

