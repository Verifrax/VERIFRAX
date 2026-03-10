# VERIFRAX Bundle Hash Derivation

Status: Normative

---

## 1. Purpose

This document defines the deterministic algorithm used to derive
the canonical bundle hash.

The bundle hash uniquely identifies an evidence bundle within
the VERIFRAX protocol.

Bundle hashes are used for:

- bundle identity
- verification reference
- deterministic verification outputs
- protocol reproducibility

---

## 2. Hash Derivation Pipeline

Bundle hash derivation MUST follow the deterministic pipeline
defined by the protocol.

Pipeline:

1. canonicalize bundle structure
2. serialize canonical bundle
3. compute SHA-256 of serialized bytes

This sequence MUST be followed exactly.

Implementations MUST NOT alter this order.

---

## 3. Canonicalization

The evidence bundle MUST first be canonicalized according to:

docs/spec/algorithms/CANONICALIZATION_ALGORITHM.md

Canonicalization ensures that logically identical bundles
produce identical canonical structures.

---

## 4. Serialization

The canonical bundle MUST be serialized according to:

docs/spec/algorithms/CANONICAL_SERIALIZATION.md

The output MUST be a deterministic byte sequence.

---

## 5. Hash Computation

The bundle hash is computed as:

SHA256(serialized_bundle)

The resulting value MUST be encoded as lowercase hexadecimal.

---

## 6. Bundle Identity

The bundle hash represents the immutable identity of the
evidence bundle.

Verification outputs MUST reference the bundle hash.

Any modification to bundle contents changes the bundle hash.

---

## 7. Deterministic Requirement

Two compliant implementations processing identical bundles
MUST produce identical bundle hashes.

Any divergence indicates non-compliant behavior.

---

## 8. Verification Integration

Bundle hash derivation MUST occur before:

- contradiction detection
- invalidation analysis
- signature verification
- verdict generation

The bundle hash anchors the verification process.

---

## 9. Compliance

An implementation is VERIFRAX-compliant only if it:

- follows the canonicalization → serialization → hash pipeline
- uses SHA-256
- produces identical bundle hashes across implementations

