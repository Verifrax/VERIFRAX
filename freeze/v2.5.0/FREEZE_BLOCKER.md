# FREEZE BLOCKER — /pay Endpoint Still Live

**Status:** CRITICAL BLOCKER  
**Date:** 2025-01-XX  
**Impact:** v2.5.0 CANNOT be frozen or released until resolved

---

## Current State (VERIFIED)

**`/pay` endpoint is STILL LIVE AND EXECUTING:**

- ✅ Stripe.js is loaded (`https://js.stripe.com/v3/`)
- ✅ Stripe Elements are rendered
- ✅ `POST /api/create-payment-intent` is called
- ✅ PaymentIntent is created
- ✅ Payment is processed on-platform
- ✅ UI says "Payment required for verification execution"

**This is ACTIVE EXECUTION, not documentation.**

---

## Why This Blocks Freeze

### PHASE 5 Alignment is Factually False

PHASE 5 claims:
- "Workers disabled, `/pay` informational/error, no routes"
- "No execution surfaces active"

**Reality:**
- `/pay` is functional and executing
- PaymentIntents are created
- Payment is processed on-platform

**This is a contradiction.**

### Violates Core Invariant

Core invariant states:
> "v2.5.0 adds structure and clarity, not power or custody."

**Reality:**
- `/pay` processes payments (power)
- Payment is required for execution (custody-like)

**This violates the invariant.**

### Regulatory Risk

A regulator can say:
> "You claim no execution surfaces exist, yet payments are processed."

**This is not theoretical. It is mechanical.**

---

## Required Fix (Choose One)

### OPTION A: Disable /pay Completely

**Action:**
- Return 404 (Not Found) or 503 (Service Unavailable)
- Remove all payment processing code
- No Stripe integration

**Verification:**
```bash
curl https://verifrax.net/pay
# Expected: 404 or 503, no Stripe.js, no PaymentIntents
```

### OPTION B: Static HTML Only

**Action:**
- Static HTML page with informational message
- No JavaScript
- No Stripe Elements
- No PaymentIntent creation
- May include link to external payment (off-platform)

**Verification:**
```bash
curl https://verifrax.net/pay
# Expected: Static HTML, no Stripe.js, no PaymentIntents
```

### OPTION C: Externalize Payment Completely (RECOMMENDED)

**Action:**
- Remove `/pay` endpoint completely
- Use Stripe Checkout hosted by Stripe
- VERIFRAX never touches payment flow
- Payment happens off-platform

**Verification:**
```bash
curl https://verifrax.net/pay
# Expected: 404 (endpoint removed)
```

**This is consistent with "documentation fee" framing.**

---

## Verification Checklist

**Before freeze, ALL of these must pass:**

- [ ] `curl https://verifrax.net/pay` does NOT load Stripe.js
- [ ] `curl https://verifrax.net/pay` does NOT render Stripe Elements
- [ ] `POST /api/create-payment-intent` returns 404 or error
- [ ] No PaymentIntents are created
- [ ] No payment processing on-platform
- [ ] Verification result documented in PHASE5_PLATFORM_ALIGNMENT.md

---

## Implementation Files Provided

**Files created to assist with disabling `/pay`:**

1. **`DISABLE_PAY_INSTRUCTIONS.md`** — Step-by-step instructions
2. **`PAY_DISABLE_STATIC.html`** — Static HTML replacement (if route must remain)
3. **`PAY_DISABLE_WORKER_CODE.js`** — Worker code that returns 404 for `/pay`

**Choose one method and execute.**

---

## After /pay is Fixed

**ONLY AFTER `/pay` is provably non-functional:**

1. Re-run verification:
   ```bash
   curl https://verifrax.net/pay
   ```

2. Capture output and document in:
   - `PHASE5_PLATFORM_ALIGNMENT.md` (verification result section)

3. **THEN** run freeze script:
   ```bash
   ./freeze/v2.5.0/FREEZE_COMPLETION_SCRIPT.sh
   ```

4. **THEN** tag and release

**Order matters. You cannot reorder reality.**

---

## Status

**⚠️ FREEZE BLOCKED**

v2.5.0 **CANNOT** be frozen or released until `/pay` is disabled.

**No exception. No reframing. No "later".**

---

## Final Note

Your architecture, language discipline, and threat modeling are **institution-grade**.

The only thing breaking coherence is:
> You allowed a live execution surface to contradict a frozen claim.

Fixing `/pay` restores full alignment.

When `/pay` is dead or static, **everything else you've built stands**.

---

**END OF FREEZE BLOCKER**

