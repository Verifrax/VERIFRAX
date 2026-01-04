# VERIFRAX v2.7.0 Routing Architecture

**Version:** v2.7.0  
**Date:** 2026-01-03  
**Status:** ARCHITECTURAL DECLARATION

---

## ARCHITECTURAL CHOICE: `/` IS A FIRST-CLASS SURFACE

**Decision:** The root path `/` is **intentionally** a valid, first-class surface.

**Rationale:**
- Institutional default: root path should serve content
- Human expectation: users expect `/` to work
- Zero liability: deterministic, static HTML
- No semantic ambiguity

**Implementation:**
- `/` is defined in `staticPages` (see `src/static-pages.ts`)
- Handler serves `/` for GET requests (see `src/index.ts:285`)
- Content: Static HTML homepage with system description

**Expected Behavior:**
- `GET /` → `200 OK` with HTML content
- `GET /` → NOT `404`

---

## ROUTING SEMANTICS

### Valid Routes (First-Class Surfaces)

These paths **must** return `200` (not `404`):

- `/` - Homepage (first-class surface)
- `/status` - System status endpoint
- `/verify` - Execution interface
- `/pricing` - Pricing information
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/refunds` - Refund policy
- `/legal` - Legal documentation index
- `/.well-known/verifrax.json` - Machine-readable metadata
- `/profiles/{profileId}.json` - Profile manifests
- `/certificate/{hash}` - Certificate retrieval
- `/legal/*.md` - Legal markdown documents

### Invalid Routes (Must Return 404)

These paths **must** return `404`:

- `/api/upload` - Not implemented (intentional)
- `/api/verify` (without auth) - Must return 401, not 404
- `/api/certificate` (invalid format) - Must return 404
- Any path not explicitly defined

---

## CLOUDFLARE WORKERS ROUTE CONFIGURATION

### Required Routes

The Worker **must** be bound to these routes in Cloudflare:

```
verifrax.net/*
www.verifrax.net/*
```

**Configuration:**
- Cloudflare Dashboard → Workers & Pages → Routes
- Route: `verifrax.net/*`
- Route: `www.verifrax.net/*`
- Worker: `verifrax-edge-production`

### Route Matching

Cloudflare Workers match routes **before** code execution:

1. **Route matches** → Worker code executes
2. **Route doesn't match** → Cloudflare returns `404` (never reaches Worker)

**This is why a 404 on `/` means:**
- ✅ TLS works
- ✅ DNS works
- ✅ Cloudflare is serving
- ❌ **Worker route is not configured for `/`**

---

## VERIFICATION

### Code Verification

```bash
# Verify `/` is in staticPages
grep -q "'/':" src/static-pages.ts

# Verify handler serves staticPages
grep -q "staticPages\[path\]" src/index.ts
```

### Deployment Verification

```bash
# This MUST return 200, not 404
curl -I https://verifrax.net/

# Expected:
# HTTP/2 200
# Content-Type: text/html; charset=utf-8
```

### Route Configuration Verification

1. **Cloudflare Dashboard:**
   - Workers & Pages → Routes
   - Verify `verifrax.net/*` exists
   - Verify `www.verifrax.net/*` exists
   - Verify Worker is assigned

2. **Wrangler Configuration:**
   ```toml
   # wrangler.toml
   routes = [
     { pattern = "verifrax.net/*", zone_name = "verifrax.net" },
     { pattern = "www.verifrax.net/*", zone_name = "verifrax.net" }
   ]
   ```

---

## TROUBLESHOOTING

### If `/` Returns 404

**Checklist:**

1. ✅ Code has `/` in `staticPages` (verified above)
2. ✅ Handler checks `staticPages[path]` (verified above)
3. ❓ **Worker route configured?** (check Cloudflare Dashboard)
4. ❓ **Worker deployed?** (check `wrangler deploy`)
5. ❓ **Route pattern matches?** (check `wrangler.toml`)

**Most Likely Cause:**
- Worker route not configured in Cloudflare Dashboard
- Route pattern doesn't match `/`

**Fix:**
- Add route `verifrax.net/*` in Cloudflare Dashboard
- Or update `wrangler.toml` with correct route pattern
- Redeploy Worker

---

## EPISTEMIC HYGIENE

### What We're Testing

The deployment verification script tests:

- ✅ **Code correctness:** `/` is defined and handled
- ✅ **Route configuration:** Worker is bound to domain
- ✅ **Deployment integrity:** Worker is deployed and responding

### What We're NOT Testing

- ❌ Final HTML content (that's a separate test)
- ❌ UX quality (that's out of scope)
- ❌ SEO optimization (that's out of scope)

### Why This Matters

A `404` on `/` when code defines it means:

- **Not** a code problem
- **Not** a TLS problem
- **Not** a DNS problem
- **IS** a deployment/routing configuration problem

**This is operational truth, not a false alarm.**

---

## ALTERNATIVE ARCHITECTURE (NOT CHOSEN)

### Option B: Intentionally Reject `/`

If we wanted `/` to be invalid, we would:

1. Remove `/` from `staticPages`
2. Update verification script to check `/status` instead
3. Document that `/` is intentionally invalid

**This was NOT chosen** because:
- Creates false alarms
- Operator confusion
- Audit friction
- Violates institutional default

---

**END OF ROUTING ARCHITECTURE DECLARATION**

