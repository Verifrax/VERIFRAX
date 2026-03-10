# VERIFRAX Contradiction Detection Algorithm

Status: Normative

---

## 1. Purpose

This document defines the deterministic contradiction detection
algorithm used by the VERIFRAX protocol.

Contradiction detection identifies situations where evidence
artifacts or claims cannot logically coexist.

Contradictions invalidate verification outcomes.

---

## 2. Definition of Contradiction

A contradiction occurs when two or more protocol inputs assert
mutually exclusive conditions.

Examples include:

- incompatible claims referencing the same artifact
- conflicting attestations
- inconsistent evidence metadata
- mutually exclusive verification states

---

## 3. Detection Stage

Contradiction detection MUST occur after bundle hash derivation
and before verdict generation.

Verification pipeline stage:

canonicalization  
→ serialization  
→ bundle hash derivation  
→ contradiction detection

---

## 4. Detection Algorithm

The contradiction detection algorithm MUST perform the following:

1. enumerate all claims
2. enumerate all attestations
3. enumerate all referenced evidence artifacts
4. evaluate logical compatibility

Any mutually exclusive conditions MUST be detected.

---

## 5. Deterministic Evaluation

Given identical inputs, contradiction detection MUST produce
identical outcomes across all implementations.

Evaluation MUST NOT depend on:

- implementation-specific ordering
- runtime environment
- non-deterministic iteration

---

## 6. Contradiction Outcome

When a contradiction is detected:

- the verification engine MUST record the contradiction
- the verification engine MUST transition to INVALIDATED

Contradictions represent deterministic protocol failure.

---

## 7. Reporting

Verification outputs SHOULD include:

- contradiction location
- conflicting claims
- evidence references

Contradiction reports MUST remain deterministic.

---

## 8. Protocol Integrity

Contradiction detection protects the protocol from accepting
mutually inconsistent verification inputs.

Verification engines MUST treat contradictions as
non-recoverable conditions.

---

## 9. Compliance

An implementation is VERIFRAX-compliant only if it:

- detects contradictions deterministically
- invalidates contradictory bundles
- produces identical contradiction outcomes across implementations

