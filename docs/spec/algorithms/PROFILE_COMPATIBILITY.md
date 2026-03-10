# VERIFRAX Profile Compatibility Algorithm

Status: Normative

---

## 1. Purpose

This document defines the deterministic profile compatibility
algorithm used by the VERIFRAX protocol.

Profiles define verification constraints and execution
requirements.

The compatibility algorithm determines whether a verification
engine can process a bundle under a given profile.

---

## 2. Profiles

A profile defines verification rules including:

- verification strictness
- permitted evidence types
- required attestations
- verification constraints

Profiles are identified by deterministic profile identifiers.

---

## 3. Compatibility Requirement

Verification engines MUST verify profile compatibility before
executing verification.

If profiles are incompatible, verification MUST terminate.

---

## 4. Compatibility Inputs

Compatibility evaluation uses:

- bundle profile identifier
- verifier supported profiles
- protocol version

All inputs MUST be evaluated deterministically.

---

## 5. Compatibility Algorithm

Verification engines MUST execute the following steps:

1. read bundle profile identifier
2. determine supported verifier profiles
3. compare bundle profile against supported profiles
4. evaluate compatibility rules

If the bundle profile is unsupported or incompatible,
verification MUST terminate with INVALIDATED.

---

## 6. Deterministic Evaluation

Profile compatibility evaluation MUST produce identical
results across all compliant implementations.

Evaluation MUST NOT depend on:

- runtime environment
- implementation-specific heuristics
- non-deterministic ordering

---

## 7. Incompatibility Outcome

If profile incompatibility is detected:

- verification MUST terminate
- the bundle MUST be treated as INVALIDATED
- the incompatibility reason SHOULD be recorded

---

## 8. Protocol Integrity

Profile compatibility ensures that verification engines
do not process bundles under unsupported verification rules.

This protects deterministic verification behavior.

---

## 9. Compliance

An implementation is VERIFRAX-compliant only if it:

- evaluates profile compatibility deterministically
- rejects incompatible profiles
- produces identical compatibility outcomes
across implementations

