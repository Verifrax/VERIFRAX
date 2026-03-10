# VERIFRAX Evidence Bundle Data Model

Status: Normative

---

## 1. Purpose

This document defines the canonical evidence bundle structure
used by the VERIFRAX protocol.

The evidence bundle represents the complete verification input
processed by a verification engine.

All compliant implementations MUST interpret evidence bundles
according to the rules defined in this specification.

---

## 2. Evidence Bundle Definition

An evidence bundle is a deterministic container containing all
information required for verification.

The bundle includes:

- verification certificate
- claims
- attestations
- evidence artifacts
- verification metadata

The bundle MUST be self-contained.

---

## 3. Bundle Components

An evidence bundle consists of the following components.

### Certificate

Defines the verification context.

Fields include:

- protocol version
- verification profile
- bundle metadata

The certificate establishes the verification boundary.

---

### Claims

Claims represent statements being verified.

Claims MUST:

- be deterministic
- reference evidence artifacts
- be verifiable through attestations

---

### Attestations

Attestations provide cryptographic or procedural evidence
supporting claims.

Attestations MAY include:

- signatures
- supply chain provenance
- verification attestations
- external validation records

---

### Evidence Artifacts

Evidence artifacts represent external verification inputs.

Examples include:

- manifests
- SBOMs
- logs
- configuration data
- source references

Artifacts MUST be immutable during verification.

---

## 4. Deterministic Structure

Evidence bundles MUST follow a deterministic structure.

Required properties:

- explicit field ordering
- canonical serialization
- deterministic hashing

Implementations MUST NOT interpret bundles using
non-deterministic parsing behavior.

---

## 5. Bundle Integrity

Evidence bundles MUST be integrity-protected.

Bundle integrity is verified using:

- canonical hashing
- signature verification
- deterministic serialization

Any modification to the bundle invalidates the bundle hash.

---

## 6. Bundle Immutability

Evidence bundles MUST be immutable during verification.

Verification engines MUST treat bundles as read-only input.

Any modification of bundle contents invalidates verification.

---

## 7. Bundle Identity

Each bundle is uniquely identified by its canonical hash.

The canonical bundle hash represents the identity of the bundle.

Verification results MUST reference the canonical bundle hash.

---

## 8. Compliance

Implementations are VERIFRAX-compliant only if they:

- accept valid evidence bundles
- reject malformed bundles
- process bundle contents deterministically
- bind verification results to bundle identity

