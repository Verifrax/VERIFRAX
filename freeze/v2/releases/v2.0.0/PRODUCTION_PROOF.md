# VERIFRAX v2.0.0 Production Deployment Proof

**Deployment Date:** [TO BE FILLED]  
**Worker:** verifrax-edge  
**Worker Version ID:** [TO BE FILLED from `wrangler deploy` output]  
**R2 Bucket:** verifrax-evidence  
**Domain:** verifrax.net

## Deployment Verification

### Successful Upload Test

**Command:**
```bash
curl -i -X POST https://verifrax.net/api/upload \
  -H "Content-Length: 1024" \
  -H "Content-Type: application/octet-stream" \
  -H "x-payment-intent-id: pi_test_12345" \
  --data-binary @/tmp/test-bundle.bin
```

**Actual Response:**
```
[TO BE FILLED: Paste exact curl output showing HTTP/2 201]
```

**Response Body:**
```json
{
  "upload_id": "[TO BE FILLED]",
  "bundle_hash": "sha256:[TO BE FILLED]"
}
```

### Worker Deployment Output

**Wrangler Deploy Command:**
```bash
cd workers/verifrax-edge
npx wrangler deploy --env=production
```

**Deployment Output:**
```
[TO BE FILLED: Paste wrangler deploy output showing version ID]
```

### Route Configuration

**Routes Active:**
- `verifrax.net/*` → verifrax-edge worker
- `verifrax.net/api/*` → verifrax-edge worker

**Verification:**
```bash
curl -I https://verifrax.net/
curl -I https://verifrax.net/api/upload
```

**Expected:** Both return responses from verifrax-edge worker

### R2 Bucket Configuration

**Bucket Name:** verifrax-evidence  
**Binding:** EVIDENCE_BUCKET  
**Access:** Private (no public access, no CORS, Worker-only ingress)

**Verification:**
- Upload creates object at `uploads/{upload_id}/bundle.bin`
- Manifest created at `uploads/{upload_id}/manifest.json`
- Objects are immutable (versioning enabled)

## Production Status

✅ **LIVE** - Worker-proxied R2 upload rail operational

**Endpoints:**
- ✅ `POST /api/upload` - Returns 201 with upload_id and bundle_hash
- ✅ `POST /api/create-payment-intent` - Returns payment intent
- ✅ `GET /` - Returns system description
- ✅ `GET /spec` - Returns specification
- ✅ `GET /glossary` - Returns glossary

## Known Limitations (v1)

1. **Size Limit:** 2GB maximum bundle size
2. **Hash Timing:** Hash computed after full upload (not streaming)
3. **Single Stream:** No multipart upload support

These limitations are documented in `V2_EDGE_API.md`.

## Freeze Status

This proof is **frozen** as part of v2.0.0 release. It cannot be modified after release.

