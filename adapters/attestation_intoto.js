"use strict";

const { die, ensureObject, canonicalHash, uniqSorted } = require("./_util");

function normalize(a) {
  ensureObject(a, "attestation");

  // Accept either an in-toto Statement (v1) or DSSE envelope containing it.
  const statement = (() => {
    if (a._type === "https://in-toto.io/Statement/v1" || a.type === "https://in-toto.io/Statement/v1") return a;
    // DSSE envelope commonly has payloadType + payload (base64)
    if (typeof a.payload === "string") {
      try {
        const raw = Buffer.from(a.payload, "base64").toString("utf8");
        const s = JSON.parse(raw);
        if (s && typeof s === "object") return s;
      } catch {}
    }
    return null;
  })();

  if (!statement || typeof statement !== "object") die("E_SCHEMA", "in-toto: unsupported envelope/statement");

  const stType = typeof statement._type === "string" ? statement._type : (typeof statement.type === "string" ? statement.type : "");
  if (!stType.includes("in-toto.io/Statement")) die("E_SCHEMA", "in-toto: missing statement type");

  const predicateType = typeof statement.predicateType === "string" ? statement.predicateType : "";
  const subject = Array.isArray(statement.subject) ? statement.subject : [];
  const subjects = subject.map((s) => {
    if (!s || typeof s !== "object") return null;
    const name = typeof s.name === "string" ? s.name : "";
    const dig = s.digest && typeof s.digest === "object" ? s.digest : {};
    const digests = Object.keys(dig).sort().map((k) => `${k}:${String(dig[k])}`);
    return { name, digests };
  }).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name));

  const predicate = (statement.predicate && typeof statement.predicate === "object") ? statement.predicate : {};
  const predicate_hash = canonicalHash(predicate);

  const doc = {
    kind: "attestation.intoto",
    statement_type: stType,
    predicate_type: predicateType,
    subjects,
    predicate_hash,
  };

  const hash = canonicalHash(doc);
  return { normalized: doc, hash };
}

module.exports = { normalize };
