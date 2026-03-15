#!/usr/bin/env node
import fs from "fs";
import path from "path";
import crypto from "crypto";

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function sha256Hex(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function getAllFiles(root, rel = "") {
  const here = path.join(root, rel);
  const entries = fs.readdirSync(here, { withFileTypes: true });
  let out = [];
  for (const e of entries) {
    const childRel = rel ? path.join(rel, e.name) : e.name;
    const childPath = path.join(root, childRel);
    if (e.isDirectory()) out = out.concat(getAllFiles(root, childRel));
    else if (e.isFile() && childRel !== "verdict.json") out.push(childRel);
  }
  return out.sort();
}

function canonicalBundleHash(bundleDir) {
  const files = getAllFiles(bundleDir);
  if (files.length === 0) die("bundle directory is empty");
  const parts = [];
  for (const rel of files) {
    let content = fs.readFileSync(path.join(bundleDir, rel));
    if (rel === "bundle.json") {
      const obj = JSON.parse(content.toString("utf8"));
      if (obj && typeof obj === "object" && Object.prototype.hasOwnProperty.call(obj, "created_at")) {
        delete obj.created_at;
      }
      content = Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()));
    }
    parts.push(rel);
    parts.push(sha256Hex(content));
  }
  return "sha256:" + sha256Hex(Buffer.from(parts.join("\n"), "utf8"));
}

function parseArgs(argv) {
  const args = { in: "", out: "", profile: "" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") args.in = argv[++i] || "";
    else if (a === "--out") args.out = argv[++i] || "";
    else if (a === "--profile") args.profile = argv[++i] || "";
  }
  if (!args.in || !args.out || !args.profile) die("usage: --in <bundle_dir> --out <output_dir> --profile <profile_id>");
  return args;
}

const args = parseArgs(process.argv);
if (args.profile !== "delivery_v1@1.0.0") die("unsupported profile: " + args.profile);
if (!fs.existsSync(args.in) || !fs.statSync(args.in).isDirectory()) die("input bundle dir not found: " + args.in);

const bundleHash = canonicalBundleHash(args.in);
const verdictPayload = { bundle_hash: bundleHash };
const verdictHash = sha256Hex(Buffer.from(JSON.stringify(verdictPayload, Object.keys(verdictPayload).sort()), "utf8"));
const out = {
  bundle_hash: bundleHash,
  verdict_id: "VFXV1:" + bundleHash + ":sha256:" + verdictHash
};

fs.mkdirSync(args.out, { recursive: true });
fs.writeFileSync(path.join(args.out, "verdict.json"), JSON.stringify(out, null, 2) + "\n");
