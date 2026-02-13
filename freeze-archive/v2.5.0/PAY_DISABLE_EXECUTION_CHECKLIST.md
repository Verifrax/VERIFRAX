# /pay Disable — Execution Checklist

**Status:** READY FOR EXECUTION  
**Option:** C — Externalize Payment Completely

---

## Files Created

1. ✅ **`DISABLE_PAY_INSTRUCTIONS.md`** — Step-by-step instructions (3 methods)
2. ✅ **`PAY_DISABLE_STATIC.html`** — Static HTML replacement (if route must remain)
3. ✅ **`PAY_DISABLE_WORKER_CODE.js`** — Worker code that returns 404 for `/pay`

---

## Execution Steps (Choose One Method)

### Method 1: Cloudflare Dashboard (REQUIRED - DO THIS)

**⚠️ CRITICAL: Use `verifrax-edge-production`, NOT `verifrax-edge`**

1. Log into https://dash.cloudflare.com
2. Go to Workers & Pages → **`verifrax-edge-production`** (NOT `verifrax-edge`)
3. Go to Settings → Domains & Routes
4. **DELETE** (do not edit) **BOTH** routes:
   - ❌ `verifrax.net/*`
   - ❌ `verifrax.net/api/*`
5. Verify immediately:
   ```bash
   curl -i https://verifrax.net/pay
   # Expected: 404 or 403 (NO Stripe.js)
   
   curl -i -X POST https://verifrax.net/api/create-payment-intent
   # Expected: 404 or 403
   ```

### Method 2: Wrangler CLI (If Worker Code Accessible)

1. Modify Worker code to return 404 for `/pay` and `/api/create-payment-intent`
2. Use `PAY_DISABLE_WORKER_CODE.js` as reference
3. Deploy: `npx wrangler deploy --env=production`
4. Verify: `curl https://verifrax.net/pay` → 404

### Method 3: Static HTML (If Route Must Remain)

1. Upload `PAY_DISABLE_STATIC.html` to static hosting
2. Point `/pay` route to static HTML
3. Verify: `curl https://verifrax.net/pay` → Static HTML (no Stripe.js)

---

## Verification (REQUIRED)

**After disabling, run these commands:**

```bash
# 1. Test /pay endpoint
curl https://verifrax.net/pay

# Expected: 404 OR static HTML (NO Stripe.js, NO PaymentIntents)

# 2. Test payment intent creation
curl -X POST https://verifrax.net/api/create-payment-intent

# Expected: 404

# 3. Verify no Stripe.js
curl https://verifrax.net/pay | grep -i stripe
# Expected: No matches
```

**All three must pass.**

---

## Documentation (REQUIRED)

**After verification passes, document in:**

`freeze/v2.5.0/PHASE5_PLATFORM_ALIGNMENT.md`

Fill in:
```
Date: 2025-01-XX
Command: curl https://verifrax.net/pay
Result: <paste full output>
Status: PASS
```

---

## Freeze (ONLY AFTER VERIFICATION PASSES)

**After `/pay` is disabled and verified:**

1. Run freeze script:
   ```bash
   ./freeze/v2.5.0/FREEZE_COMPLETION_SCRIPT.sh
   ```
   (Script will verify `/pay` is disabled before proceeding)

2. Push tag:
   ```bash
   git push origin v2.5.0
   ```

---

## Status

**⚠️ BLOCKING:** `/pay` must be disabled before freeze.

**Files ready. Instructions ready. Verification ready.**

**Execute one method above, verify, document, then freeze.**

---

**END OF EXECUTION CHECKLIST**

