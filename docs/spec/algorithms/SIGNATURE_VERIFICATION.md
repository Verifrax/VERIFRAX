# VERIFRAX Signature Verification Semantics

Status: Normative

---

## 1. Purpose

This document defines the signature verification semantics
required by the VERIFRAX protocol.

Signature verification ensures that protocol artifacts
originating from external entities can be authenticated.

Implementations MUST verify signatures deterministically.

---

## 2. Signature Scope

Signatures MAY appear in the following protocol artifacts:

- attestations
- certificates
- verification artifacts
- external evidence records

The protocol defines how signatures are verified but does
not mandate a single signature scheme for all use cases.

---

## 3. Verification Input

Signature verification requires:

- canonical serialized payload
- signature value
- public verification key

The payload MUST be serialized using the canonical
serialization algorithm defined by this specification.

---

## 4. Verification Process

Signature verification MUST follow this sequence:

1. obtain the canonical serialized payload
2. obtain the signature value
3. obtain the verification key
4. verify the signature against the payload

Verification engines MUST execute these steps deterministically.

---

## 5. Deterministic Verification

Given identical inputs:

- payload
- signature
- verification key

all compliant implementations MUST produce identical
verification results.

Signature verification MUST NOT depend on:

- runtime environment
- implementation-specific behavior
- non-deterministic cryptographic libraries

---

## 6. Verification Outcomes

Signature verification produces one of two outcomes:

VALID_SIGNATURE  
INVALID_SIGNATURE

Invalid signatures MUST produce a deterministic
verification failure.

---

## 7. Key Representation

Public verification keys MUST be represented in a
deterministic format.

Implementations MUST NOT reinterpret key encodings.

Key encoding rules MUST remain stable across protocol
versions.

---

## 8. Verification Integrity

Implementations MUST verify that:

- signature algorithm parameters are valid
- signature length is correct
- payload integrity is preserved

Any violation MUST produce deterministic failure.

---

## 9. Protocol Behavior

Signature verification failures MUST propagate according
to the protocol failure semantics.

Verification engines MUST treat invalid signatures as
deterministic verification failures.

---

## 10. Compliance

An implementation is VERIFRAX-compliant only if it:

- verifies signatures deterministically
- uses canonical serialized payloads
- produces identical verification outcomes for identical inputs

