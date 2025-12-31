> **NON-AUTHORITATIVE — EXPLANATION ONLY**  
> This document is for educational purposes. Authoritative specifications are in `freeze/v2.4.0/` and at `verifrax.net/spec`.

# How to Reimplement VERIFRAX

**Version:** 2.4.0  
**Status:** CANDIDATE  
**Purpose:** Complete specification for reimplementing VERIFRAX from scratch. This document makes VERIFRAX disappear by design.

---

## Core Principle

**VERIFRAX is an algorithm, not a service.**

Anyone can reimplement VERIFRAX using only:
- This specification
- Standard cryptographic primitives (SHA-256)
- Deterministic algorithms (no randomness, no secrets)

**No VERIFRAX code required. No VERIFRAX infrastructure required.**

---

## Algorithm Overview

VERIFRAX performs three operations:

1. **Bundle Hashing** - Compute deterministic hash of evidence bundle
2. **Verification** - Execute deterministic verification against profile
3. **Certificate Issuance** - Generate immutable certificate with cryptographic proof

---

## 1. Canonical Stringify

### Purpose

Convert JSON objects to deterministic string representation. Same object structure → same string, regardless of key insertion order.

### Algorithm

```
function canonicalStringify(obj):
  if obj is null:
    return "null"
  
  if obj is array:
    elements = map(canonicalStringify, obj)
    return "[" + join(elements, ",") + "]"
  
  if obj is object:
    keys = sort(Object.keys(obj))
    pairs = map(key => '"' + key + '":' + canonicalStringify(obj[key]), keys)
    return "{" + join(pairs, ",") + "}"
  
  if obj is primitive:
    return JSON.stringify(obj)
```

### Implementation Notes

- **Arrays:** Process each element recursively, join with commas (no spaces)
- **Objects:** Sort keys alphabetically, process each value recursively, join with commas (no spaces)
- **Primitives:** Use standard JSON.stringify (strings, numbers, booleans)
- **Null:** Explicitly return "null" (not undefined)

### Example

```javascript
Input: { "b": 2, "a": 1, "c": [3, 1] }
Output: {"a":1,"b":2,"c":[3,1]}
```

**Key order does not matter. Output is always the same.**

---

## 2. Hash Rules

### SHA-256 Hash Computation

**Algorithm:** Standard SHA-256 (FIPS 180-4)

**Format:** `sha256:<64-hex-characters>`

### Hash Computation Steps

1. **Input:** String or binary data
2. **Process:** SHA-256 hash function
3. **Output:** Hexadecimal string (64 characters, lowercase)
4. **Prefix:** Add "sha256:" prefix

### Implementation

```javascript
function sha256(data):
  hash = SHA256(data)  // Standard SHA-256
  hex = toHex(hash)    // 64 lowercase hex characters
  return "sha256:" + hex
```

### Bundle Hash

**Input:** Binary file (`bundle.bin`)

**Process:**
1. Read entire file as binary
2. Compute SHA-256 hash
3. Format as `sha256:<hex>`

**Output:** `sha256:ba18a51f06af90c110924fc4e87a64dba5127bc092a582b33a2f1b844835413b`

### Version Hash

**Input:** Verifier version string (e.g., "2.4.0")

**Process:**
1. Convert version string to UTF-8 bytes
2. Compute SHA-256 hash
3. Format as `sha256:<hex>`

**Output:** `sha256:40f334a825d2bbcb5d7bde863843250f1331e0cab30d22d6bda33e22aec2ca96`

### Certificate Hash

**Input:** Canonical string representation of certificate object

**Process:**
1. Build certificate object (without `certificate_hash` field)
2. Canonical-stringify the object
3. Compute SHA-256 hash of canonical string
4. Format as `sha256:<hex>`

**Output:** `sha256:0bb6c5af433595b665d57e4120975713a6d41db7d0f7e9d04d1438c0a29c3f8e`

---

## 3. Certificate Schema

### Certificate Object Structure

