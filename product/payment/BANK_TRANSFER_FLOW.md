# BANK TRANSFER PAYMENT FLOW — VERIFRAX_EXECUTION_V1

**MODE:** MANUAL · NO STRIPE

---

## Payment Configuration

```
PAYMENT_METHOD=BANK_TRANSFER_ONLY
AUTOMATION=OFF
CHARGEBACK_SURFACE=ZERO
```

---

## Invoice Schema (STRICT)

```
SELLER=VERIFRAX
SERVICE="Deterministic verification execution (single-use)"
PRICE=€650
NOTE="Execution is final and irreversible upon payment."
```

---

## Payment Rules

**RULE:**
No payment → no execution.

**RULE:**
Cleared funds only.

**RULE:**
No execution before payment confirmation.

**RULE:**
No refunds after execution begins.

---

## Payment Process

1. Client receives invoice with bank transfer details
2. Client initiates bank transfer
3. VERIFRAX confirms receipt of cleared funds
4. Payment confirmation authorizes execution
5. Execution proceeds (irreversible)

---

## No Stripe

- No Stripe integration
- No payment processor integration
- No automated payment handling
- Manual confirmation only

---

## Chargeback Surface

```
CHARGEBACK_SURFACE=ZERO
```

Bank transfers are final. No chargeback mechanism.

---

**AUTHORITY:** This document defines the bank transfer payment flow.

**UPDATES:** No updates without explicit version increment.

