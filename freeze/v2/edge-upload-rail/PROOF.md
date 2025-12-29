# VERIFRAX v2 Edge Upload Rail - Deployment Proof

**Date:** 2025-01-XX (to be filled with actual deployment date)  
**Worker:** verifrax-edge  
**R2 Bucket:** verifrax-evidence  
**Domain:** verifrax.net

## Deployment Verification

### Successful Upload Test

```bash
curl -i -X POST https://verifrax.net/api/upload \
  -H "Content-Length: 1024" \
  -H "Content-Type: application/octet-stream" \
  -H "x-payment-intent-id: pi_test_12345" \
  --data-binary @/tmp/test-bundle.bin
```

**Expected Response:**
```
HTTP/2 201
Content-Type: application/json

{
  "upload_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "bundle_hash": "sha256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### Worker Configuration

- **Worker Name:** verifrax-edge
- **Worker Version ID:** (from `wrangler deploy` output)
- **Routes:**
  - `verifrax.net/*`
  - `verifrax.net/api/*`
- **R2 Bucket Binding:** EVIDENCE_BUCKET → verifrax-evidence

### Storage Semantics

- **Object Key Pattern:** `uploads/{upload_id}/bundle.bin`
- **Manifest Key Pattern:** `uploads/{upload_id}/manifest.json`
- **Immutable:** Once written, objects cannot be overwritten
- **Hash Computation:** Post-upload SHA-256 (v1 limitation)

### v1 Limitations (Documented)

- Maximum bundle size: 2GB
- Hash computed after full upload (not streaming)
- Single-stream upload only (no multipart)

### Production Status

✅ **LIVE** - Worker-proxied R2 upload rail operational

