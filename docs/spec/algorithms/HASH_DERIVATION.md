# VERIFRAX Deterministic Hash Derivation

Status: Normative

---

## 1. Purpose

This document defines the deterministic hash derivation rules used
by the VERIFRAX protocol.

Hash derivation establishes the identity of protocol artifacts
including:

- evidence bundles
- verification artifacts
- protocol objects

Deterministic hashing ensures that identical inputs produce
identical hash outputs across all compliant implementations.

---

## 2. Hash Function

The protocol uses the following hash function:

SHA-256

Implementations MUST compute hashes using the SHA-256 algorithm.

The hash output MUST be represented as lowercase hexadecimal.

Example:

e3b0c44298fc1c149afbf4c8996fb924...

---

## 3. Hash Input

Hashes MUST be computed over canonical serialized data.

The following process MUST be followed:

1. construct the protocol data structure
2. apply canonical serialization
3. compute SHA-256 over the serialized byte sequence

Any deviation from this sequence results in non-compliant hashing.

---

## 4. Bundle Hash Derivation

The bundle hash uniquely identifies an evidence bundle.

Bundle hash derivation:

1. serialize bundle using canonical serialization
2. compute SHA-256 of serialized bytes
3. represent result as lowercase hexadecimal string

The resulting value is the canonical bundle hash.

---

## 5. Hash Stability

Hash outputs MUST remain stable across implementations.

Two compliant implementations processing identical input MUST
produce identical hashes.

---

## 6. Hash Identity

Protocol objects referenced by hash MUST use canonical hash values.

Implementations MUST NOT alter or reinterpret hash values.

Hashes represent the immutable identity of protocol artifacts.

---

## 7. Hash Verification

Verification engines MUST verify that computed hashes match
expected hash values when provided.

Hash mismatches MUST produce a deterministic verification failure.

---

## 8. Collision Assumptions

Protocol security assumes the collision resistance of SHA-256.

Implementations MUST NOT substitute alternative hash algorithms
without a protocol version upgrade.

---

## 9. Compliance

An implementation is VERIFRAX-compliant only if it:

- computes hashes using SHA-256
- hashes canonical serialized data
- produces identical hashes for identical inputs

