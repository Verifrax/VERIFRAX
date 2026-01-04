# VERIFRAX v2.7.0 Worker Route Configuration

**Version:** v2.7.0  
**Purpose:** Cloudflare Workers route configuration guide

---

## REQUIRED ROUTES

The Worker **must** be bound to these routes:

```
verifrax.net/*
www.verifrax.net/*
```

---

## CLOUDFLARE DASHBOARD CONFIGURATION

### Step 1: Navigate to Routes

1. Cloudflare Dashboard
2. Workers & Pages
3. Select `verifrax-edge-production` Worker
4. Settings → Triggers → Routes

### Step 2: Add Routes

**Route 1:**
- Pattern: `verifrax.net/*`
- Zone: `verifrax.net`
- Worker: `verifrax-edge-production`

**Route 2:**
- Pattern: `www.verifrax.net/*`
- Zone: `verifrax.net`
- Worker: `verifrax-edge-production`

### Step 3: Verify

After adding routes, verify:

```bash
# Should return 200, not 404
curl -I https://verifrax.net/
curl -I https://www.verifrax.net/
```

---

## WRANGLER.TOML CONFIGURATION

### Route Configuration

```toml
# wrangler.toml
name = "verifrax-edge-production"
compatibility_date = "2024-01-01"

routes = [
  { pattern = "verifrax.net/*", zone_name = "verifrax.net" },
  { pattern = "www.verifrax.net/*", zone_name = "verifrax.net" }
]
```

### Deploy with Routes

```bash
wrangler deploy --config wrangler.toml
```

---

## VERIFICATION

### Test Root Path

```bash
# Must return 200, not 404
curl -I https://verifrax.net/

# Expected:
# HTTP/2 200
# Content-Type: text/html; charset=utf-8
```

### Test Other Paths

```bash
# All should return 200
curl -I https://verifrax.net/status
curl -I https://verifrax.net/verify
curl -I https://verifrax.net/.well-known/verifrax.json
```

---

## TROUBLESHOOTING

### If Routes Don't Work

1. **Check DNS:**
   ```bash
   dig verifrax.net +short
   # Should show Cloudflare IPs (proxied)
   ```

2. **Check SSL Mode:**
   - Cloudflare → SSL/TLS → Overview
   - Must be "Full" or "Full (strict)"

3. **Check Worker Status:**
   - Cloudflare → Workers & Pages
   - Verify Worker is deployed and active

4. **Check Route Pattern:**
   - Pattern must be `verifrax.net/*` (with wildcard)
   - Not `verifrax.net/` (without wildcard)

---

## WHY THIS MATTERS

A `404` on `/` when code defines it means:

- ✅ Code is correct
- ✅ TLS is working
- ✅ DNS is working
- ❌ **Worker route is not configured**

**This is a deployment configuration issue, not a code issue.**

---

**END OF WORKER ROUTE CONFIGURATION GUIDE**

