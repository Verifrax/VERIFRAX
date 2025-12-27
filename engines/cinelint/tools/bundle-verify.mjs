import fs from "fs";
import path from "path";
import crypto from "crypto";

function sha256(x){ return crypto.createHash("sha256").update(x).digest("hex"); }

// Canonical JSON (dependency-free, inlined for bundle portability)
function canonicalStringify(value) {
  return JSON.stringify(sortRec(value));
}

function sortRec(v) {
  if (v === null) return null;
  if (Array.isArray(v)) return v.map(sortRec);
  if (typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = sortRec(v[k]);
    return out;
  }
  return v;
}

function sha256Cert(certObj){
  return crypto.createHash("sha256").update(canonicalStringify(certObj)).digest("hex");
}

function merkleRoot(leaves){
  if(leaves.length === 0) return sha256(Buffer.from(""));
  let level = leaves.map(x => sha256(Buffer.from(x)));
  while(level.length > 1){
    const next = [];
    for(let i=0;i<level.length;i+=2){
      const a = level[i];
      const b = level[i+1] ?? level[i];
      next.push(sha256(Buffer.from(a+b)));
    }
    level = next;
  }
  return level[0];
}

function readJson(p){ return JSON.parse(fs.readFileSync(p,"utf8")); }
function existsOrInvalid(p){
  if(!fs.existsSync(p)){ console.error(`INVALID: missing ${p}`); process.exit(1); }
}

function verifyManifest(bundleDir, manifestPath, expectedRoot, expectedListHash){
  const m = readJson(manifestPath);
  if(path.isAbsolute(m.dir) || String(m.dir).includes("..")){
    console.error(`FRAUD: non-portable manifest dir: ${m.dir}`);
    process.exit(3);
  }
  const entries = m.entries || [];
  for(const e of entries){
    const filePath = path.join(bundleDir, m.dir, e.path);
    if(!fs.existsSync(filePath)){
      console.error(`INVALID: manifest entry missing file: ${m.dir}/${e.path}`);
      process.exit(1);
    }
    const actual = sha256(fs.readFileSync(filePath));
    if(actual !== e.sha256){
      console.error(`FRAUD: file hash mismatch: ${m.dir}/${e.path}`);
      process.exit(3);
    }
  }
  const list_hash = sha256(Buffer.from(JSON.stringify(entries)));
  const root = merkleRoot(entries.map(e => e.sha256));
  if(list_hash !== expectedListHash){ console.error(`INVALID: manifest list_hash mismatch: ${manifestPath}`); process.exit(1); }
  if(root !== expectedRoot){ console.error(`INVALID: manifest merkle_root mismatch: ${manifestPath}`); process.exit(1); }
}

const STRICT = true;
const externalArg = process.argv.find(a => a === "--external" || a.startsWith("--external="));
const EXTERNAL = !!externalArg;
const EXTERNAL_MODE = externalArg && externalArg.includes("=") ? externalArg.split("=")[1] : "all";
const EXTERNAL_PREFLIGHT = process.argv.includes("--external-preflight");

// Load policy config if available (Patch 6)
function loadPolicy(bundleDir) {
  const configPath = path.join(bundleDir, "verify.config.json");
  if (fs.existsSync(configPath)) {
    return readJson(configPath);
  }
  // Default policy
  return {
    require_external_anchors: false,
    require_transparency_inclusion_proof: false,
    require_files_present: true
  };
}

function failInvalid(msg) {
  console.error(`INVALID: ${msg}`);
  process.exit(1);
}

function failFraud(msg) {
  console.error(`FRAUD: ${msg}`);
  process.exit(3);
}

