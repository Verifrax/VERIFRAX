# CRITICAL ACTION REQUIRED — DELETE ROUTES NOW

**Status:** BLOCKING FREEZE  
**Worker:** `verifrax-edge-production` (NOT `verifrax-edge`)

---

## The Problem

You have **TWO workers**:
- `verifrax-edge` (subdomain routes only - NOT serving `/pay`)
- **`verifrax-edge-production`** (apex domain routes - **THIS serves `/pay`**)

**You inspected the wrong worker earlier.**

Disabling routes on `verifrax-edge` **does nothing** to `/pay`.

> `/pay` lives under `verifrax.net/*` → `verifrax-edge-production`

---

## Required Action (DO THIS NOW)

### Step 1: Delete Routes on `verifrax-edge-production`

1. Go to https://dash.cloudflare.com
2. Workers & Pages → **`verifrax-edge-production`** (NOT `verifrax-edge`)
3. Settings → Domains & Routes
4. **DELETE** (do not edit, do not replace) **BOTH** routes:
   - ❌ `verifrax.net/*`
   - ❌ `verifrax.net/api/*`

**This detaches the Worker from the apex domain.**
**This removes execution surface.**

---

### Step 2: Verify Immediately

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

```bash
curl -i -X POST https://verifrax.net/api/create-payment-intent
```

**MUST return:** 404 or 403

---

### Step 3: Document Verification

Edit `freeze/v2.5.0/PHASE5_PLATFORM_ALIGNMENT.md` and fill in verification result with **real output**.

---

### Step 4: Run Freeze Script

```bash
./freeze/v2.5.0/FREEZE_COMPLETION_SCRIPT.sh
```

This time it **must** pass step 0.

---

## Status

**⚠️ FREEZE BLOCKED UNTIL ROUTES ARE DELETED**

**No documentation can override this.**

**Delete the routes, verify, document, then freeze.**

---

**END OF CRITICAL ACTION**

