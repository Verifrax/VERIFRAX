import fs from "fs";
import crypto from "crypto";
import { sha256Cert } from "./lib/hash-cert.mjs";

function sha256(x){ return crypto.createHash("sha256").update(x).digest("hex"); }

function main(){
  const certPath = process.argv[2];
  if(!certPath){ console.error("usage: node tools/cert-verify.mjs <certificate.v1.json>"); process.exit(2); }

  const cert = JSON.parse(fs.readFileSync(certPath,"utf8"));
  const computed = sha256Cert(cert);
  const shaPath = certPath.replace(".json",".sha256");
  const expected = fs.existsSync(shaPath) ? fs.readFileSync(shaPath,"utf8").trim() : null;

  if(expected && expected !== computed){ console.error("INVALID: certificate hash mismatch"); process.exit(1); }

  // Phase-1 gates (fail-closed)
  if(!Array.isArray(cert.anchors) || cert.anchors.length < 2){ console.error("INVALID: requires >=2 anchors"); process.exit(1); }
  const types = new Set(cert.anchors.map(a=>a.type));
  if(types.size < 2){ console.error("INVALID: anchors must be distinct types"); process.exit(1); }
  if(!cert.consensus?.stake_snapshot_hash || !cert.consensus?.threshold_sig){ console.error("INVALID: missing stake snapshot or threshold signature"); process.exit(1); }
  if(!cert.transparency?.log_root || !cert.transparency?.log_entry_hash){ console.error("INVALID: missing transparency proofs"); process.exit(1); }

  // contradiction checks (v1 minimal)
  const anchorRefs = cert.anchors.map(a=>a.proof_ref);
  const uniqRefs = new Set(anchorRefs);
  if(uniqRefs.size !== anchorRefs.length){ console.error("FRAUD: duplicate anchor proof refs"); process.exit(3); }

  console.log("VERIFIED");
}
main();

