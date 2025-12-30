# VERIFRAX Payment → Finality Binding

Payment authorizes irreversible execution.

---

## Authorization Primitive

Stripe PaymentIntent serves as an execution authorization token.

No verification or finality is issued without a confirmed PaymentIntent.

---

## Binding Rules

- One PaymentIntent authorizes exactly one verification execution.
- Execution is irreversible once authorized.
- Finality artifacts are issued only after payment confirmation.

---

## Effects of Authorization

Upon payment confirmation:
- Verification execution is permitted
- Delivery Certificate issuance is enabled
- Dispute space collapses for the covered evidence bundle

---

## Non-Effects

Payment does not imply:
- Acceptance of evidence correctness
- Legal judgment
- Transfer of intellectual property

Payment authorizes execution only.

