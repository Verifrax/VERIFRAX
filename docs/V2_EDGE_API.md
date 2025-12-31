> **NON-AUTHORITATIVE — EXPLANATION ONLY**  
> This document is for educational purposes. Authoritative specifications are in `freeze/v2.4.0/`.

# VERIFRAX v2 Edge API Specification

**Version:** 2.0.0  
**Base URL:** `https://verifrax.net`  
**Status:** FROZEN (immutable contract)

This document defines the **v2 edge surface contract** for VERIFRAX. This contract is frozen and must not be broken in future versions without explicit versioning.

## Endpoint: `/api/upload`

**Method:** `POST`  
**Purpose:** Upload an evidence bundle to R2 storage via Worker proxy

### Request Headers

| Header | Required | Value | Description |
|--------|----------|-------|-------------|
| `Content-Length` | Yes | Integer | Bundle size in bytes (max 2GB) |
| `Content-Type` | Optional | `application/octet-stream` | Must be `application/octet-stream` if provided |
| `x-payment-intent-id` | Yes | String | Stripe payment intent ID (authorization) |

### Request Body

Raw binary data (evidence bundle). Streamed directly to R2 without buffering.

### Response: Success (201 Created)

```json
{
  "upload_id": "uuid-v4",
  "bundle_hash": "sha256:64-hex-characters"
}
```

**Fields:**
- `upload_id`: Canonical VERIFRAX upload identifier (UUID v4)
- `bundle_hash`: SHA-256 hash of uploaded bundle (prefixed with `sha256:`)

### Response: Error Codes

| Status | Code | Condition | Response Body |
|--------|------|-----------|---------------|
| 402 | Payment Required | Missing `x-payment-intent-id` header | `"Missing payment authorization"` |
| 411 | Length Required | Missing `Content-Length` header | `"Content-Length required"` |
| 413 | Payload Too Large | Bundle exceeds 2GB limit | `"Bundle exceeds v1 size limit"` |
| 415 | Unsupported Media Type | Invalid `Content-Type` | `"Content-Type must be application/octet-stream"` |
| 500 | Internal Server Error | Service configuration error or upload failure | `{"error": "..."}` |

### Storage Semantics

**R2 Object Keys:**
- Bundle: `uploads/{upload_id}/bundle.bin`
- Manifest: `uploads/{upload_id}/manifest.json`

**Manifest Structure:**
```json
{
  "upload_id": "uuid",
  "payment_intent_id": "pi_...",
  "bundle_hash": "sha256:...",
  "size_bytes": 123456,
  "completed_at": "ISO8601",
  "verifier": "verifrax-edge",
  "version": "v1"
}
```

**Properties:**
- Immutable: Objects cannot be overwritten once written
- Versioned: R2 versioning enabled
- Private: No public access, no CORS, ingress through Worker only

### v1 Limitations (Documented)

1. **Size Limit:** Maximum 2GB per bundle
2. **Hash Timing:** Hash computed after full upload (not streaming)
3. **Single Stream:** No multipart upload support

These limitations are acceptable for v1. Future versions must implement:
- Incremental/streaming hash computation
- Multipart upload for large bundles
- Higher size limits

### Security Model

- **Authentication:** Payment intent ID required (Stripe integration)
- **Authorization:** Payment must be confirmed before upload
- **Storage:** R2 bucket has no public access, no custom domain, no CORS
- **Ingress:** All access through Worker proxy only

### Deterministic Behavior

- Same bundle content → same `bundle_hash`
- Same upload → same `upload_id` (single-use, non-replayable)
- Manifest written atomically after bundle upload

### Contract Freeze

This API contract is **frozen** as of v2.0.0. Breaking changes require:
1. New version number (e.g., `/api/upload/v3`)
2. Explicit deprecation notice
3. Migration path documented

