#!/usr/bin/env node
import fs from "fs";
import crypto from "crypto";

function sha256(x: Buffer|string){ return crypto.createHash("sha256").update(x).digest("hex"); }

function load(p: string){ return JSON.parse(fs.readFileSync(p,"utf8")); }

function main() {
  const certPath = process.argv[2];
  if (!certPath) { console.error("usage: verifrax-verify <certificate.v1.json>"); process.exit(2); }
  const cert = load(certPath);

  const computed = sha256(JSON.stringify(cert));
  const expected = fs.existsSync(certPath.replace(".json",".sha256"))
    ? fs.readFileSync(certPath.replace(".json",".sha256"),"utf8").trim()
    : null;

  if (expected && expected !== computed) { console.error("INVALID: certificate hash mismatch"); process.exit(1); }

  // Phase-1 hard gates (fail-closed)
  if (!Array.isArray(cert.anchors) || cert.anchors.length < 2) {
    console.error("INVALID: requires >=2 anchors");
    process.exit(1);
  }
  const anchorTypes = new Set(cert.anchors.map((a: any) => a.type));
  if (anchorTypes.size < 2) {
    console.error("INVALID: anchors must be distinct types");
    process.exit(1);
  }
  if (!cert.consensus?.stake_snapshot_hash || !cert.consensus?.threshold_sig) {
    console.error("INVALID: missing stake snapshot or threshold signature");
    process.exit(1);
  }
  if (!cert.transparency?.log_root || !cert.transparency?.log_entry_hash) {
    console.error("INVALID: missing transparency proofs");
    process.exit(1);
  }

  // FRAUD (v1 minimal)
  const anchorRefs = cert.anchors.map((a: any) => a.proof_ref);
  const uniqRefs = new Set(anchorRefs);
  if (uniqRefs.size !== anchorRefs.length) {
    console.error("FRAUD: duplicate anchor proof refs");
    process.exit(3);
  }

  console.log("VERIFIED");
}

main();

