"use strict";
const { die, canonicalHash, sortUniq } = require("./canonical");

function ensureArray(v, name) {
  if (!Array.isArray(v)) die("E_SCHEMA", `${name}: required array`);
  return v;
}

function ensureBool(v, name) {
  if (typeof v !== "boolean") die("E_SCHEMA", `${name}: required boolean`);
  return v;
}

function ensureString(v, name) {
  if (typeof v !== "string") die("E_SCHEMA", `${name}: required string`);
  return v;
}

function normalizeVulns(vulns) {
  const arr = Array.isArray(vulns) ? vulns : [];
  const out = [];
  for (const it of arr) {
    if (!it || typeof it !== "object") continue;
    const id = typeof it.id === "string" ? it.id : (typeof it.cve === "string" ? it.cve : "");
    const severity = typeof it.severity === "string" ? it.severity.toUpperCase() : "";
    const score = (typeof it.score === "number") ? it.score : null;
    const source = typeof it.source === "string" ? it.source : "";
    if (!id && !severity && score === null && !source) continue;
    out.push({ id, severity, score, source });
  }
  out.sort((a,b)=>(a.id+a.severity).localeCompare(b.id+b.severity));
  return out;
}

function normalizeDeps(deps) {
  const arr = Array.isArray(deps) ? deps : [];
  const out = [];
  for (const d of arr) {
    if (typeof d === "string") { out.push(d); continue; }
    if (!d || typeof d !== "object") continue;
    const purl = typeof d.purl === "string" ? d.purl : "";
    const name = typeof d.name === "string" ? d.name : "";
    const version = typeof d.version === "string" ? d.version : "";
    const key = purl || (name ? `${name}@${version}` : "");
    if (key) out.push(key);
  }
  return sortUniq(out);
}

function buildEvaluationSurface(input) {
  if (!input || typeof input !== "object") die("E_SCHEMA", "surface: required object");

  const artifact_hash = ensureString(input.artifact_hash, "artifact_hash");
  const builder_id = typeof input.builder_id === "string" ? input.builder_id : "";
  const source_uri = typeof input.source_uri === "string" ? input.source_uri : "";

  const dependencies = normalizeDeps(input.dependencies || []);
  const vulnerabilities = normalizeVulns(input.vulnerabilities || []);

  const signature_valid = ensureBool(input.signature_valid, "signature_valid");
  const provenance_valid = ensureBool(input.provenance_valid, "provenance_valid");

  const metadata_hash = typeof input.metadata_hash === "string" ? input.metadata_hash : "";

  const surface = {
    artifact_hash,
    builder_id,
    source_uri,
    dependencies,
    vulnerabilities,
    signature_valid,
    provenance_valid,
    metadata_hash,
  };

  const evaluation_hash = canonicalHash(surface);
  return { surface, evaluation_hash };
}

module.exports = { buildEvaluationSurface };
