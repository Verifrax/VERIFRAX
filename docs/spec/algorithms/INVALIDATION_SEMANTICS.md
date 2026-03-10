# VERIFRAX Invalidation Semantics

Status: Normative

---

## 1. Purpose

This document defines the invalidation semantics used by the
VERIFRAX protocol.

Invalidation determines when verification inputs cannot be trusted
and verification MUST terminate with the INVALIDATED outcome.

Invalidation ensures deterministic protocol behavior when
verification inputs become logically unusable.

---

## 2. Definition

Invalidation occurs when verification inputs fail to satisfy
protocol validity requirements.

Invalidation represents a deterministic protocol outcome.

Invalidated bundles cannot produce VERIFIED results.

---

## 3. Invalidation Conditions

Verification engines MUST invalidate bundles when any of the
following conditions occur:

- contradiction detection failure
- corrupted evidence artifacts
- malformed bundle structures
- invalid signature verification
- protocol version mismatch
- invalid certificate structure

---

## 4. Invalidation Stage

Invalidation evaluation MUST occur after contradiction detection
and before verdict generation.

Verification pipeline:

canonicalization  
→ serialization  
→ bundle hash derivation  
→ contradiction detection  
→ invalidation evaluation

---

## 5. Deterministic Evaluation

Invalidation evaluation MUST produce identical outcomes across
all compliant implementations.

Evaluation MUST NOT depend on:

- runtime environment
- implementation-specific heuristics
- non-deterministic iteration

---

## 6. Invalidation Outcome

When invalidation conditions are met:

- verification MUST terminate
- the verdict MUST be INVALIDATED
- the invalidation reason MUST be recorded

Invalidation represents a terminal protocol state.

---

## 7. Reporting

Verification engines SHOULD record:

- invalidation reason
- invalidation location
- affected evidence components

Invalidation reports MUST remain deterministic.

---

## 8. Protocol Integrity

Invalidation prevents the protocol from producing verification
results based on unusable inputs.

Verification engines MUST treat invalidation conditions as
non-recoverable protocol states.

---

## 9. Compliance

An implementation is VERIFRAX-compliant only if it:

- evaluates invalidation conditions deterministically
- terminates verification when invalidation occurs
- produces identical invalidation outcomes across implementations

