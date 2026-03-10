# VERIFRAX Deterministic Error Classes

Status: Normative

---

## 1. Purpose

This document defines the deterministic error classification
model used by the VERIFRAX protocol.

Error classes ensure that verification engines report failures
using a consistent protocol-level vocabulary.

Deterministic error classification is required for:

- reproducible verification
- cross-implementation compatibility
- deterministic verification reports

---

## 2. Error Classification Requirement

All verification failures MUST be mapped to a defined
protocol error class.

Implementations MUST NOT emit undefined error categories.

---

## 3. Error Classes

The following protocol error classes are defined.

### INVALID_JSON

Input bundle contains malformed JSON.

### DUPLICATE_KEYS

JSON object contains duplicate keys.

### INVALID_STRUCTURE

Bundle structure violates the canonical evidence bundle model.

### HASH_MISMATCH

Computed hash differs from expected hash value.

### INVALID_SIGNATURE

Signature verification failed.

### CONTRADICTION_DETECTED

Contradictory claims detected within the evidence bundle.

### PROFILE_INCOMPATIBLE

Bundle profile is not supported by the verification engine.

### INVALIDATION_TRIGGERED

Invalidation rules determined the bundle cannot be verified.

### INTERNAL_PROTOCOL_ERROR

Implementation encountered a protocol-level execution error.

---

## 4. Deterministic Mapping

Implementations MUST map internal runtime errors to the
appropriate protocol error class.

Internal implementation details MUST NOT leak into protocol
error reporting.

---

## 5. Error Stability

Protocol error classes MUST remain stable across protocol
versions unless a version upgrade explicitly introduces new
error categories.

---

## 6. Error Reporting

Verification outputs SHOULD include:

- protocol error class
- error location
- affected bundle component

Error reporting MUST remain deterministic.

---

## 7. Deterministic Requirement

Given identical inputs, compliant implementations MUST
produce identical protocol error classes.

---

## 8. Compliance

An implementation is VERIFRAX-compliant only if it:

- uses defined protocol error classes
- maps internal errors to deterministic protocol errors
- produces identical error classifications across implementations

