# Cloudflare /pay Endpoint — Disable Requirement

**Status:** CRITICAL  
**Purpose:** Document requirement to disable /pay endpoint

---

## Problem

If `/pay` endpoint creates PaymentIntents or renders Stripe Elements, it is **functional execution**, not documentation. This conflicts with PHASE 5 alignment claims of "no execution surfaces."

---

## Requirement

**`/pay` endpoint MUST be disabled or static HTML only.**

### Valid Options

#### OPTION A: Hard Error (STRONGEST)

- Return 404 (Not Found) or 503 (Service Unavailable)
- No payment processing
- No Stripe integration
- Clear error message

#### OPTION B: Static HTML Only

- Static HTML page with informational message
- No JavaScript
- No Stripe Elements
- No PaymentIntent creation
- May include link to external payment (off-platform)

#### OPTION C: Redirect to External Payment

- Redirect to external Stripe Checkout link
- Payment happens off-platform
- No on-platform payment processing

### Invalid Options

- ❌ Creating PaymentIntents
- ❌ Rendering Stripe Elements
- ❌ Processing payments on-platform
- ❌ Any functional payment processing

---

## Verification

### Required Checks

1. **No PaymentIntent Creation**
   - Verify `/api/create-payment-intent` returns 404 or is disabled
   - Verify no Worker code creates PaymentIntents

2. **No Stripe Elements**
   - Verify `/pay` does not render Stripe.js
   - Verify no Stripe Elements components

3. **No Payment Processing**
   - Verify no payment processing logic
   - Verify no Stripe webhook handlers (if applicable)

### Test Commands

```bash
# Test /pay endpoint
curl https://verifrax.net/pay

# Expected: 404, 503, or static HTML (no JavaScript, no Stripe)

# Test payment intent creation (should fail)
curl -X POST https://verifrax.net/api/create-payment-intent

# Expected: 404 or error
```

---

## Impact

**If `/pay` is functional:**

- PHASE 5 alignment is **factually false**
- Execution surfaces exist (contradicts claims)
- Regulatory risk increases
- Credibility erosion

**If `/pay` is disabled/static:**

- PHASE 5 alignment is **factually correct**
- No execution surfaces
- Regulatory risk minimized
- Credibility maintained

---

## Action Required

**Before tagging v2.5.0:**

1. Verify `/pay` is disabled or static
2. Verify no PaymentIntent creation
3. Verify no Stripe Elements rendering
4. Document verification in PHASE 5 report

**If `/pay` is currently functional:**

- Disable it immediately
- Or convert to static HTML only
- Or redirect to external payment link

---

## Status

**CRITICAL:** This must be resolved before v2.5.0 freeze.

