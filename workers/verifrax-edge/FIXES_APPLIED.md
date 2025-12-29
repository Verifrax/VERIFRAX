# Critical Fixes Applied

## ✅ Fix 1: Removed Global Secret Validation

**Problem:** Global secret validation caused public routes (`/`, `/spec`, `/glossary`) to crash if secrets were missing, breaking AI discoverability.

**Solution:** 
- Removed global validation
- Moved secret validation inside each API route that requires it
- Public routes now work independently of secrets

**Impact:** Public routes remain accessible even during secret rotation or misconfiguration.

## ✅ Fix 2: Server-Side Upload ID Mapping

**Problem:** Client was required to resend `uploadId`, breaking finality integrity (client could lie or mismatch IDs).

**Solution:**
- Store `upload_id → uploadId` mapping in Cloudflare KV
- Client only sends `upload_id` in complete-upload
- Server retrieves `uploadId` from KV (authoritative)
- Mapping deleted after completion (single-use enforcement)

**Impact:** Server maintains authoritative control over evidence identity. Client cannot manipulate the linkage.

## ✅ Fix 3: Hard Bundle Size Cap

**Problem:** Downloading full object to hash will crash at scale (memory limits, timeouts).

**Solution:**
- Added hard size cap: **2GB maximum**
- Request rejected early if bundle exceeds limit
- Documented as v1 limitation
- Future versions must implement incremental hashing

**Impact:** Prevents crashes and timeouts. Clear limitation documented for users.

## Setup Required

### 1. Create KV Namespace

```bash
cd workers/verifrax-edge
npx wrangler kv:namespace create "UPLOAD_MAPPINGS"
```

This will output a namespace ID. Add it to `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "UPLOAD_MAPPINGS"
id = "your-namespace-id-here"
```

### 2. Deploy

```bash
npx wrangler deploy --env=""
```

## API Changes

### `/api/create-upload` Response

**Before:**
```json
{
  "upload_id": "uuid",
  "uploadId": "s3-upload-id",  // ❌ Removed
  "bucket": "...",
  "key": "...",
  "parts": [...]
}
```

**After:**
```json
{
  "upload_id": "uuid",
  "bucket": "...",
  "key": "...",
  "parts": [...]
}
```

### `/api/complete-upload` Request

**Before:**
```json
{
  "upload_id": "uuid",
  "uploadId": "s3-upload-id",  // ❌ Removed
  "payment_intent_id": "pi_...",
  "parts": [...]
}
```

**After:**
```json
{
  "upload_id": "uuid",
  "payment_intent_id": "pi_...",
  "parts": [...]
}
```

## Limitations (v1)

1. **Bundle size cap:** 2GB maximum
2. **Hash computation:** Full object download required (will be fixed in future version)
3. **KV TTL:** Upload mapping expires after 1 hour (upload completion window)

## Security Improvements

- ✅ Public routes isolated from secret dependencies
- ✅ Server-side authority over upload identity
- ✅ Single-use enforcement (mapping deleted after completion)
- ✅ Early rejection of oversized bundles

