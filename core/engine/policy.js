"use strict";
const { die, canonicalHash, stableStringify } = require("../canonical");
const yaml = require("js-yaml");

const OPS = new Set(["eq","ne","in","nin","contains","not_contains","any","all","gt","gte","lt","lte","exists","not_exists"]);

function loadPolicy(textOrObj) {
  let obj = textOrObj;
  if (typeof textOrObj === "string") {
    try { obj = yaml.load(textOrObj, { schema: yaml.FAILSAFE_SCHEMA }); }
    catch (e) { die("E_POLICY_PARSE", "policy: invalid YAML"); }
  }
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) die("E_POLICY_SCHEMA", "policy: required object");
  const version = typeof obj.version === "string" ? obj.version : "v1";
  const rules = Array.isArray(obj.rules) ? obj.rules : null;
  if (!rules) die("E_POLICY_SCHEMA", "policy.rules: required array");
  const normalizedRules = rules.map((r, i) => normalizeRule(r, i));
  const normalized = { version, rules: normalizedRules };
  const policy_hash = canonicalHash(normalized);
  return { policy: normalized, policy_hash };
}

function normalizeRule(r, i) {
  if (!r || typeof r !== "object" || Array.isArray(r)) die("E_POLICY_SCHEMA", `policy.rules[${i}]: required object`);
  const id = typeof r.id === "string" ? r.id : `R${String(i+1).padStart(3,"0")}`;
  const level = typeof r.level === "string" ? r.level.toLowerCase() : "fail"; // fail|warn
  if (level !== "fail" && level !== "warn") die("E_POLICY_SCHEMA", `policy.rules[${i}].level: invalid`);
  const require = Array.isArray(r.require) ? r.require : null;
  if (!require || require.length === 0) die("E_POLICY_SCHEMA", `policy.rules[${i}].require: required non-empty array`);
  const clauses = require.map((c, j) => normalizeClause(c, i, j));
  return { id, level, require: clauses };
}

function normalizeClause(c, i, j) {
  if (!c || typeof c !== "object" || Array.isArray(c)) die("E_POLICY_SCHEMA", `policy.rules[${i}].require[${j}]: required object`);
  const path = typeof c.path === "string" ? c.path : "";
  const op = typeof c.op === "string" ? c.op : "";
  if (!path) die("E_POLICY_SCHEMA", `policy.rules[${i}].require[${j}].path: required`);
  if (!OPS.has(op)) die("E_POLICY_SCHEMA", `policy.rules[${i}].require[${j}].op: invalid`);
  const value = Object.prototype.hasOwnProperty.call(c, "value") ? c.value : null;
  // ops requiring value
  const needsValue = !["exists","not_exists"].includes(op);
  if (needsValue && value === null) die("E_POLICY_SCHEMA", `policy.rules[${i}].require[${j}].value: required`);
  return { path, op, value: needsValue ? value : null };
}

function getPath(obj, path) {
  const parts = path.split(".").filter(Boolean);
  let cur = obj;
  for (const p of parts) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}

function evalClause(surface, clause) {
  const v = getPath(surface, clause.path);
  const op = clause.op;
  const val = clause.value;

  if (op === "exists") return v !== undefined;
  if (op === "not_exists") return v === undefined;

  if (op === "eq") return v === val;
  if (op === "ne") return v !== val;

  if (op === "in") {
    if (!Array.isArray(val)) die("E_POLICY_SCHEMA", "clause.value for 'in' must be array");
    return val.includes(v);
  }
  if (op === "nin") {
    if (!Array.isArray(val)) die("E_POLICY_SCHEMA", "clause.value for 'nin' must be array");
    return !val.includes(v);
  }

  if (op === "contains") {
    if (!Array.isArray(v)) return false;
    return v.includes(val);
  }
  if (op === "not_contains") {
    if (!Array.isArray(v)) return true;
    return !v.includes(val);
  }

  if (op === "gt" || op === "gte" || op === "lt" || op === "lte") {
    if (typeof v !== "number" || typeof val !== "number") return false;
    if (op === "gt") return v > val;
    if (op === "gte") return v >= val;
    if (op === "lt") return v < val;
    return v <= val;
  }

  if (op === "any" || op === "all") {
    if (!Array.isArray(v)) return false;
    if (!val || typeof val !== "object") die("E_POLICY_SCHEMA", "clause.value for 'any/all' must be object");
    const sub = normalizeClause(val, 0, 0); // reuse validation shape
    const fn = (item) => evalClause(item, sub);
    return op === "any" ? v.some(fn) : v.every(fn);
  }

  return false;
}

function evaluate(surface, policyObj) {
  if (!surface || typeof surface !== "object" || Array.isArray(surface)) die("E_SCHEMA", "surface: required object");
  const loaded = loadPolicy(policyObj);
  const failures = [];
  let worst = "pass";

  for (const r of loaded.policy.rules) {
    const clauseFailures = [];
    for (const c of r.require) {
      const ok = evalClause(surface, c);
      if (!ok) clauseFailures.push({ path: c.path, op: c.op, value: c.value });
    }
    if (clauseFailures.length) {
      failures.push({ rule_id: r.id, level: r.level, failures: clauseFailures });
      if (r.level === "fail") worst = "fail";
      else if (worst !== "fail") worst = "warn";
    }
  }

  const result = {
    decision: worst,
    rule_failures: failures,
    policy_hash: loaded.policy_hash,
    evaluation_hash: canonicalHash({
      policy_hash: loaded.policy_hash,
      surface_hash: canonicalHash(surface),
      decision: worst,
      rule_failures: failures,
    }),
  };

  // determinism guard: canonical stringify must be stable
  stableStringify(result);

  return result;
}

module.exports = { loadPolicy, evaluate };
