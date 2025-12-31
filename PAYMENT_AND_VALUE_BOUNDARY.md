# VERIFRAX v2.4.0 — Payment and Value Boundary

## Status
FROZEN — v2.4.0

---

## What the Payment Is

Payment is a one-time, non-recurring fee that authorizes exactly one execution of a deterministic verification algorithm on a single evidence bundle. Payment confirmation creates a PaymentIntent token that enables one upload operation and one verification execution. Once execution begins, payment is non-refundable. Payment does not create an account, balance, subscription, or ongoing access. Payment authorizes computation only.

---

## What the Payment Is Not

Payment is not:

- Subscription service
- Recurring billing
- Account creation
- Balance or wallet
- Escrow service
- Custody of funds
- Storage service
- Availability guarantee
- Uptime guarantee
- Legal validation
- Legal advice
- Financial advice
- Audit service
- Advisory service
- Warranty
- Guarantee of correctness
- Guarantee of completeness
- Guarantee of fitness for purpose
- Ongoing support
- Certificate updates
- Dispute resolution
- Legal representation
- Access to platform
- Access to infrastructure
- Access to services
- Transfer of intellectual property
- Acceptance of evidence correctness
- Legal judgment

---

## Transaction Model

### Before Payment

1. Customer creates PaymentIntent via `/api/create-payment-intent`
2. PaymentIntent is created in Stripe (status: `requires_payment_method`)
3. Customer confirms payment via Stripe.js (status: `succeeded`)
4. PaymentIntent ID is returned to customer

### During Payment

1. Payment confirmation occurs in Stripe
2. PaymentIntent status changes to `succeeded`
3. PaymentIntent ID serves as execution authorization token
4. No funds are held, escrowed, or stored by VERIFRAX

### After Payment

1. Customer uploads evidence bundle with PaymentIntent ID header
2. System verifies PaymentIntent status with Stripe API
3. If status is `succeeded`, execution is permitted
4. System executes deterministic verification algorithm
5. System produces certificate artifact
6. Certificate is returned to customer
7. Transaction is complete

### Post-Execution

1. Certificate is customer-controlled artifact
2. No ongoing relationship exists
3. No refunds are available
4. No access to infrastructure is provided
5. No support is provided
6. Certificate remains valid independently of VERIFRAX

---

## No-Custody Statement

VERIFRAX does not hold custody of funds. Payment flows directly from customer to payment processor (Stripe). VERIFRAX receives payment confirmation only. No funds are held, escrowed, or stored by VERIFRAX. VERIFRAX does not maintain balances, wallets, or accounts. Payment confirmation is a boolean authorization token, not a financial instrument.

---

## No-Service Statement

VERIFRAX does not provide ongoing service. Payment authorizes one execution only. No subscription, no recurring access, no platform access, no infrastructure access. After execution completes, no relationship exists. Certificates are independently verifiable and do not require VERIFRAX infrastructure. VERIFRAX may cease operations without affecting certificate validity.

---

## No-Guarantee Statement

VERIFRAX provides no warranties beyond execution of the deterministic algorithm. No guarantee of correctness, completeness, or fitness for purpose. No guarantee of infrastructure availability. No guarantee of service availability. No guarantee of certificate interpretation. No guarantee of legal validity. No guarantee of dispute resolution. Execution produces a certificate artifact. Certificate validity is determined by cryptographic verification, not by VERIFRAX guarantees.

---

## Failure Modes

### Payment Succeeds, Execution Fails Before Completion

If execution fails before certificate issuance due to system error:
- VERIFRAX may issue a refund or authorize a retry at its sole discretion
- Customer may retry with new payment and new PaymentIntent
- No automatic retries are provided
- No stored state exists to resume execution
- No obligation to refund exists

### Payment Succeeds, Execution Completes

If execution completes and certificate is issued:
- Payment is non-refundable
- Certificate is final
- No refunds are available
- No modifications are possible

### Payment Succeeds, Infrastructure Disappears After Execution

If VERIFRAX infrastructure disappears after certificate issuance:
- Certificate remains valid
- Certificate can be verified independently
- No refunds are available
- No ongoing relationship exists

### Payment Succeeds, Execution Never Begins

If payment succeeds but execution never begins due to system error:
- VERIFRAX may issue a refund or authorize a retry at its sole discretion
- Customer may retry with new payment and new PaymentIntent
- No stored state exists to resume execution
- No obligation to refund exists

---

## Regulatory Classification

VERIFRAX payment should be classified as:

- **Fee for computation** (not service)
- **Non-custodial** (no funds held)
- **Non-recurring** (one-time payment)
- **No stored value** (no balances or accounts)
- **No financial instrument** (payment authorization only)
- **Execution fee** (not subscription, not SaaS)

This is not:
- Money transmission
- Payment processing (Stripe performs this function)
- Escrow service
- Custody service
- Subscription service
- Software as a Service (SaaS)
- Financial instrument

---

## Stripe Interpretation Guardrail

For Stripe reviewers:

VERIFRAX payment is a one-time fee that authorizes a single computation. Payment confirmation creates an authorization token that enables one algorithm execution. No funds are held by VERIFRAX. No accounts are created. No subscriptions exist. No ongoing service is provided. Payment is non-refundable once execution begins. After execution completes, no relationship exists. Certificates are independently verifiable and do not require VERIFRAX infrastructure. This is fee-for-computation, not service, not custody, not escrow.

---

## Final Assertion

Payment authorizes exactly one execution of a deterministic verification algorithm. Nothing else.

---

**Status:** FROZEN — v2.4.0

**Authority:** This document is the canonical source of truth for payment classification.

**Updates:** No updates without explicit version increment.

