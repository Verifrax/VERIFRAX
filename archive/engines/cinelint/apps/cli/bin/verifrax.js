#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const cmd = process.argv[2];
const target = process.argv[3];

function sha256File(p) {
  const data = fs.readFileSync(p);
  return crypto.createHash("sha256").update(data).digest("hex");
}

function nowIso() {
  return new Date().toISOString();
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

function die(msg) {
  console.error(msg);
  process.exit(1);
}

if (!cmd) die("usage: verifrax <verify|freeze|prove> <artifact_path> [--out <dir>]");

const argv = process.argv.slice(2);
const outIdx = argv.indexOf("--out");
const outDir = outIdx !== -1 ? argv[outIdx + 1] : "out";
if (outIdx !== -1 && !outDir) die("missing value for --out");

if (!target) die("usage: verifrax <verify|freeze|prove> <artifact_path> [--out <dir>]");

const abs = path.resolve(process.cwd(), target);
if (!fs.existsSync(abs)) die(`missing file: ${abs}`);

const root = path.resolve(process.cwd());
const freezeDir = path.join(root, "freeze");
ensureDir(freezeDir);
ensureDir(outDir);

function loadFreeze() {
  const certPath = path.join(freezeDir, "certificate.v1.json");
  const hashPath = path.join(freezeDir, "core.dist.hash");
  const cert = fs.existsSync(certPath) ? JSON.parse(fs.readFileSync(certPath, "utf8")) : null;
  const coreHash = fs.existsSync(hashPath) ? fs.readFileSync(hashPath, "utf8").trim() : null;
  return { cert, coreHash, certPath, hashPath };
}

function verifyOnly() {
  const hash = sha256File(abs);
  const proof = {
    artifact: path.basename(abs),
    path: abs,
    sha256: hash,
    finality: "ABSOLUTE",
    anchored: false,
    verify_ref: "https://verifrax.github.io/VERIFRAX-verify/"
  };
  process.stdout.write(JSON.stringify(proof, null, 2) + "\n");
}

function freeze() {
  const artifactHash = sha256File(abs);
  const { cert, coreHash } = loadFreeze();

  const freezeNotice = {
    schema: "verifrax.freeze.v1",
    created_at: nowIso(),
    repo: "Verifrax/VERIFRAX",
    baseline_tag: "BASELINE_LOCKED",
    head: process.env.GIT_COMMIT || null,
    core_dist_hash: coreHash || null
  };

  const certV1 = {
    schema: "verifrax.certificate.v1",
    issued_at: nowIso(),
    issuer: "VERIFRAX",
    mode: "OFFLINE",
    subject: {
      artifact: path.basename(abs),
      sha256: artifactHash
    },
    claims: {
      deterministic: true,
      immutable_intent: true,
      finality: "ABSOLUTE"
    },
    anchors: [],
    verify_ref: "https://verifrax.github.io/VERIFRAX-verify/"
  };

  writeJson(path.join(outDir, `${path.basename(abs)}.freeze.notice.json`), freezeNotice);
  writeJson(path.join(outDir, `${path.basename(abs)}.certificate.v1.json`), certV1);

  const proof = {
    artifact: path.basename(abs),
    path: abs,
    sha256: artifactHash,
    finality: "ABSOLUTE",
    anchored: false,
    verify_ref: "https://verifrax.github.io/VERIFRAX-verify/",
    outputs: {
      freeze_notice: path.join(outDir, `${path.basename(abs)}.freeze.notice.json`),
      certificate_v1: path.join(outDir, `${path.basename(abs)}.certificate.v1.json`)
    }
  };

  process.stdout.write(JSON.stringify(proof, null, 2) + "\n");
}

function prove() {
  // prove == freeze + bundle into single proof.json
  const artifactHash = sha256File(abs);
  const { cert, coreHash } = loadFreeze();

  const proof = {
    schema: "verifrax.proof.v1",
    created_at: nowIso(),
    repo: "Verifrax/VERIFRAX",
    baseline_tag: "BASELINE_LOCKED",
    core_dist_hash: coreHash || null,
    artifact: {
      name: path.basename(abs),
      path: abs,
      sha256: artifactHash
    },
    certificate_v1: {
      schema: "verifrax.certificate.v1",
      issued_at: nowIso(),
      issuer: "VERIFRAX",
      mode: "OFFLINE",
      subject: { artifact: path.basename(abs), sha256: artifactHash },
      claims: { deterministic: true, immutable_intent: true, finality: "ABSOLUTE" },
      anchors: [],
      verify_ref: "https://verifrax.github.io/VERIFRAX-verify/"
    },
    verify_ref: "https://verifrax.github.io/VERIFRAX-verify/"
  };

  const out = path.join(outDir, `${path.basename(abs)}.proof.v1.json`);
  writeJson(out, proof);
  process.stdout.write(out + "\n");
}

if (cmd === "verify") verifyOnly();
else if (cmd === "freeze") freeze();
else if (cmd === "prove") prove();
else die("usage: verifrax <verify|freeze|prove> <artifact_path> [--out <dir>]");
