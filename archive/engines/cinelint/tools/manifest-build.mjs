import fs from "fs";
import path from "path";
import crypto from "crypto";

function sha256(buf){ return crypto.createHash("sha256").update(buf).digest("hex"); }
function sha256File(p){ return sha256(fs.readFileSync(p)); }
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

const dir = process.argv[2];
const out = process.argv[3] || "manifest.json";
const base = process.argv[4] || dir; // base path to express "dir" relative to
if(!dir){ console.error("usage: node tools/manifest-build.mjs <dir> [out.json] [base]"); process.exit(2); }

function walk(d){
  const res = [];
  for(const name of fs.readdirSync(d)){
    const p = path.join(d,name);
    const st = fs.statSync(p);
    if(st.isDirectory()) res.push(...walk(p));
    else res.push(p);
  }
  return res;
}

const files = walk(dir).sort();
const entries = files.map(p => ({ path: path.relative(dir,p), sha256: sha256File(p) }));
const list_hash = sha256(Buffer.from(JSON.stringify(entries)));
const root = merkleRoot(entries.map(e => e.sha256));

const relDir = path.relative(base, dir) || ".";
fs.writeFileSync(out, JSON.stringify({ dir: relDir, list_hash, merkle_root: root, entries }, null, 2));
console.log(JSON.stringify({ list_hash, merkle_root: root }));

