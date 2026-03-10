# VERIFRAX Deterministic JSON Normalization

Status: Normative

---

## 1. Purpose

This document defines deterministic JSON normalization rules used
by the VERIFRAX protocol.

Normalization ensures that logically identical JSON structures
produce identical canonical structures prior to serialization,
hashing, and verification.

---

## 2. Input Requirement

Verification engines MUST accept JSON input that conforms to
RFC 8259.

Malformed JSON inputs MUST cause deterministic verification
failure.

---

## 3. Duplicate Keys

JSON objects MUST NOT contain duplicate keys.

If duplicate keys are detected:

- the bundle MUST be treated as INVALIDATED
- the violation MUST be recorded

Implementations MUST NOT silently resolve duplicate keys.

---

## 4. Whitespace Handling

Whitespace outside JSON string values MUST be ignored during
normalization.

Whitespace inside string values MUST be preserved exactly.

---

## 5. Unicode Handling

Strings MUST be interpreted as UTF-8.

Unicode escape sequences MUST be normalized to their canonical
UTF-8 representation.

Example:

\u0061 → a

Normalization MUST NOT change semantic string values.

---

## 6. Number Normalization

Numeric values MUST be interpreted as JSON numbers.

Implementations MUST reject numbers that are not valid JSON
numbers.

Normalization MUST remove representation differences such as:

1.0 → 1  
01 → invalid

Floating-point interpretation MUST NOT introduce rounding
differences across implementations.

---

## 7. Boolean Representation

Boolean values MUST remain exactly:

true  
false

Alternative representations are not permitted.

---

## 8. Null Representation

Null values MUST remain exactly:

null

---

## 9. Deterministic Requirement

Given identical logical JSON structures, normalization MUST
produce identical normalized structures across all compliant
implementations.

Normalization MUST NOT depend on:

- runtime environment
- parser implementation
- language-specific JSON behavior

---

## 10. Protocol Integration

JSON normalization MUST occur before:

- canonicalization
- deterministic sorting
- serialization
- bundle hash derivation

Normalization is the entry step of the verification pipeline.

---

## 11. Compliance

An implementation is VERIFRAX-compliant only if it:

- performs deterministic JSON normalization
- rejects duplicate object keys
- produces identical normalized structures across implementations

