# VERIFRAX Failure Semantics

Status: Normative

---

## 1. Purpose

This document defines deterministic failure semantics for the
VERIFRAX verification protocol.

Failure semantics define how verification engines classify and
emit failures during protocol execution.

All compliant implementations MUST follow the failure semantics
defined here.

---

## 2. Deterministic Failure Requirement

Verification failures MUST be deterministic.

Given identical evidence bundles and protocol versions,
implementations MUST emit identical failure classes.

Failure outcomes MUST NOT depend on:

- runtime environment
- implementation language
- execution platform
- non-deterministic factors

---

## 3. Failure Classification

All failures MUST belong to a defined failure class.

Implementations MUST NOT emit undefined or implementation-specific
failure types.

Failure classes include:

- STRUCTURE_FAILURE
- CANONICALIZATION_FAILURE
- HASH_DERIVATION_FAILURE
- SIGNATURE_FAILURE
- EVIDENCE_FAILURE
- CONTRADICTION_FAILURE
- INVALIDATION_FAILURE
- POLICY_FAILURE
- INTERNAL_FAILURE

Failure classes MUST correspond to deterministic protocol states.

---

## 4. Failure Determinism

For any given verification input:

- the failure class MUST be identical
- the failure reason MUST be reproducible
- the failure location MUST be deterministic

Implementations MUST NOT emit variable failure outputs.

---

## 5. Failure Propagation

When a failure occurs in any verification state:

1. The failure MUST be classified.
2. The failure MUST be recorded.
3. The verification engine MUST transition to verdict generation.

No further verification states may be executed after a failure.

---

## 6. Failure Transparency

Verification engines MUST expose failure information sufficient
for independent reproduction.

Failure reports SHOULD include:

- failure class
- failure location
- failure reason

Failure reports MUST remain deterministic.

---

## 7. Failure Stability

Failure semantics MUST remain stable across protocol versions.

Changes to failure classification MUST occur only through
protocol version updates.

Implementations MUST NOT introduce new failure classes
outside the specification.

---

## 8. Compliance

A verification engine is VERIFRAX-compliant only if it:

- emits deterministic failure classes
- follows the failure propagation rules
- produces reproducible failure outputs

