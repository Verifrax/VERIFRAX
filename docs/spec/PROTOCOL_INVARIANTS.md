# VERIFRAX Protocol Invariants

Status: Normative

---

## 1. Purpose

This document defines the fundamental invariants of the VERIFRAX
verification protocol.

Protocol invariants represent properties that MUST always hold for
all compliant implementations.

Violation of any invariant results in protocol non-compliance.

---

## 2. Deterministic Verification

Verification MUST be deterministic.

Given identical evidence bundles and identical protocol versions,
all compliant implementations MUST produce identical verification
results.

Determinism includes:

- canonical data interpretation
- algorithm execution
- failure classification
- verdict generation

Two compliant implementations MUST NOT produce different verdicts
for identical input evidence.

---

## 3. Evidence Integrity

Evidence provided to the verification engine MUST remain unchanged
during verification.

Implementations MUST NOT modify:

- evidence bundles
- evidence manifests
- certificate structures
- attestation payloads

Verification MUST operate on the exact evidence provided.

---

## 4. Canonical Representation

All protocol data structures MUST have a canonical representation.

Canonical representation ensures that:

- identical semantic data produces identical hashes
- canonical serialization is deterministic
- canonical hashing is reproducible

Implementations MUST follow the canonicalization algorithms defined
in the protocol specification.

---

## 5. Verification Finality

Verification outcomes MUST be final.

Once a verification verdict has been produced for a given evidence
bundle and protocol version, that verdict MUST NOT change.

Finality guarantees that:

- verification results remain stable
- protocol history remains reproducible
- audit results remain trustworthy

---

## 6. Explicit Failure

All verification failures MUST produce explicit failure classes.

Verification engines MUST NOT produce ambiguous or undefined
failure states.

Failures MUST be classified according to the protocol failure
taxonomy.

---

## 7. Protocol Version Integrity

Verification MUST be executed against a specific protocol version.

Implementations MUST ensure that:

- protocol version is explicitly defined
- verification algorithms correspond to that version
- verification results are bound to the version used

Protocol behavior MUST NOT change silently across versions.

---

## 8. Implementation Independence

The protocol specification defines behavior independently of
implementation language or runtime environment.

All compliant implementations MUST produce identical results when
processing identical inputs under the same protocol version.

---

## 9. Reproducibility

Verification outcomes MUST be reproducible.

Independent auditors MUST be able to reproduce verification
results using:

- the same evidence bundle
- the same protocol version
- the same canonical algorithms

Reproducibility is a core requirement of protocol compliance.

---

## 10. Authority Boundary

Protocol semantics are defined exclusively by the normative
specification.

No implementation behavior may redefine or override protocol
rules.

Implementations MUST follow the normative specification.

