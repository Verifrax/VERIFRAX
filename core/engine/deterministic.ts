/**
 * Deterministic Execution Normalizers
 * 
 * Ensures hash-stable outputs across machines for delivery_v1 profile
 */

/**
 * Canonical JSON serialization (deterministic key ordering)
 */
export function canonicalStringify(obj: any): string {
  return JSON.stringify(sortRec(obj));
}

function sortRec(v: any): any {
  if (v === null) return null;
  if (Array.isArray(v)) return v.map(sortRec);
  if (typeof v === 'object') {
    const out: any = {};
    for (const k of Object.keys(v).sort()) {
      out[k] = sortRec(v[k]);
    }
    return out;
  }
  return v;
}

/**
 * Stable sort array by a key function
 */
export function stableSort<T>(array: T[], keyFn: (item: T) => string): T[] {
  return array.slice().sort((a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);
    return keyA.localeCompare(keyB);
  });
}

/**
 * Normalize metadata to fixed values (remove timestamps, random IDs)
 * For delivery_v1 profile, metadata must be fixed
 */
export function normalizeMetadata(metadata: any): any {
  const normalized: any = {};
  
  // Copy only fixed fields (no timestamps, no random values)
  const fixedFields = ['profile_id', 'bundle_version', 'engine_version'];
  for (const field of fixedFields) {
    if (field in metadata) {
      normalized[field] = metadata[field];
    }
  }
  
  return normalized;
}

/**
 * Ensure file paths are normalized (forward slashes, no . or ..)
 */
export function normalizePath(filePath: string): string {
  return filePath
    .replace(/\\/g, '/')
    .replace(/\/\.\//g, '/')
    .replace(/\/[^/]+\/\.\.\//g, '/')
    .replace(/^\.\//, '')
    .replace(/\/$/, '');
}

