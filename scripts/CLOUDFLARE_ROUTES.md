# Cloudflare Worker Routes Configuration

## Current Route Structure

**Bootstrap (Current):**
```
verifrax.net/* → verifrax-edge
```

**Target Structure (After Adding Route):**
```
verifrax.net/*      → verifrax-edge (catch-all, remains)
verifrax.net/api/*  → verifrax-edge (semantic route)
```

## Adding the `/api/*` Route

### Option 1: Automated Script (Recommended)

**Node.js script:**
```bash
node scripts/add-cloudflare-route.mjs
```

**Shell script (alternative):**
```bash
bash scripts/add-cloudflare-route.sh
```

Both scripts will:
1. Fetch the zone ID for `verifrax.net` (if not provided)
2. Verify the `verifrax-edge` worker exists
3. Check if the route already exists
4. Add the route `verifrax.net/api/*` → `verifrax-edge`

### Option 2: Manual via Cloudflare Dashboard

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Workers Routes**
2. Click **Add route**
3. Enter:
   - **Route:** `verifrax.net/api/*`
   - **Worker:** `verifrax-edge`
4. Click **Save**

### Option 3: Cloudflare API (Direct)

```bash
# Get Zone ID
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=verifrax.net" \
  -H "Authorization: Bearer WWpeH5cXJXYJ6BM7EL-Cb_tHPgUBykvMmi5AQq-u" \
  -H "Content-Type: application/json" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

# Add Route
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes" \
  -H "Authorization: Bearer WWpeH5cXJXYJ6BM7EL-Cb_tHPgUBykvMmi5AQq-u" \
  -H "Content-Type: application/json" \
  -d '{"pattern":"verifrax.net/api/*","script":"verifrax-edge"}'
```

## Verification

After adding the route, verify it works:

```bash
curl -i https://verifrax.net/api/ping
```

**Expected:** Same behavior as before (e.g., "Hello World!"), but now with semantic route structure.

## Why This Matters

- **Semantic Structure:** `/api/*` signals a protocol boundary
- **Determinism:** Clear routing rules for auditors and integrators
- **Machine Trust:** URLs communicate architecture intent
- **Future-Proof:** Enables separation into `verifrax-web` and `verifrax-api` later

## Environment Variables

Scripts support these environment variables (with defaults):

- `CLOUDFLARE_API_TOKEN` (default: provided token)
- `CLOUDFLARE_ACCOUNT_ID` (default: `cdc2afb98b3dd0a01a57d30ce5c24b73`)
- `CLOUDFLARE_ZONE_ID` (optional, will fetch automatically)

## Next Steps (Future)

Once routes are established, the worker code can branch:

```javascript
const url = new URL(request.url);
if (url.pathname.startsWith('/api/')) {
  // API handler
} else {
  // Web handler
}
```

This enables clean separation without changing routing configuration.