async function main(){
  const bundleDir = process.argv[2] || ".";
  if(!bundleDir){ console.error("usage: node verify.mjs <bundleDir>"); process.exit(2); }

  const policy = loadPolicy(bundleDir);
  
  // If require_external_anchors is true, EXTERNAL mode is mandatory
  if (policy.require_external_anchors && !EXTERNAL) {
    failInvalid("external anchor verification required by policy");
  }

  const certPath = path.join(bundleDir, "certificate.v1.json");
  const shaPath  = path.join(bundleDir, "certificate.v1.sha256");

  existsOrInvalid(certPath);
  existsOrInvalid(shaPath);

  const cert = readJson(certPath);
  
  // Schema validation (Patch 4) - explicit checks (no external deps)
  if (!cert || typeof cert !== "object") failInvalid("certificate not an object");
  if (!cert.subject || typeof cert.subject.asset_id !== "string" || !cert.subject.asset_id) failInvalid("missing subject.asset_id");
  if (!Array.isArray(cert.anchors) || cert.anchors.length < 2) failInvalid("requires >=2 anchors");
  for (const a of cert.anchors) {
    if (!a || typeof a !== "object") failInvalid("anchor not an object");
    if (typeof a.type !== "string" || !a.type) failInvalid("anchor missing type");
    if (typeof a.proof_ref !== "string" || !a.proof_ref) failInvalid("anchor missing proof_ref");
  }
  
  // Canonical cert hash
  const expected = fs.readFileSync(shaPath,"utf8").trim();
  const computed = sha256Cert(cert);
  if (computed !== expected) { failInvalid("certificate hash mismatch"); }

  // External preflight must short-circuit before normal verification output
  if (EXTERNAL_PREFLIGHT) {
    const missing = [];
    for (const a of cert.anchors || []) {
      const proofPath = path.join(bundleDir, a.proof_ref);
      const proof = readJson(proofPath);
      if (a.type === "eth") {
        const rpc = process.env.CINELINT_ETH_RPC || proof.rpc;
        if (!rpc) {
          missing.push("eth.rpc (env CINELINT_ETH_RPC or anchors/eth.json)");
        }
        if (proof.chain_id === undefined || proof.chain_id === null || proof.chain_id === "") {
          missing.push("eth.chain_id (anchors/eth.json)");
        } else if (rpc) {
          try {
            const chainIdBody = { jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] };
            const chainRes = await fetch(rpc, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(chainIdBody),
            });
            if (!chainRes.ok) {
              missing.push(`eth.chain_id check failed: rpc http ${chainRes.status}`);
            } else {
              const chainJson = await chainRes.json();
              const rpcChainId = chainJson.result ? parseInt(chainJson.result, 16) : null;
              if (rpcChainId === null) {
                missing.push("eth.chain_id check failed: rpc returned null chainId");
              } else {
                const proofChainId = typeof proof.chain_id === "number" ? proof.chain_id : parseInt(String(proof.chain_id), 10);
                if (rpcChainId !== proofChainId) {
                  missing.push(`eth.chain_id mismatch (rpc=${rpcChainId}, proof=${proofChainId})`);
                }
              }
            }
          } catch (e) {
            missing.push(`eth.chain_id check failed: ${e?.message || String(e)}`);
          }
        }
        if (!proof.tx_hash) {
          missing.push("eth.tx_hash (anchors/eth.json)");
        } else if (!/^0x[0-9a-fA-F]{64}$/.test(proof.tx_hash)) {
          missing.push("eth.tx_hash invalid (must be 0x + 64 hex)");
        }
      }
      if (a.type === "rekor") {
        const url = process.env.CINELINT_REKOR_URL || proof.rekor_url || "https://rekor.sigstore.dev";
        if (!url) missing.push("rekor_url");
        if (!proof.uuid) {
          missing.push("rekor.uuid (anchors/rekor.json)");
        } else if (!/^[0-9a-fA-F-]{16,64}$/.test(proof.uuid)) {
          missing.push("rekor.uuid invalid (unexpected format)");
        }
      }
    }
    if (missing.length) {
      failInvalid("external preflight missing: " + missing.join(", "));
    }
    console.log("EXTERNAL_PREFLIGHT_OK");
    process.exit(0);
  }

  // base gates (anchors already checked in schema validation above)
  const types = new Set();
  for (const a of cert.anchors) {
    if (types.has(a.type)) failFraud(`duplicate anchor type: ${a.type}`);
    types.add(a.type);
  }
  if(types.size < 2){ failInvalid("anchors must be distinct types"); }
  if(!cert.consensus?.stake_snapshot_hash || !cert.consensus?.threshold_sig){ failInvalid("missing stake snapshot or threshold signature"); }
  if(!cert.transparency?.log_root || !cert.transparency?.log_entry_hash){ failInvalid("missing transparency proofs"); }

  // fraud minimal (Patch 3)
  const anchorRefs = cert.anchors.map(a=>a.proof_ref);
  if(new Set(anchorRefs).size !== anchorRefs.length){ failFraud("duplicate anchor proof refs"); }

  // file presence: anchors + transparency
  const expectedCommitment = cert.outputs?.merkle_root || cert.inputs?.merkle_root;
  for(const a of cert.anchors){
    const p = path.join(bundleDir, a.proof_ref);
    existsOrInvalid(p);
    const j = readJson(p);
    if(j.commitment_hash && a.commitment_hash && j.commitment_hash !== a.commitment_hash){
      failFraud(`anchor commitment mismatch for ${a.type}`);
    }
    // Patch 3: enforce commitment binding
    if (j.commitment && expectedCommitment && j.commitment !== expectedCommitment) {
      failFraud(`anchor commitment mismatch: ${a.proof_ref}`);
    }
  }
  existsOrInvalid(path.join(bundleDir, "transparency", "log.json"));

  // manifests (optional but if present must match)
  // Patch 6: respect require_files_present policy
  const manDir = path.join(bundleDir, "manifests");
  const inMan  = path.join(manDir, "inputs.manifest.json");
  const outMan = path.join(manDir, "outputs.manifest.json");
  if(fs.existsSync(inMan) && fs.existsSync(outMan)){
    verifyManifest(bundleDir, inMan, cert.inputs.merkle_root, cert.inputs.list_hash);
    verifyManifest(bundleDir, outMan, cert.outputs.merkle_root, cert.outputs.list_hash);
  } else if (policy.require_files_present && (cert.inputs || cert.outputs)) {
    failInvalid("manifests required by policy but not present");
  }

  // Patch 1: External verification (Phase-2)
  if (EXTERNAL) {
    try {
      // Try bundle-embedded lib first, then repo lib
      let verifyEthAnchor, verifyRekorAnchor;
      const importPaths = [
        ["./tools/lib/verify-eth-anchor.mjs", "./tools/lib/verify-rekor-anchor.mjs"],
        ["../tools/lib/verify-eth-anchor.mjs", "../tools/lib/verify-rekor-anchor.mjs"]
      ];
      let imported = false;
      for (const [ethPath, rekorPath] of importPaths) {
        try {
          const ethMod = await import(ethPath);
          const rekorMod = await import(rekorPath);
          verifyEthAnchor = ethMod.verifyEthAnchor;
          verifyRekorAnchor = rekorMod.verifyRekorAnchor;
          imported = true;
          break;
        } catch {
          continue;
        }
      }
      if (!imported) {
        throw new Error("could not import external verification modules");
      }
      
      for (const a of cert.anchors || []) {
        if (a.type === "eth" && (EXTERNAL_MODE === "all" || EXTERNAL_MODE === "eth")) {
          const proof = readJson(path.join(bundleDir, a.proof_ref));
          await verifyEthAnchor({
            rpc: process.env.CINELINT_ETH_RPC || proof.rpc,
            tx_hash: proof.tx_hash,
            expected_commitment: expectedCommitment,
          });
        }
        if (a.type === "rekor" && (EXTERNAL_MODE === "all" || EXTERNAL_MODE === "rekor")) {
          const proof = readJson(path.join(bundleDir, a.proof_ref));
          await verifyRekorAnchor({
            rekor_url: process.env.CINELINT_REKOR_URL || proof.rekor_url,
            uuid: proof.uuid,
            expected: expectedCommitment,
          });
        }
      }
    } catch (e) {
      const msg = e?.message || String(e);
      const cause = e?.cause ? (" | cause=" + (e.cause?.message || String(e.cause))) : "";
      failInvalid("external verification failed: " + msg + cause);
    }
  }

  // Patch 2: Status line
  if (EXTERNAL) {
    const modeStr = EXTERNAL_MODE !== "all" ? `+${EXTERNAL_MODE}` : "";
    console.log(`VERIFIED+EXTERNAL${modeStr}`);
  } else {
    console.log("VERIFIED");
  }
}
main().catch(e => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
