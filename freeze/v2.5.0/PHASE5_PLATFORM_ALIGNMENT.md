# PHASE 5 — PLATFORM ALIGNMENT (NO EXECUTION)

**Date:** 2025-01-XX  
**Purpose:** Align infrastructure without activating it  
**Status:** DOCUMENTATION COMPLETE

---

## Objective

Align infrastructure platforms (GitHub, Cloudflare, AWS, Stripe) **without activating execution surfaces**. All alignment is documentation and configuration only.

---

## GitHub Alignment

### Actions

1. **Tag `v2.5.0-rc`**
   - Create release candidate tag
   - Include all v2.5.0 artifacts
   - Mark as pre-release

2. **Publish Checksums**
   - Generate SHA256SUMS for all v2.5.0 artifacts
   - Include in release notes
   - Publish in `freeze/v2.5.0/SHA256SUMS.txt`

3. **Lock Branches**
   - Protect main branch (if not already protected)
   - Require pull request reviews
   - Prevent force pushes

### Artifacts

- `freeze/v2.5.0/SPEC_v2.5.0_Draft_B.md`
- `freeze/v2.5.0/THREAT_MODEL_v2.5.0.md`
- `freeze/v2.5.0/PHASE0_BASELINE_REPORT.md`
- `freeze/v2.5.0/PHASE3_REFERENCE_IMPLEMENTATION.md`
- `freeze/v2.5.0/PHASE4_TESTING.md`
- `freeze/v2.5.0/TEST_MATRIX.md`
- Reference verifier extensions (`verifrax-reference-verifier/src/*.js`)

### Rules

- **No CI/CD pipelines** deploy execution surfaces
- **No automatic deployments**
- **No webhook activation**
- **Documentation only**

---

## Cloudflare Alignment

### Actions

1. **Keep Workers Disabled**
   - Verify Workers are disabled or detached
   - No active deployments
   - No routes attached

2. **`/pay` Endpoint** (CRITICAL)
   - **MUST be disabled or static HTML only**
   - **MUST NOT create PaymentIntents**
   - **MUST NOT render Stripe Elements**
   - **MUST NOT process payments**
   - Options:
     - Return hard error (404 or 503)
     - Static HTML with informational message only
     - Redirect to external payment link (off-platform)
   - **No functional payment processing**
   - **No execution authorization**
   - **CRITICAL:** If `/pay` creates PaymentIntents, PHASE 5 alignment is factually false

3. **No Routes Attached**
   - Verify no routes point to Workers
   - No active endpoints
   - No execution surfaces

### Verification

- Run `npx wrangler deployments list` → should show no active deployments
- **CRITICAL:** Verify `/pay` does NOT create PaymentIntents
- **CRITICAL:** Verify `/pay` does NOT render Stripe Elements
- Verify `/pay` returns error, static HTML, or redirect only
- Verify no routes are active
- **If `/pay` is functional, PHASE 5 alignment is incomplete**

### Rules

- **Workers remain disabled**
- **No execution surfaces active**
- **Documentation only**

---

## AWS Alignment

### Actions

1. **Evidence Storage (if any)**
   - Set to **archive-only**
   - Read-only access
   - No write permissions

2. **Lifecycle Rules**
   - Document lifecycle rules
   - Archive-only policies
   - No execution authority

3. **IAM Roles**
   - Verify no IAM roles with execution authority
   - Read-only access only
   - No write permissions

### Verification

- Verify S3 buckets (if any) are read-only / archive
- Verify no IAM roles with execution authority
- Document lifecycle rules

### Rules

- **Archive-only storage**
- **No execution authority**
- **Documentation only**

---

## Stripe Alignment (CRITICAL)

### Actions

1. **Payment Definition**
   - Payment = **one-time documentary fee**
   - Explicitly **not required** for verification truth
   - Payment ≠ execution
   - Payment ≠ acceptance
   - Payment ≠ custody

2. **Stripe Documentation**
   - Update product description
   - Add explicit disclaimers:
     - Payment = documentation fee only
     - Payment ≠ execution
     - Payment ≠ acceptance
     - Payment ≠ obligation
     - Payment ≠ custody
     - Verification truth = free, offline, reproducible

3. **Product Configuration**
   - One-time payment only
   - No recurring revenue
   - No subscription model
   - Clear boundaries

### Documentation

Create `freeze/v2.5.0/STRIPE_PAYMENT_BOUNDARIES.md`:

```markdown
# Stripe Payment Boundaries (v2.5.0)

## Payment Semantics

**Payment = documentation fee only**

- Payment does NOT imply execution
- Payment does NOT imply acceptance
- Payment does NOT imply obligation
- Payment does NOT imply custody
- Payment does NOT block verification truth

## Verification Truth

Verification truth is:
- Free
- Offline
- Reproducible
- Independent of payment

## Product Definition

- One-time payment only
- Documentary fee
- No recurring revenue
- No subscription model
- No dependency lock-in
```

### Rules

- **Payment = documentation fee only**
- **Verification truth = free, offline, reproducible**
- **Stripe failure cannot block verification**
- **No recurring revenue**
- **No dependency lock-in**

---

## Exit Gate

**Platforms aligned, nothing live:**

- ✅ GitHub: Tag `v2.5.0-rc` created, checksums published, branches locked
- ✅ Cloudflare: Workers disabled, `/pay` informational/error, no routes
- ✅ AWS: Evidence storage archive-only, no execution authority
- ✅ Stripe: Payment boundaries documented, product definition updated

**Status:** PHASE 5 COMPLETE — Ready for freeze (PHASE 6)

---

## Next Phase

Proceed to **PHASE 6 — FREEZE** to make v2.5.0 irreversible.

