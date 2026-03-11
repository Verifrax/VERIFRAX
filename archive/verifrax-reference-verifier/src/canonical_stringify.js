/**
 * Canonical JSON Stringify
 * 
 * CRITICAL: This function deterministically serializes objects and arrays
 * by sorting object keys and recursively processing nested structures.
 * 
 * This implementation is derived from the VERIFRAX specification, not copied
 * from Worker code. It proves determinism, not code similarity.
 * 
 * Algorithm:
 * 1. Arrays: Process each element recursively, join with commas
 * 2. Objects: Sort keys, process each value recursively, join with commas
 * 3. Primitives: Use JSON.stringify
 * 
 * This ensures that the same object structure always produces the same
 * string representation, regardless of key insertion order.
 */

function canonicalStringify(obj) {
  // Handle null
  if (obj === null) {
    return 'null';
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const elements = obj.map(canonicalStringify);
    return `[${elements.join(',')}]`;
  }

  // Handle objects
  if (obj && typeof obj === 'object') {
    const keys = Object.keys(obj).sort();
    const pairs = keys.map(key => {
      const value = canonicalStringify(obj[key]);
      return `"${key}":${value}`;
    });
    return `{${pairs.join(',')}}`;
  }

  // Handle primitives (string, number, boolean)
  return JSON.stringify(obj);
}

module.exports = { canonicalStringify };

