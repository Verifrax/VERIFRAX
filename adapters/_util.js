"use strict";

const crypto = require("crypto");
const fs = require("fs");

function die(code, msg) {
  const e = new Error(msg);
  e.code = code;
  throw e;
}

function readJsonFile(p) {
  const raw = fs.readFileSync(p, "utf8");
  return parseJson(raw, p);
}

function parseJson(raw, label = "input") {
  try {
    const v = JSON.parse(raw);
    if (v === null || typeof v !== "object") die("E_MALFORMED_JSON", `${label}: not an object`);
    return v;
  } catch (e) {
    die("E_MALFORMED_JSON", `${label}: invalid JSON`);
  }
}

function stableStringify(x) {
  // deterministic JSON (RFC-8785-ish subset): sort object keys, arrays kept in current order (caller sorts arrays if needed)
  const seen = new WeakSet();
  const rec = (v) => {
    if (v === null) return "null";
    const t = typeof v;
    if (t === "number") return Number.isFinite(v) ? String(v) : die("E_CANON", "non-finite number");
    if (t === "boolean") return v ? "true" : "false";
    if (t === "string") return JSON.stringify(v);
    if (t !== "object") die("E_CANON", `unsupported type: ${t}`);
    if (seen.has(v)) die("E_CANON", "cycle detected");
    seen.add(v);
    if (Array.isArray(v)) {
      return "[" + v.map(rec).join(",") + "]";
    }
    const keys = Object.keys(v).sort();
    return "{" + keys.map((k) => JSON.stringify(k) + ":" + rec(v[k])).join(",") + "}";
  };
  return rec(x);
}

function sha256Hex(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function canonicalHash(obj) {
  return sha256Hex(stableStringify(obj));
}

function ensureString(v, name) {
  if (typeof v !== "string" || v.trim() === "") die("E_SCHEMA", `${name}: required string`);
  return v;
}

function ensureObject(v, name) {
  if (!v || typeof v !== "object" || Array.isArray(v)) die("E_SCHEMA", `${name}: required object`);
  return v;
}

function ensureArray(v, name) {
  if (!Array.isArray(v)) die("E_SCHEMA", `${name}: required array`);
  return v;
}

function uniqSorted(arr) {
  return Array.from(new Set(arr)).sort();
}

module.exports = {
  die,
  readJsonFile,
  parseJson,
  stableStringify,
  sha256Hex,
  canonicalHash,
  ensureString,
  ensureObject,
  ensureArray,
  uniqSorted,
};