```json
{
  "upload_id": "uuid-v4",
  "bundle_hash": "sha256:<64-hex>",
  "profile_id": "public@1.0.0",
  "verifier_version": "2.4.0",
  "version_hash": "sha256:<64-hex>",
  "verdict": "verified" | "not_verified",
  "reason_codes": [],
  "verdict_hash": "sha256:<64-hex>",
  "executed_at": "ISO8601",
  "finality_statement": "Execution of this verification constitutes delivery acceptance. Upon issuance, the associated dispute space is closed.",
  "certificate_hash": "sha256:<64-hex>"
}
```

### Field Descriptions

- **upload_id:** Unique identifier for the upload (UUID v4)
- **bundle_hash:** SHA-256 hash of the evidence bundle
- **profile_id:** Verification profile identifier (e.g., "public@1.0.0")
- **verifier_version:** Verifier version string (e.g., "2.4.0")
- **version_hash:** SHA-256 hash of verifier version string
- **verdict:** Verification result ("verified" or "not_verified")
- **reason_codes:** Array of reason codes (empty if verified)
- **verdict_hash:** SHA-256 hash of canonical verdict object
- **executed_at:** ISO8601 timestamp of execution
- **finality_statement:** Finality declaration (fixed string)
- **certificate_hash:** SHA-256 hash of certificate object (excluding this field)

### Certificate Hash Computation

**Critical:** Certificate hash is computed from certificate object **without** the `certificate_hash` field.

**Steps:**
1. Build certificate object with all fields except `certificate_hash`
2. Canonical-stringify the object
3. Compute SHA-256 hash
4. Add `certificate_hash` field with computed hash

---

## 4. Verification Steps

### Inputs

- **bundle.bin:** Evidence bundle (binary file)
- **certificate.json:** VERIFRAX certificate (JSON file)
- **profile_id:** Profile identifier (e.g., "public@1.0.0")

### Algorithm

```
1. Load certificate.json
   - Parse JSON
   - Validate structure (must have certificate_hash field)
   - Extract expected certificate_hash

2. Recompute bundle_hash
   - Read bundle.bin as binary
   - Compute SHA-256 hash
   - Format as "sha256:<hex>"
   - Compare with certificate.bundle_hash
   - If mismatch → INVALID (BUNDLE_HASH_MISMATCH)

3. Rebuild certificate object (without certificate_hash)
   - upload_id: certificate.upload_id
   - bundle_hash: certificate.bundle_hash
   - profile_id: certificate.profile_id
   - verifier_version: certificate.verifier_version
   - version_hash: certificate.version_hash
   - verdict: certificate.verdict
   - reason_codes: certificate.reason_codes
   - verdict_hash: certificate.verdict_hash
   - executed_at: certificate.executed_at
   - finality_statement: certificate.finality_statement

4. Canonical-stringify certificate object
   - Use canonical stringify algorithm
   - Result: deterministic string representation

5. Recompute certificate_hash
   - Compute SHA-256 hash of canonical string
   - Format as "sha256:<hex>"

6. Compare hashes
   - If computed_hash == expected_hash → VALID
   - If computed_hash != expected_hash → INVALID (CERTIFICATE_HASH_MISMATCH)
```

### Output

**Valid Certificate:**
```json
{
  "status": "VALID",
  "certificate_hash": "sha256:...",
  "verifier_version": "2.4.0",
  "bundle_hash": "sha256:..."
}
```

**Invalid Certificate:**
```json
{
  "status": "INVALID",
  "reason": "CERTIFICATE_HASH_MISMATCH",
  "message": "..."
}
```

---

## 5. Implementation Requirements

### Determinism

- **No randomness:** Same inputs → same outputs
- **No time-dependent logic:** Timestamps are metadata only
- **No network calls:** All operations are local
- **No mutable state:** No side effects

### Cryptographic Primitives

- **SHA-256:** Standard FIPS 180-4 implementation
- **No secret keys:** All operations use public algorithms
- **No signatures:** Hash-based integrity only

### Language Independence

This specification can be implemented in:
- JavaScript/Node.js
- Python
- Rust
- Go
- C/C++
- Any language with SHA-256 support

### Reference Implementation

See `verifrax-reference-verifier/` for complete reference implementation in Node.js.

---

## 6. Verification Profile

### Profile Structure

