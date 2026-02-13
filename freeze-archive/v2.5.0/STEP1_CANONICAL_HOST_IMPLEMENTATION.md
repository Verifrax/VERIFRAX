# STEP 1: CANONICAL HOST AUTHORITY — Implementation

**Goal:** Only one public origin exists: `https://www.verifrax.net`
Everything else must either hard-redirect to it or not resolve.

---

## ✅ CODE CHANGES COMPLETED

### 1. Worker Code Updated
**File:** `worker-production-v2.5.0.js`

**Changes:**
- Removed incorrect redirect FROM `www.verifrax.net` TO `verifrax.net`
- Added canonical host authority gate at the top of the fetch handler
- Enforces `www.verifrax.net` as the only canonical host
- Redirects all non-canonical hosts to `https://www.verifrax.net` with 301

**Implementation:**
```js
// Enforce canonical host
const canonicalHost = "www.verifrax.net";
if (host !== canonicalHost) {
  url.hostname = canonicalHost;
  url.protocol = "https:";
  return Response.redirect(url.toString(), 301);
}
```

### 2. Wrangler Configuration Updated
**File:** `freeze/v2.5.0/wrangler.toml`

**Changes:**
- Added route for `www.verifrax.net/*` so Worker can handle both hosts
- Existing route for `verifrax.net/*` remains (for redirect handling)

**Routes:**
```toml
routes = [
  { pattern = "verifrax.net/*", zone_name = "verifrax.net" },
  { pattern = "www.verifrax.net/*", zone_name = "verifrax.net" }
]
```

---

## ⚠️ DEPLOYMENT REQUIRED

### Step 1: Deploy Updated Worker

**Option A: Cloudflare Dashboard**
1. Go to https://dash.cloudflare.com
2. Workers & Pages → `verifrax-edge-production`
3. Edit code → Paste updated code from `worker-production-v2.5.0.js`
4. Save and Deploy

**Option B: Wrangler CLI**
```bash
cd <project-root>
wrangler deploy --config freeze/v2.5.0/wrangler.toml
```

### Step 2: Update Routes in Cloudflare

1. Go to Workers & Pages → `verifrax-edge-production`
2. Settings → Domains & Routes
3. Ensure both routes exist:
   - `verifrax.net/*`
   - `www.verifrax.net/*`
4. Both should be proxied (orange cloud ON)

---

## 📋 DNS CONFIGURATION (Cloudflare Dashboard)

### Required DNS Records

**For `verifrax.net` domain in Cloudflare:**

1. **Apex Record (`@`):**
   - Type: `A` or `CNAME`
   - Name: `@` (or root)
   - Target: Your Worker/Pages target (or Cloudflare IP)
   - Proxy: **ON** (orange cloud)
   - Purpose: Redirect to `www.verifrax.net`

2. **WWW Record:**
   - Type: `A` or `CNAME`
   - Name: `www`
   - Target: Your Worker/Pages target (or Cloudflare IP)
   - Proxy: **ON** (orange cloud)
   - Purpose: Serves canonical content

**Pass condition:** Both `www` and `@` hit Cloudflare, but only `www` serves content (via Worker redirect logic).

---

## ✅ VERIFICATION COMMANDS

After deployment, run these four checks:

```bash
curl -I http://verifrax.net/
curl -I https://verifrax.net/
curl -I http://www.verifrax.net/
curl -I https://www.verifrax.net/
```

### Expected Results:

1. `http://verifrax.net/` → **301** to `https://www.verifrax.net/`
2. `https://verifrax.net/` → **301** to `https://www.verifrax.net/`
3. `http://www.verifrax.net/` → **301** to `https://www.verifrax.net/`
4. `https://www.verifrax.net/` → **200** (or intended status) from canonical host

### Completion Proof:

**Single line proof:**
```bash
curl -I https://verifrax.net/
```

**Must show:**
```
HTTP/2 301
location: https://www.verifrax.net/
```

---

## 📊 CURRENT STATE (Pre-Deployment)

**Date:** 2026-01-01

**Test Results:**
```
$ curl -I http://verifrax.net/
HTTP/1.1 404 Not Found

$ curl -I https://verifrax.net/
HTTP/2 404

$ curl -I http://www.verifrax.net/
HTTP/1.1 301 Moved Permanently
Location: https://verifrax.net/  ← WRONG DIRECTION

$ curl -I https://www.verifrax.net/
HTTP/2 301
location: https://verifrax.net/  ← WRONG DIRECTION
```

**Status:** ❌ NOT COMPLETE — Worker code updated but not deployed

**Next Action:** Deploy updated Worker code, then re-run verification commands.

---

## 🎯 STEP 1 COMPLETION CHECKLIST

- [x] Worker code updated with canonical host gate
- [x] Wrangler.toml updated with both routes
- [ ] Worker deployed to Cloudflare
- [ ] DNS records configured (both `@` and `www` proxied ON)
- [ ] All 4 curl commands return expected results
- [ ] `curl -I https://verifrax.net/` shows `Location: https://www.verifrax.net/`

---

**END OF STEP 1 IMPLEMENTATION**

