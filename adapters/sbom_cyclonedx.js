"use strict";

const { die, ensureObject, canonicalHash, uniqSorted } = require("./_util");

function normalize(cdx) {
  ensureObject(cdx, "cyclonedx");
  const specVersion = cdx.specVersion;
  if (typeof specVersion !== "string") die("E_SCHEMA", "specVersion: required string");

  const metadata = cdx.metadata && typeof cdx.metadata === "object" ? cdx.metadata : {};
  const components = Array.isArray(cdx.components) ? cdx.components : [];

  const doc = {
    kind: "sbom.cyclonedx",
    spec_version: specVersion,
    serial_number: typeof cdx.serialNumber === "string" ? cdx.serialNumber : "",
    metadata: {
      timestamp: typeof metadata.timestamp === "string" ? metadata.timestamp : "",
      tools: (() => {
        const tools = metadata.tools;
        const arr = Array.isArray(tools) ? tools : (tools && typeof tools === "object" && Array.isArray(tools.components) ? tools.components : []);
        const out = [];
        for (const t of arr) {
          if (!t || typeof t !== "object") continue;
          const name = typeof t.name === "string" ? t.name : "";
          const version = typeof t.version === "string" ? t.version : "";
          if (name) out.push(version ? `${name}@${version}` : name);
        }
        return uniqSorted(out);
      })(),
    },
    components: components.map((c) => {
      if (!c || typeof c !== "object") die("E_SCHEMA", "components[]: required object");
      const type = typeof c.type === "string" ? c.type : "";
      const name = typeof c.name === "string" ? c.name : "";
      const version = typeof c.version === "string" ? c.version : "";
      const purl = typeof c.purl === "string" ? c.purl : "";
      const bomRef = typeof c["bom-ref"] === "string" ? c["bom-ref"] : "";
      const hashes = (() => {
        const hs = Array.isArray(c.hashes) ? c.hashes : [];
        const out = [];
        for (const h of hs) {
          if (!h || typeof h !== "object") continue;
          const alg = typeof h.alg === "string" ? h.alg : "";
          const content = typeof h.content === "string" ? h.content : "";
          if (alg && content) out.push(`${alg}:${content}`);
        }
        return uniqSorted(out);
      })();
      return { type, name, version, purl, bom_ref: bomRef, hashes };
    }).sort((a,b) => (a.purl||a.name).localeCompare(b.purl||b.name)),
  };

  const hash = canonicalHash(doc);
  return { normalized: doc, hash };
}

module.exports = { normalize };