```json
{
  "profile_id": "public@1.0.0",
  "profile_name": "public",
  "version": "1.0.0",
  "description": "Public profile - minimal requirements",
  "required_evidence_classes": [],
  "allowed_trust_assumptions": [
    "Self-signed certificates acceptable",
    "Minimal attestation requirements"
  ]
}
```

### Profile Usage

- Profile defines verification rules
- Profile is referenced by `profile_id` in certificate
- Profile does not affect certificate hash computation
- Profile is separate from certificate structure

---

## 7. Complete Reimplementation Checklist

### Core Functions

- [ ] Implement `canonicalStringify(obj)` - Deterministic JSON serialization
- [ ] Implement `sha256(data)` - SHA-256 hash computation
- [ ] Implement `sha256File(path)` - File hash computation
- [ ] Implement `verifyCertificate(options)` - Certificate verification

### Certificate Operations

- [ ] Load and parse certificate JSON
- [ ] Recompute bundle hash from bundle.bin
- [ ] Rebuild certificate object (without certificate_hash)
- [ ] Canonical-stringify certificate object
- [ ] Recompute certificate hash
- [ ] Compare hashes and return result

### Validation

- [ ] Validate certificate structure
- [ ] Validate bundle hash matches
- [ ] Validate certificate hash matches
- [ ] Return appropriate error codes

### Testing

- [ ] Test with known valid certificate
- [ ] Test with known invalid certificate
- [ ] Test with modified certificate
- [ ] Test with modified bundle
- [ ] Verify deterministic output

---

## 8. Example Implementation

### Python

```python
import hashlib
import json
from typing import Any, Dict

def canonical_stringify(obj: Any) -> str:
    if obj is None:
        return "null"
    if isinstance(obj, list):
        elements = [canonical_stringify(e) for e in obj]
        return "[" + ",".join(elements) + "]"
    if isinstance(obj, dict):
        keys = sorted(obj.keys())
        pairs = [f'"{k}":{canonical_stringify(obj[k])}' for k in keys]
        return "{" + ",".join(pairs) + "}"
    return json.dumps(obj)

def sha256(data: bytes) -> str:
    hash_obj = hashlib.sha256(data)
    return "sha256:" + hash_obj.hexdigest()

def verify_certificate(bundle_path: str, certificate_path: str, profile_id: str) -> Dict:
    # Load certificate
    with open(certificate_path, 'r') as f:
        certificate = json.load(f)
    
    # Recompute bundle hash
    with open(bundle_path, 'rb') as f:
        bundle_data = f.read()
    computed_bundle_hash = sha256(bundle_data)
    
    # Rebuild certificate object
    cert_obj = {
        "upload_id": certificate["upload_id"],
        "bundle_hash": certificate["bundle_hash"],
        "profile_id": certificate["profile_id"],
        "verifier_version": certificate["verifier_version"],
        "version_hash": certificate["version_hash"],
        "verdict": certificate["verdict"],
        "reason_codes": certificate["reason_codes"],
        "verdict_hash": certificate["verdict_hash"],
        "executed_at": certificate["executed_at"],
        "finality_statement": certificate["finality_statement"]
    }
    
    # Canonical stringify and hash
    canonical = canonical_stringify(cert_obj)
    computed_cert_hash = sha256(canonical.encode('utf-8'))
    
    # Compare
    if computed_cert_hash == certificate["certificate_hash"]:
        return {"status": "VALID", "certificate_hash": computed_cert_hash}
    else:
        return {"status": "INVALID", "reason": "CERTIFICATE_HASH_MISMATCH"}
```

---

## 9. Authority Transfer

**This document transfers all authority from VERIFRAX to the algorithm.**

After this document:
- VERIFRAX is no longer required
- Anyone can verify certificates
- Anyone can issue certificates (if they follow the algorithm)
- VERIFRAX becomes optional infrastructure

**VERIFRAX disappears by design.**

---

## Version

**v2.4.0** (candidate, pending freeze)

This specification applies to VERIFRAX Worker v2.4.0 and certificates issued by it.

---

## See Also

- `verifrax-reference-verifier/` - Reference implementation
- `product/delivery/DELIVERY_CERTIFICATE_SPEC.md` - Certificate specification
- `freeze/v2.3.0/REFERENCE_VERIFIER.md` - Frozen verifier documentation (v2.3.0)

