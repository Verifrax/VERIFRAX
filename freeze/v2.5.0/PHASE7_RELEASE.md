# PHASE 7 — RELEASE

**Date:** 2025-01-XX  
**Purpose:** Release without obligation  
**Status:** DOCUMENTATION COMPLETE

---

## Objective

Release v2.5.0 without creating obligations. Release notes, website updates, and Stripe documentation must be clear about capabilities only, no service language.

---

## Actions

### 1. GitHub Release Notes

**Action:** Create GitHub release for `v2.5.0`

**Release Title:** `VERIFRAX v2.5.0 — Institution-Grade Delivery`

**Release Notes:**
```markdown
# VERIFRAX v2.5.0 — Institution-Grade Delivery

This release adds structure and clarity to VERIFRAX verification, without adding power or custody.

## Core Invariant

> v2.5.0 adds *structure and clarity*, not *power or custody*.  
> All authority remains documentary + cryptographic.

## Capabilities

- **Verification Classification**: Categorize verification results (informational only)
- **Failure Class Taxonomy**: Systematic failure categorization (taxonomic only)
- **Trust Context Bundles (TCB)**: Optional external context support (schema + signature structure validation only, cryptographic verification out of scope)
- **Multi-Profile Attestation**: Parallel profile execution (non-collapsing, non-authoritative)

## Reference Verifier

- Extended reference verifier with v2.5.0 support
- Offline-only (no network calls)
- Deterministic (same inputs → same outputs)
- Backward compatible with v2.4.0

## Guarantees

- Deterministic execution
- Reproducible verification
- Stateless operation
- Offline verification (reference verifier)
- v2.4.0 backward compatibility
- Zero semantic authority leakage

## Documentation

- Specification: `freeze/v2.5.0/SPEC_v2.5.0_FINAL.md`
- Threat Model: `freeze/v2.5.0/THREAT_MODEL_v2.5.0.md`
- Reference Implementation: `freeze/v2.5.0/PHASE3_REFERENCE_IMPLEMENTATION.md`
- Test Matrix: `freeze/v2.5.0/TEST_MATRIX.md`

## Status

This release is FROZEN and IMMUTABLE.
All authoritative content is in `freeze/v2.5.0/`.

## Independence

If GitHub is deleted, Cloudflare is shut down, AWS is wiped, Stripe is disabled:

> **v2.5.0 still verifies truth.**

That is institutional correctness.
```

**Key Points:**
- Capabilities only (no service language)
- No calls to action
- No obligation language
- Clear independence statement

---

### 2. Website Updates

**Action:** Update website with static explanation

**Content:**
- Static explanation of v2.5.0 features
- No calls to action
- No service language
- Clear disclaimers about classification, failure classes, TCB, multi-profile

**Sections:**
1. **What is v2.5.0?**
   - Structure and clarity, not power or custody
   - Documentary + cryptographic authority only

2. **Features**
   - Classification (informational only)
   - Failure classes (taxonomic only)
   - TCB support (optional, external)
   - Multi-profile (parallel, non-collapsing)

3. **Independence**
   - Offline verification
   - No infrastructure dependency
   - Reference verifier available

4. **Documentation**
   - Links to authoritative specifications
   - No service claims
   - No obligation language

**Rules:**
- Static content only
- No dynamic features
- No calls to action
- No service language

---

### 3. Stripe Documentation

**Action:** Update Stripe product documentation

**Product Description:**
```
VERIFRAX v2.5.0 Documentation Fee (Optional)

Payment = documentation fee only. Verification is free, offline, and reproducible.

Payment does NOT imply:
- Execution
- Acceptance
- Obligation
- Custody

Verification truth is independent of payment.
```

**Disclaimers:**
- Payment = documentation fee only
- Payment ≠ execution
- Payment ≠ acceptance
- Payment ≠ obligation
- Payment ≠ custody
- Verification truth = free, offline, reproducible

**Product Settings:**
- One-time payment only
- No recurring revenue
- No subscription model
- Clear boundaries

---

## Explicit Non-Actions

### No Automatic Deployments

- **Rule:** No automatic deployments
- **Enforcement:** Manual deployment only
- **Rationale:** No obligation to maintain service

### No Webhook Activation

- **Rule:** No webhook activation
- **Enforcement:** Webhooks remain disabled
- **Rationale:** No obligation to process events

### No SaaS Claims

- **Rule:** No SaaS claims
- **Enforcement:** Documentation only
- **Rationale:** No service obligation

---

## Exit Gate

**Nothing breaks if user disappears:**

- ✅ GitHub release notes: Capabilities only, no service language
- ✅ Website: Static explanation, no calls to action
- ✅ Stripe: Optional payment, clear boundaries
- ✅ No automatic deployments
- ✅ No webhook activation
- ✅ No SaaS claims

**Status:** PHASE 7 COMPLETE — Ready for post-release silence (PHASE 8)

---

## Next Phase

Proceed to **PHASE 8 — POST-RELEASE SILENCE** for credibility.

---

## Final Assertion

If **GitHub is deleted**, **Cloudflare is shut down**, **AWS is wiped**, **Stripe is disabled**:

> **v2.5.0 still verifies truth.**

That is institutional correctness.

