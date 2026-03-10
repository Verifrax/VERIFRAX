# VERIFRAX Canonical Serialization Algorithm

Status: Normative

---

## 1. Purpose

This document defines the canonical serialization algorithm used by
the VERIFRAX protocol.

Canonical serialization ensures that semantically identical data
structures produce identical serialized representations.

Deterministic serialization is required for:

- canonical hashing
- reproducible verification
- cross-implementation consistency

---

## 2. Deterministic Serialization Requirement

All protocol data structures MUST be serialized deterministically.

Given identical logical data structures, compliant implementations
MUST produce identical serialized byte sequences.

Serialization MUST NOT depend on:

- runtime environment
- language-specific serialization behavior
- memory layout
- non-deterministic iteration order

---

## 3. Serialization Format

Protocol structures MUST be serialized using canonical JSON.

Canonical JSON in VERIFRAX requires:

- UTF-8 encoding
- deterministic object key ordering
- normalized whitespace rules
- deterministic numeric representation

---

## 4. Object Key Ordering

Object keys MUST be serialized in lexicographic order.

Example:

Input structure:

{
"b":2,
"a":1
}

Canonical form:

{
"a":1,
"b":2
}

Implementations MUST sort keys before serialization.

---

## 5. Whitespace Rules

Canonical JSON MUST eliminate non-essential whitespace.

Allowed formatting:

- no trailing spaces
- no indentation
- minimal separators

Example canonical structure:

{"a":1,"b":2}

---

## 6. Numeric Representation

Numbers MUST use normalized decimal representation.

Rules:

- no leading zeros
- no unnecessary decimal precision
- no scientific notation unless required

Example:

1
1.5
0.25

---

## 7. Boolean Representation

Boolean values MUST be serialized as:

true
false

Lowercase values only.

---

## 8. Null Representation

Null values MUST be serialized as:

null

---

## 9. String Encoding

Strings MUST be encoded using UTF-8.

Escape sequences MUST follow standard JSON encoding rules.

---

## 10. Deterministic Output

The canonical serialization output MUST be identical across
all compliant implementations.

Any deviation from canonical serialization results in
non-compliant protocol behavior.

---

## 11. Serialization and Hashing

Canonical serialization MUST be applied before hash derivation.

The serialized byte sequence is the input used for:

- bundle hash computation
- signature verification
- deterministic verification outputs

---

## 12. Compliance

Implementations are VERIFRAX-compliant only if they:

- apply canonical serialization deterministically
- produce identical serialized output for identical structures
- use canonical serialization prior to hash computation

