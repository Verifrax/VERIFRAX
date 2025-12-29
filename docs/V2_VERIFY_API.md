# VERIFRAX v2.1 Verify API Specification

**Version:** 2.1.0  
**Base URL:** `https://verifrax.net`  
**Status:** FROZEN (immutable contract)

This document defines the **v2.1 verify API contract** for VERIFRAX. This contract is frozen and must not be broken in future versions without explicit versioning.

## Endpoint: `/api/verify`

**Method:** `POST`  
**Purpose:** Execute deterministic verification on an uploaded bundle and produce a verdict artifact

### Request Headers

| Header | Required | Value | Description |
|--------|----------|-------|-------------|
| `Content-Type` | Yes | `application/json` | Request body format |

### Request Body

```json
{
  "upload_id": "uuid-v4",
  "profile_id": "public@1.0.0",
  "verifier_version": "2.0.0"
}
```

**Fields:**
- `upload_id` (required): Canonical VERIFRAX upload identifier from `/api/upload`
- `profile_id` (optional): Verification profile identifier (default: `"public@1.0.0"`)
- `verifier_version` (optional): Verifier version to use (default: `"2.0.0"`)

### Execution Semantics

**Algorithm:**
1. Resolve `uploads/{upload_id}/bundle.bin` from R2
2. Recompute bundle hash (SHA-256)
3. Assert hash === manifest hash
4. Load profile (if supported)
5. Execute verifier (pure, deterministic)
6. Emit verdict object

**Forbidden:**
- Writing to R2
- Writing to KV
- Side effects
- Network calls
- Time-based logic (except `executed_at` metadata)

### Response: Success (201 Created)

```json
{
  "upload_id": "uuid-v4",
  "bundle_hash": "sha256:64-hex-characters",
  "profile_id": "public@1.0.0",
  "verifier_version": "2.0.0",
  "verdict": "verified",
  "reason_codes": [],
  "verdict_hash": "sha256:64-hex-characters",
  "executed_at": "ISO8601"
}
```

**Fields:**
- `upload_id`: Original upload identifier
- `bundle_hash`: Computed bundle hash (must match manifest)
- `profile_id`: Profile used for verification
- `verifier_version`: Verifier version used
- `verdict`: `"verified"` or `"not_verified"`
- `reason_codes`: Array of reason codes (empty if verified)
- `verdict_hash`: SHA-256 hash of verdict object (excluding `executed_at`)
- `executed_at`: ISO8601 timestamp (metadata only, excluded from hash)

### Response: Error Codes

| Status | Code | Condition | Response Body |
|--------|------|-----------|---------------|
| 400 | Bad Request | Missing `upload_id` | `{"error": "Missing upload_id"}` |
| 404 | Not Found | Bundle or manifest not found | `{"error": "Bundle not found"}` or `{"error": "Manifest not found"}` |
| 500 | Internal Server Error | Service configuration error or execution failure | `{"error": "...", "message": "..."}` |

### Verdict Hash Computation

The `verdict_hash` is computed over the verdict object **excluding** `executed_at`:

```javascript
const verdictObject = {
  upload_id,
  bundle_hash,
  profile_id,
  verifier_version,
  verdict,
  reason_codes
};
const verdictCanonical = JSON.stringify(verdictObject, Object.keys(verdictObject).sort());
const verdictHash = sha256(verdictCanonical);
```

This ensures:
- Same inputs → same `verdict_hash`
- Timestamp does not affect hash
- Verdict is independently verifiable

### Deterministic Behavior

**Guarantees:**
- Same `upload_id` + same `profile_id` + same `verifier_version` → same `verdict_hash`
- Hash computation is deterministic (no randomness)
- No external dependencies (no network calls)
- No mutable state (no writes to storage)

### v2.1 Limitations (Documented)

1. **Minimal Verification:** Only validates bundle hash matches manifest
2. **Profile Support:** Only `public@1.0.0` supported
3. **No Bundle Analysis:** Does not unpack or analyze bundle structure
4. **No Contradiction Detection:** Does not check for claim contradictions
5. **No Invalidation Resolution:** Does not check invalidation index

These limitations are acceptable for v2.1. Future versions will add:
- Full bundle structure analysis
- Contradiction detection
- Invalidation resolution
- Extended profile support

### Security Model

- **Read-Only:** Verification does not modify storage
- **Deterministic:** No randomness or time-based logic in hash computation
- **Isolated:** No side effects or external dependencies
- **Reproducible:** Same inputs produce identical outputs

### Contract Freeze

This API contract is **frozen** as of v2.1.0. Breaking changes require:
1. New version number (e.g., `/api/verify/v3`)
2. Explicit deprecation notice
3. Migration path documented

