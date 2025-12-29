# Deployment Checklist - Finality Pipeline

## Pre-Deployment Steps

### 1. Create KV Namespace

```bash
cd /Users/midiakiasat/Desktop/VERIFRAX/workers/verifrax-edge
npx wrangler kv namespace create UPLOAD_MAPPINGS --env=production
```

**Copy the namespace ID from the output.**

### 2. Update wrangler.toml

Edit `wrangler.toml` and replace `YOUR_NAMESPACE_ID_HERE` with the actual namespace ID:

```toml
[[kv_namespaces]]
binding = "UPLOAD_MAPPINGS"
id = "abcd1234efgh5678"  # Replace with your actual ID
```

### 3. Deploy

**Option A (Recommended):** Deploy as the same worker name (Wrangler v4 will replace in-place):

```bash
npx wrangler deploy --env=production
```

**Option B:** If routes are owned by a different worker, explicitly reassert route ownership:

```bash
npx wrangler deploy \
  --env=production \
  --routes "verifrax.net/*" "verifrax.net/api/*"
```

**Note:** In Wrangler v4, `--force` flag does not exist. Route replacement is automatic if using the same worker name, or use explicit `--routes` flag to override.

**Expected output:**
```
Uploaded verifrax-edge
Deployed verifrax-edge triggers
https://verifrax-edge.verifrax.workers.dev
```

## Post-Deployment Sanity Checks

### ✅ Check 1: Create Upload (Verify Fix #2)

```bash
curl -X POST https://verifrax.net/api/create-upload \
  -H "Content-Type: application/json" \
  -d '{"payment_intent_id":"pi_test","bundle_size_bytes":1000000}'
```

**Must return:**
- ✅ `upload_id` (UUID)
- ✅ `parts[]` (array of pre-signed URLs)
- ✅ **NO `uploadId` field** (confirms server-side storage is active)

**If `uploadId` appears in response:** KV binding is not working. Check `wrangler.toml`.

### ✅ Check 2: Complete Upload with Invalid ID (Verify Finality Gate)

```bash
curl -X POST https://verifrax.net/api/complete-upload \
  -H "Content-Type: application/json" \
  -d '{"upload_id":"00000000-0000-0000-0000-000000000000","payment_intent_id":"pi_test","parts":[]}'
```

**Must return:**
- ✅ Status: **404** (not 500)
- ✅ Error message: "Upload not found or expired..."
- ✅ Confirms KV lookup works
- ✅ Confirms server authority is enforced
- ✅ Confirms finality gate is intact

**If returns 500:** KV binding is not working or code error.

### ✅ Check 3: Public Routes (Verify Fix #1)

```bash
curl -i https://verifrax.net/
curl -i https://verifrax.net/spec
curl -i https://verifrax.net/glossary
```

**All must return:**
- ✅ Status: **200**
- ✅ Content as expected
- ✅ No dependency on secrets

**If any returns 500:** Global secret validation still exists (Fix #1 not applied).

### ✅ Check 4: Bundle Size Cap (Verify Fix #3)

```bash
curl -X POST https://verifrax.net/api/create-upload \
  -H "Content-Type: application/json" \
  -d '{"payment_intent_id":"pi_test","bundle_size_bytes":3000000000}'
```

**Must return:**
- ✅ Status: **400**
- ✅ Error message about 2GB limit
- ✅ Request rejected before S3 operations

## What You Now Have

With all checks passing:

✅ **Deterministic payment locking** (Stripe PaymentIntent)
✅ **Server-authoritative upload identity** (KV storage)
✅ **Direct-to-S3 evidence ingestion** (multipart uploads)
✅ **Single-use finalization** (mapping deleted after completion)
✅ **Cryptographic bundle hashing** (SHA-256)
✅ **Immutable manifest sealing** (manifest.json in S3)
✅ **Public routes isolated from secrets** (no global validation)
✅ **Real finality boundary** (no deletion, no overwrite)

**This is no longer a prototype. It is a working finality pipeline.**

