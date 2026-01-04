# VERIFRAX v2.7.0 — Deploy Now Checklist

**Status:** Routes configured, ready to deploy  
**Date:** 2026-01-03

---

## ✅ CONFIGURATION VERIFIED

The `wrangler.toml` file **already has** the correct routes:

```toml
routes = [
  { pattern = "verifrax.net/*", zone_name = "verifrax.net" },
  { pattern = "www.verifrax.net/*", zone_name = "verifrax.net" }
]
```

**This is correct.** ✅

---

## DEPLOYMENT STEPS

### Option 1: Deploy via Wrangler (Recommended)

```bash
cd /Users/midiakiasat/Desktop/VERIFRAX
wrangler deploy
```

This will:
- Deploy the Worker with routes from `wrangler.toml`
- Bind routes to `verifrax.net/*` and `www.verifrax.net/*`
- Make `/` accessible (returns 200, not 404)

### Option 2: Configure via Cloudflare Dashboard

If routes aren't working after `wrangler deploy`:

1. **Cloudflare Dashboard** → **Workers & Pages**
2. Select **verifrax-edge-production**
3. **Settings** → **Triggers** → **Routes**
4. **Add Route:**
   - Pattern: `verifrax.net/*`
   - Zone: `verifrax.net`
   - Worker: `verifrax-edge-production`
5. **Add Route:**
   - Pattern: `www.verifrax.net/*`
   - Zone: `verifrax.net`
   - Worker: `verifrax-edge-production`

---

## VERIFICATION

After deployment, verify:

```bash
# Should return 200, not 404
curl -I https://verifrax.net/

# Expected:
# HTTP/2 200
# Content-Type: text/html; charset=utf-8
```

Or run the full verification script:

```bash
./ops/DEPLOYMENT_VERIFICATION_v2.7.0.sh
```

---

## WHAT THIS FIXES

**Before:**
- `GET /` → `404` (Worker route not configured)
- TLS works ✅
- DNS works ✅
- Code is correct ✅

**After:**
- `GET /` → `200` (Worker route configured)
- TLS works ✅
- DNS works ✅
- Code is correct ✅
- **Routes configured** ✅

---

## QUICK COMMAND

```bash
# Deploy and verify in one go
wrangler deploy && curl -I https://verifrax.net/
```

---

**END OF DEPLOY NOW CHECKLIST**

