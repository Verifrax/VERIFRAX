"use strict";

const { die, ensureObject, canonicalHash, uniqSorted } = require("./_util");

function normalize(p) {
  ensureObject(p, "provenance");

  // Accept SLSA provenance v1 in DSSE / in-toto-ish envelopes.
  // We normalize into stable fields only (no policy yet).
  const predicateType =
    (p.predicateType && typeof p.predicateType === "string" ? p.predicateType : "") ||
    (p.predicate && p.predicate.predicateType && typeof p.predicate.predicateType === "string" ? p.predicate.predicateType : "");

  const subject = Array.isArray(p.subject) ? p.subject : (p.payload && typeof p.payload === "object" && Array.isArray(p.payload.subject) ? p.payload.subject : []);
  const subjects = subject.map((s) => {
    if (!s || typeof s !== "object") return null;
    const name = typeof s.name === "string" ? s.name : "";
    const dig = s.digest && typeof s.digest === "object" ? s.digest : {};
    const digests = Object.keys(dig).sort().map((k) => `${k}:${String(dig[k])}`);
    return { name, digests };
  }).filter(Boolean).sort((a,b)=> (a.name).localeCompare(b.name));

  const builder = (() => {
    const b =
      (p.predicate && p.predicate.builder && typeof p.predicate.builder === "object" ? p.predicate.builder : null) ||
      (p.builder && typeof p.builder === "object" ? p.builder : null);
    if (!b) return { id: "" };
    return { id: typeof b.id === "string" ? b.id : "" };
  })();

  const invocation = (() => {
    const inv = p.predicate && typeof p.predicate === "object" ? p.predicate.invocation : null;
    if (!inv || typeof inv !== "object") return { config_source: { uri: "" }, parameters_hash: "" };
    const cs = inv.configSource && typeof inv.configSource === "object" ? inv.configSource : {};
    const uri = typeof cs.uri === "string" ? cs.uri : "";
    const params = inv.parameters && typeof inv.parameters === "object" ? inv.parameters : null;
    const parameters_hash = params ? canonicalHash(params) : "";
    return { config_source: { uri }, parameters_hash };
  })();

  const doc = {
    kind: "provenance.slsa",
    predicate_type: predicateType,
    builder,
    invocation,
    subjects,
    metadata: (() => {
      const m = p.predicate && p.predicate.metadata && typeof p.predicate.metadata === "object" ? p.predicate.metadata : {};
      const build_started = typeof m.buildStartedOn === "string" ? m.buildStartedOn : "";
      const build_finished = typeof m.buildFinishedOn === "string" ? m.buildFinishedOn : "";
      return { build_started, build_finished };
    })(),
    materials: (() => {
      const mats = p.predicate && Array.isArray(p.predicate.materials) ? p.predicate.materials : [];
      const out = [];
      for (const m of mats) {
        if (!m || typeof m !== "object") continue;
        const uri = typeof m.uri === "string" ? m.uri : "";
        const dig = m.digest && typeof m.digest === "object" ? m.digest : {};
        const digests = Object.keys(dig).sort().map((k) => `${k}:${String(dig[k])}`);
        if (uri) out.push({ uri, digests });
      }
      return out.sort((a,b)=>a.uri.localeCompare(b.uri));
    })(),
  };

  const hash = canonicalHash(doc);
  return { normalized: doc, hash };
}

module.exports = { normalize };
