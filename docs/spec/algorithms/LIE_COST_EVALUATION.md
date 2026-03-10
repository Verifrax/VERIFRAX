# VERIFRAX Lie-Cost Evaluation Model

Status: Normative

---

## 1. Purpose

This document defines the deterministic lie-cost evaluation
model used by the VERIFRAX protocol.

Lie-cost quantifies the protocol impact of false or
contradictory claims.

The model allows verification engines to evaluate the
severity of protocol violations in a deterministic manner.

---

## 2. Concept

Lie-cost represents the protocol penalty associated with
invalid or contradictory verification inputs.

The higher the lie-cost, the more severe the protocol
violation.

Lie-cost evaluation ensures that verification engines
treat protocol violations consistently.

---

## 3. Evaluation Stage

Lie-cost evaluation MUST occur after invalidation
evaluation and before verdict generation.

Verification pipeline:

canonicalization  
→ serialization  
→ bundle hash derivation  
→ contradiction detection  
→ invalidation evaluation  
→ lie-cost evaluation

---

## 4. Evaluation Inputs

Lie-cost evaluation uses:

- detected contradictions
- invalidation events
- claim violations
- attestation failures

These inputs MUST be evaluated deterministically.

---

## 5. Cost Assignment

Each violation type MUST have a deterministic
cost classification.

Example categories may include:

- minor inconsistency
- structural violation
- critical contradiction

Cost categories MUST remain stable across
implementations.

---

## 6. Deterministic Requirement

Given identical inputs, lie-cost evaluation
MUST produce identical results across all
compliant implementations.

Evaluation MUST NOT depend on:

- runtime environment
- implementation heuristics
- non-deterministic iteration

---

## 7. Protocol Behavior

Lie-cost results MAY influence verification
analysis and reporting.

However, lie-cost evaluation MUST NOT alter
the deterministic verification verdict rules.

Verdicts remain determined by protocol
validation rules.

---

## 8. Reporting

Verification outputs SHOULD include:

- violation type
- associated lie-cost
- affected claims or attestations

Lie-cost reports MUST remain deterministic.

---

## 9. Compliance

An implementation is VERIFRAX-compliant only
if it:

- evaluates lie-cost deterministically
- assigns stable cost categories
- produces identical lie-cost outputs
across implementations

