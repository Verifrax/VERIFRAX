# KV Namespace Setup Instructions

## Step 1: KV Namespace Status

✅ **KV namespace already exists:**
- Name: `production-UPLOAD_MAPPINGS`
- ID: `942583d630204a288a95544afd419190`

**Do NOT try to create it again.** If you see "namespace already exists" error, that's success.

## Step 2: Verify wrangler.toml

The namespace ID is already configured in `wrangler.toml`:

```toml
[[env.production.kv_namespaces]]
binding = "UPLOAD_MAPPINGS"
id = "942583d630204a288a95544afd419190"
```

**CRITICAL:** In Wrangler v4, `kv_namespaces` must be inside the `[env.production]` section, not at the top level.

## Step 3: Deploy

**Option A (Recommended):** Deploy as the same worker name:

```bash
npx wrangler deploy --env=production
```

Wrangler v4 will automatically replace the script in-place if the worker name matches.

**Option B:** If routes are owned by a different worker, explicitly reassert route ownership:

```bash
npx wrangler deploy \
  --env=production \
  --routes "verifrax.net/*" "verifrax.net/api/*"
```

**Note:** In Wrangler v4, `--force` flag does not exist. Use explicit `--routes` flag if needed.

## Step 4: Sanity Checks

### Test create-upload (should NOT return uploadId)

```bash
curl -X POST https://verifrax.net/api/create-upload \
  -H "Content-Type: application/json" \
  -d '{"payment_intent_id":"pi_test","bundle_size_bytes":1000000}'
```

**Expected:**
- ✅ `upload_id` present
- ✅ `parts[]` present
- ✅ **NO `uploadId` field** (confirms Fix #2 is active)

### Test complete-upload with invalid upload_id (should return 404)

```bash
curl -X POST https://verifrax.net/api/complete-upload \
  -H "Content-Type: application/json" \
  -d '{"upload_id":"00000000-0000-0000-0000-000000000000","payment_intent_id":"pi_test","parts":[]}'
```

**Expected:**
- ✅ Status: **404** (not 500)
- ✅ Error message about upload not found
- ✅ Confirms KV lookup works and server authority is enforced

## What This Enables

With KV namespace configured:

- ✅ Server-authoritative upload identity (client cannot lie)
- ✅ Single-use finalization (mapping deleted after completion)
- ✅ Finality gate intact (404 on invalid upload_id)
- ✅ No client-side uploadId required

Without KV namespace:

- ❌ `/api/create-upload` silently degrades (mapping not stored)
- ❌ `/api/complete-upload` cannot achieve finality (cannot retrieve uploadId)

