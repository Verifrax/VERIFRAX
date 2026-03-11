# Disable /pay Endpoint — Exact Instructions

**Status:** CRITICAL  
**Purpose:** Remove payment execution surface before v2.5.0 freeze  
**Option:** C — Externalize Payment Completely

---

## Objective

Remove `/pay` endpoint completely. Payment happens off-platform via Stripe Checkout (hosted by Stripe).

---

## Method 1: Cloudflare Dashboard (REQUIRED - DO THIS)

### ⚠️ CRITICAL: Correct Worker

**You have TWO workers:**
- `verifrax-edge` (subdomain routes only - NOT serving `/pay`)
- **`verifrax-edge-production`** (apex domain routes - **THIS serves `/pay`**)

**You MUST modify `verifrax-edge-production`, NOT `verifrax-edge`.**

### Steps

1. **Log into Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select account and domain: `verifrax.net`

2. **Navigate to Workers & Pages**
   - Click "Workers & Pages" in sidebar
   - **Find `verifrax-edge-production` worker** (NOT `verifrax-edge`)

3. **Delete Routes (REQUIRED)**
   - Go to **Settings → Domains & Routes** (or "Triggers" tab)
   - **DELETE** (do not edit, do not replace) **BOTH** routes:
     - ❌ `verifrax.net/*`
     - ❌ `verifrax.net/api/*`
   - **This detaches the Worker from the apex domain**
   - **This removes execution surface**

4. **Verify Immediately**
   ```bash
   curl -i https://verifrax.net/pay
   ```
   
   **PASS CONDITIONS (ANY ONE IS OK):**
   - 404 Not Found
   - 403 Forbidden
   - Cloudflare default error page
   - Static HTML **with NO Stripe.js**
   
   **FAIL CONDITIONS (ANY ONE FAILS):**
   - `js.stripe.com` in response
   - Payment UI
   - Any JavaScript execution
   - Any reference to PaymentIntent
   
   **Also verify API is dead:**
   ```bash
   curl -i -X POST https://verifrax.net/api/create-payment-intent
   # MUST return: 404 or 403
   ```

---

## Method 2: Wrangler CLI (If Worker Code is Accessible)

### Steps

1. **Locate Worker Code**
   - Worker code should be in repository (check `workers/` or `freeze/v2/releases/`)
   - Or in Cloudflare dashboard under Worker code

2. **Modify Worker Code**
   - Remove `/pay` route handler
   - Remove `/api/create-payment-intent` route handler
   - Return 404 for these paths:

   ```javascript
   if (url.pathname === '/pay' || url.pathname === '/api/create-payment-intent') {
     return new Response('Not Found', { status: 404 });
   }
   ```

3. **Deploy**
   ```bash
   npx wrangler deploy --env=production
   ```

4. **Verify**
   ```bash
   curl https://verifrax.net/pay
   # Expected: 404
   ```

---

## Method 3: Static HTML Replacement (If Route Must Remain)

### Steps

1. **Upload Static HTML**
   - Use `PAY_DISABLE_STATIC.html` (provided in this directory)
   - Upload to Cloudflare Pages or static hosting
   - Point `/pay` route to static HTML file

2. **Verify**
   ```bash
   curl https://verifrax.net/pay
   # Expected: Static HTML (no Stripe.js, no PaymentIntents)
   ```

---

## Verification Checklist

After disabling, verify ALL of these:

- [ ] `curl https://verifrax.net/pay` returns 404 OR static HTML (no Stripe.js)
- [ ] `curl -X POST https://verifrax.net/api/create-payment-intent` returns 404
- [ ] No Stripe.js loaded (`https://js.stripe.com/v3/` not in response)
- [ ] No PaymentIntent creation
- [ ] No payment processing on-platform

### Test Commands

```bash
# Test /pay endpoint
curl https://verifrax.net/pay

# Test payment intent creation (should fail)
curl -X POST https://verifrax.net/api/create-payment-intent

# Check for Stripe.js (should not appear)
curl https://verifrax.net/pay | grep -i stripe
# Expected: No matches
```

---

## After Disabling

1. **Document Verification**
   - Edit `freeze/v2.5.0/PHASE5_PLATFORM_ALIGNMENT.md`
   - Fill in verification result section:

   ```
   Date: 2025-01-XX
   Command: curl https://verifrax.net/pay
   Result: <paste output>
   Status: PASS
   ```

2. **Run Freeze Script**
   ```bash
   ./freeze/v2.5.0/FREEZE_COMPLETION_SCRIPT.sh
   ```

3. **Push Tag**
   ```bash
   git push origin v2.5.0
   ```

---

## External Payment Link

After disabling `/pay`, provide external Stripe Checkout link in:

- README.md
- Documentation
- Email communications
- **NOT** on verifrax.net execution path

**Example:**
```
Payment (optional documentation fee):
https://buy.stripe.com/[your-checkout-link]
```

---

## Status

**⚠️ CRITICAL:** `/pay` must be disabled before v2.5.0 freeze.

**No exception. No reframing. No "later".**

---

**END OF DISABLE PAY INSTRUCTIONS**

