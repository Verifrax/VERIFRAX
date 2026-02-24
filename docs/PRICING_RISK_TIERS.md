> **NON-AUTHORITATIVE — EXPLANATION ONLY**  
> This document is for educational purposes. Authoritative specifications are in `freeze/v2.4.0/`.

# VERIFRAX Pricing and Risk Tiers

**Version:** 1.0.0  
**Status:** FROZEN  
**Effective:** v2.0.0

This document defines the **pricing structure and risk tiers** for VERIFRAX verification services. It specifies event-based pricing by risk tier and liability boundaries.

## Core Principle

**Pricing is event-based and risk-tiered. Higher risk tiers include additional liability protections and verification guarantees.**

VERIFRAX verifies **conformance to declared rules**, not truth, legality, or factual correctness of evidence.

## Risk Tiers

### Tier 1: Public (Low Risk)

**Use Cases:**
- Open source project verification
- Public documentation verification
- Non-commercial evidence verification

**Pricing:**
- **Base Fee:** €120.00 per verification event
- **Bundle Size Limit:** 2GB
- **Verification Time:** Standard (no SLA)

**Included:**
- Basic verification (deterministic verdict)
- Bundle hash computation
- Verdict generation
- Public verdict index entry

**Excluded:**
- Liability protection
- SLA guarantees
- Priority processing
- Custom profiles

**Liability Boundary:**
- **No liability** for verification accuracy
- **No warranty** on verdict correctness
- **No guarantee** of infrastructure availability

### Tier 2: Enterprise (Medium Risk)

**Use Cases:**
- Commercial software verification
- Compliance verification
- Regulatory reporting

**Pricing:**
- **Base Fee:** €1,200.00 per verification event
- **Bundle Size Limit:** 10GB
- **Verification Time:** SLA: 24 hours

**Included:**
- All Tier 1 features
- SLA guarantee (24-hour verification)
- Priority processing
- Custom profile support
- Extended bundle size limit

**Excluded:**
- Liability protection (limited)
- Legal warranty
- Insurance coverage

**Liability Boundary:**
- **Limited liability** for verification errors (up to fee amount)
- **No warranty** on verdict correctness beyond deterministic verification
- **Infrastructure availability** guaranteed (SLA)

### Tier 3: Institutional (High Risk)

**Use Cases:**
- Court evidence verification
- Financial audit verification
- Regulatory compliance verification

**Pricing:**
- **Base Fee:** €12,000.00 per verification event
- **Bundle Size Limit:** 50GB
- **Verification Time:** SLA: 4 hours

**Included:**
- All Tier 2 features
- Extended liability protection
- Legal warranty on verification process
- Insurance coverage
- Dedicated support
- Custom contract definitions

**Liability Boundary:**
- **Extended liability** for verification errors (up to 10x fee amount)
- **Legal warranty** on verification process (not verdict correctness)
- **Insurance coverage** for service errors
- **Service availability** guaranteed (SLA with penalties)

## Event-Based Pricing

### What Constitutes an Event

A **verification event** is:
- Single bundle upload
- Single verification execution
- Single verdict generation

**Not included:**
- Re-verification of same bundle (new event)
- Multiple profile verification (separate events)
- Bundle modifications (new event)

### Pricing Calculation

**Base Formula:**
```
Total Fee = Base Fee (by tier) × Risk Multiplier
```

**Risk Multipliers:**
- Standard risk: 1.0x
- High-risk evidence: 1.5x
- Time-sensitive: 2.0x
- Custom requirements: 1.2x - 2.0x

## Payment Authorization

### Payment Intent

All verifications require:
- **Stripe Payment Intent:** Created before upload
- **Payment Confirmation:** Payment must be confirmed before verification
- **Payment Intent ID:** Sent in `x-payment-intent-id` header

### Payment Flow

1. **Create Payment Intent:** `POST /api/create-payment-intent`
2. **Client Confirms Payment:** Stripe payment confirmation
3. **Upload Bundle:** `POST /api/upload` with `x-payment-intent-id`
4. **Verification Executes:** After successful upload

### Refund Policy

**No Refunds:**
- Verification events are non-refundable
- Verdicts are final (deterministic)
- Payment confirms acceptance of terms

**Exceptions:**
- Service failure (verification cannot complete)
- Verifier bug (non-deterministic behavior)
- Payment processing error

## Liability Boundaries

### What is Included

**Tier 1 (Public):**
- Deterministic verification process
- Verdict generation
- Bundle storage (immutable)

**Tier 2 (Enterprise):**
- All Tier 1 features
- SLA guarantee
- Limited liability for errors

**Tier 3 (Institutional):**
- All Tier 2 features
- Extended liability protection
- Legal warranty
- Insurance coverage

### What is NOT Included

**Excluded from all tiers:**
- **Verdict Correctness:** No warranty on verdict accuracy
- **Evidence Authenticity:** No guarantee evidence is authentic
- **Legal interpretation:** none provided
- **Court Representation:** No representation in legal proceedings
- **Dispute Resolution:** No human adjudication or dispute resolution

### Liability Limits

**Tier 1:**
- **Liability:** €0 (no liability)
- **Warranty:** None

**Tier 2:**
- **Liability:** Up to fee amount (€1,200.00)
- **Warranty:** Process warranty only (not verdict correctness)

**Tier 3:**
- **Liability:** Up to 10x fee amount (€120,000.00)
- **Warranty:** Process warranty + insurance coverage

## Service Level Agreements (SLA)

### Tier 1: No SLA

- **Verification Time:** Best effort
- **Availability:** No guarantee
- **Support:** Community support only

### Tier 2: 24-Hour SLA

- **Verification Time:** 24 hours from upload
- **Availability:** 99.5% uptime
- **Support:** Email support (48-hour response)

### Tier 3: 4-Hour SLA

- **Verification Time:** 4 hours from upload
- **Availability:** 99.9% uptime
- **Support:** Dedicated support (2-hour response)
- **Penalties:** Service credits for SLA violations

## Custom Requirements

### Custom Profiles

- **Tier 1:** Not available
- **Tier 2:** Available (additional fee: €500.00)
- **Tier 3:** Included

### Custom Contracts

- **Tier 1:** Not available
- **Tier 2:** Not available
- **Tier 3:** Available (additional fee: €2,000.00)

### Priority Processing

- **Tier 1:** Not available
- **Tier 2:** Included
- **Tier 3:** Included (highest priority)

## Versioning

This pricing document is **frozen** as of v1.0.0. Changes require:
1. New version number (v1.1.0, v2.0.0, etc.)
2. Explicit notice period (minimum 30 days)
3. Grandfathering for existing contracts

## References

- `V2_EDGE_API.md` - API specification
- `GOVERNANCE_DISPUTE_FINALITY.md` - Dispute resolution
- `GOVERNANCE_VERSION_FINALITY.md` - Version guarantees

