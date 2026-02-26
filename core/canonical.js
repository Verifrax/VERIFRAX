"use strict";
const crypto = require("crypto");

function die(code, msg) {
  const e = new Error(msg);
  e.code = code;
  throw e;
}

function isPlainObject(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function stableStringify(value) {
  const seen = new WeakSet();
  function walk(v) {
    if (v === null) return null;
    const t = typeof v;
    if (t === "string" || t === "number" || t === "boolean") return v;
    if (Array.isArray(v)) return v.map(walk);
    if (!isPlainObject(v)) die("E_SCHEMA", "non-plain-object in canonicalization");
    if (seen.has(v)) die("E_SCHEMA", "cycle in object");
    seen.add(v);
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = walk(v[k]);
    return out;
  }
  return JSON.stringify(walk(value));
}

function sha256Hex(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function canonicalHash(obj) {
  return sha256Hex(stableStringify(obj));
}

function sortUniq(arr) {
  return Array.from(new Set(arr)).sort();
}

function sortByKey(arr, key) {
  return arr.slice().sort((a,b)=>String(a?.[key]||"").localeCompare(String(b?.[key]||"")));
}

module.exports = { die, stableStringify, sha256Hex, canonicalHash, sortUniq, sortByKey };
