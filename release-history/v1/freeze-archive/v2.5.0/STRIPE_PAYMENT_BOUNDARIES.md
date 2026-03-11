# Stripe Payment Boundaries (v2.5.0)

**Version:** 2.5.0  
**Status:** AUTHORITATIVE  
**Purpose:** Define payment semantics and boundaries

---

## Payment Semantics

**Payment = documentation fee only**

**CRITICAL:** Payment never buys cryptographic trust. TCB signature validation (structure only, not cryptographic verification) is independent of payment.

### What Payment Does NOT Mean

- Payment does **NOT** imply execution
- Payment does **NOT** imply acceptance
- Payment does **NOT** imply obligation
- Payment does **NOT** imply custody
- Payment does **NOT** block verification truth

### What Payment Does Mean

- Payment = one-time documentary fee
- Payment = reference execution convenience
- Payment = optional service (not required)

---

## Verification Truth

Verification truth is:
- **Free**: No payment required
- **Offline**: No network required
- **Reproducible**: Deterministic execution
- **Independent**: No dependency on payment

### Payment Independence

- Stripe failure **cannot** block verification
- Payment failure **cannot** invalidate certificates
- Payment status **does not** affect verification truth

---

## Product Definition

### One-Time Payment Only

- No recurring revenue
- No subscription model
- No dependency lock-in
- One payment = one documentation fee

### Payment Boundaries

- Payment is **optional** (verification is free)
- Payment is **documentary** (not execution)
- Payment is **convenience** (not requirement)
- Payment is **one-time** (not recurring)

---

## Cashflow Model

### Payment Flow

1. User creates payment intent (optional)
2. User uploads bundle (free)
3. User verifies bundle (free, offline)
4. User pays documentation fee (optional)

### Payment Failure Handling

- Payment failure → verification still works
- Payment failure → certificate still valid
- Payment failure → no obligation

---

## Stripe Configuration

### Product Settings

- **Type:** One-time payment
- **Price:** Documentary fee (not execution fee)
- **Description:** "Documentation fee for VERIFRAX v2.5.0 (optional, verification is free)"

### Disclaimers

- "Payment is optional. Verification is free and offline."
- "Payment does not imply execution, acceptance, or obligation."
- "Payment is a documentary fee only."

---

## Legal Protection

### User Protection

- Users can verify without payment
- Users are not obligated by payment
- Users retain full control

### VERIFRAX Protection

- Payment does not create obligation
- Payment does not imply custody
- Payment does not imply enforcement

### Regulator Protection

- Clear payment boundaries
- No hidden obligations
- Transparent semantics

---

## Exit Gate

**Payment boundaries are clear and bulletproof:**

- ✅ Payment = documentation fee only
- ✅ Verification truth = free, offline, reproducible
- ✅ Stripe failure cannot block verification
- ✅ No recurring revenue
- ✅ No dependency lock-in

**Status:** COMPLETE

