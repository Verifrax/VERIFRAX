# Non-Goals

## Explicitly Banned Features

The following features are **explicitly banned** from v2.5.0 design:

---

## Subscriptions

**Banned:** Subscription-based billing models.

**Reason:** VERIFRAX is one-time execution only.

---

## Accounts

**Banned:** User accounts, authentication, sessions.

**Reason:** VERIFRAX is stateless. No mutable user state.

---

## Re-verification

**Banned:** Re-running verification on same bundle without new payment.

**Reason:** One payment = one execution. Deterministic results are idempotent.

---

## Appeals

**Banned:** Appeal process for verdicts.

**Reason:** Verdicts are final. Deterministic execution produces immutable results.

---

## Mutable Truth

**Banned:** Any mechanism to modify or retract certificates.

**Reason:** Certificates are immutable. Finality is irreversible.

---

## Profile Interpretation

**Banned:** VERIFRAX interpreting profile semantics.

**Reason:** Profiles are declarative, externally interpretable. VERIFRAX executes against profile ID only.

---

## AI / Heuristics

**Banned:** Machine learning, AI, or heuristic-based verification.

**Reason:** VERIFRAX is deterministic. No randomness, no learning, no heuristics.

---

## Summary

v2.5.0 design must not include any of the above features.

