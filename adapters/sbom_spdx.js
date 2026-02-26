"use strict";

const {
  die,
  ensureObject,
  ensureString,
  ensureArray,
  canonicalHash,
  uniqSorted,
} = require("./_util");

function normalize(spdx) {
  ensureObject(spdx, "spdx");
  // SPDX 2.x commonly has spdxVersion + SPDXID + name + packages[]
  const spdxVersion = spdx.spdxVersion || spdx.SPDXVersion;
  if (typeof spdxVersion !== "string" || !spdxVersion.startsWith("SPDX-")) die("E_SCHEMA", "spdxVersion: expected SPDX-*");

  const doc = {
    kind: "sbom.spdx",
    spdx_version: String(spdxVersion),
    document_namespace: typeof spdx.documentNamespace === "string" ? spdx.documentNamespace : "",
    name: typeof spdx.name === "string" ? spdx.name : "",
    creation_info: (() => {
      const ci = spdx.creationInfo && typeof spdx.creationInfo === "object" ? spdx.creationInfo : {};
      const creators = Array.isArray(ci.creators) ? ci.creators.filter((x) => typeof x === "string") : [];
      const created = typeof ci.created === "string" ? ci.created : "";
      return { created, creators: uniqSorted(creators) };
    })(),
    packages: (() => {
      const pkgs = Array.isArray(spdx.packages) ? spdx.packages : [];
      return pkgs.map((p) => {
        ensureObject(p, "packages[]");
        const name = typeof p.name === "string" ? p.name : "";
        const spdxid = typeof p.SPDXID === "string" ? p.SPDXID : "";
        const version = typeof p.versionInfo === "string" ? p.versionInfo : "";
        const supplier = typeof p.supplier === "string" ? p.supplier : "";
        const download = typeof p.downloadLocation === "string" ? p.downloadLocation : "";
        const checksums = (() => {
          const cs = Array.isArray(p.checksums) ? p.checksums : [];
          const out = [];
          for (const c of cs) {
            if (!c || typeof c !== "object") continue;
            const alg = typeof c.algorithm === "string" ? c.algorithm : "";
            const val = typeof c.checksumValue === "string" ? c.checksumValue : "";
            if (alg && val) out.push(`${alg}:${val}`);
          }
          return uniqSorted(out);
        })();
        const externalRefs = (() => {
          const er = Array.isArray(p.externalRefs) ? p.externalRefs : [];
          const out = [];
          for (const r of er) {
            if (!r || typeof r !== "object") continue;
            const type = typeof r.referenceType === "string" ? r.referenceType : "";
            const loc = typeof r.referenceLocator === "string" ? r.referenceLocator : "";
            if (type && loc) out.push(`${type}:${loc}`);
          }
          return uniqSorted(out);
        })();
        return { name, spdxid, version, supplier, download, checksums, external_refs: externalRefs };
      }).sort((a,b) => (a.name+a.spdxid).localeCompare(b.name+b.spdxid));
    })(),
  };

  const hash = canonicalHash(doc);
  return { normalized: doc, hash };
}

module.exports = { normalize };
