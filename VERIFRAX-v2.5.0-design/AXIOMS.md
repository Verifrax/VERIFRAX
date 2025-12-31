# Design Axioms

## Axioms That Must Be Preserved

These axioms are immutable. v2.5.0 design must preserve them.

---

## Determinism Preserved

**Axiom:** Same inputs → same outputs.

**Preservation:** v2.5.0 must remain deterministic. No randomness, no time-dependent logic, no external state.

---

## Finality Preserved

**Axiom:** Certificates are final and immutable.

**Preservation:** v2.5.0 must not introduce mechanisms to modify or retract certificates.

---

## Reference Verifier Supremacy

**Axiom:** Reference verifier wins over infrastructure.

**Preservation:** v2.5.0 must maintain reference verifier as authoritative. Infrastructure results are secondary.

---

## Certificates Remain Infrastructure-Independent

**Axiom:** Certificates are verifiable without VERIFRAX infrastructure.

**Preservation:** v2.5.0 certificates must remain independently verifiable. No dependency on VERIFRAX infrastructure.

---

## Payment → Execution Boundary

**Axiom:** Payment authorizes exactly one execution.

**Preservation:** v2.5.0 must maintain payment → execution boundary. One payment = one execution authorization.

---

## Version Isolation

**Axiom:** Versions are isolated. No retroactive changes.

**Preservation:** v2.5.0 must not affect v2.4.0. Versions are independent.

---

## Summary

These axioms are non-negotiable. v2.5.0 design must preserve all of them.

