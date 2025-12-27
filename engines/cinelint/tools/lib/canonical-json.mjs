export function canonicalStringify(value) {
  return JSON.stringify(sortRec(value));
}

function sortRec(v) {
  if (v === null) return null;
  if (Array.isArray(v)) return v.map(sortRec);
  if (typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = sortRec(v[k]);
    return out;
  }
  return v;
}

