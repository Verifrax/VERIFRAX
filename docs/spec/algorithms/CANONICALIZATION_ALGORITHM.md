# VERIFRAX Canonicalization Algorithm

Status: Normative

---

## 1. Purpose

This document defines the canonicalization algorithm used by
the VERIFRAX protocol.

Canonicalization converts protocol data structures into a
deterministic internal representation before serialization.

The purpose of canonicalization is to guarantee that logically
equivalent protocol objects produce identical serialized forms.

---

## 2. Canonicalization Requirement

All protocol objects MUST be canonicalized prior to serialization.

Canonicalization MUST ensure:

- deterministic field ordering
- deterministic structure normalization
- removal of ambiguous representations

Canonicalization MUST produce identical output across all
compliant implementations.

---

## 3. Object Canonicalization

Objects MUST be canonicalized as follows:

1. collect all object keys
2. sort keys lexicographically
3. reconstruct object using sorted keys
4. recursively canonicalize nested structures

Example:

Input:

{
"b":2,
"a":1
}

Canonical form:

{
"a":1,
"b":2
}

---

## 4. Array Canonicalization

Arrays MUST preserve original ordering.

Implementations MUST NOT reorder arrays unless explicitly
required by protocol rules.

Each array element MUST be canonicalized recursively.

---

## 5. Primitive Canonicalization

Primitive values MUST remain unchanged.

Primitive types include:

- strings
- numbers
- booleans
- null

Normalization MUST occur during serialization.

---

## 6. Nested Structures

Canonicalization MUST apply recursively.

All nested objects MUST be canonicalized before serialization.

---

## 7. Deterministic Output

Given identical logical structures, canonicalization MUST produce
identical canonical structures.

This requirement is critical for deterministic hashing and
cross-implementation reproducibility.

---

## 8. Protocol Integration

Canonicalization MUST occur before:

- serialization
- hashing
- signature verification

Canonicalization is the first deterministic step of the
verification pipeline.

---

## 9. Compliance

An implementation is VERIFRAX-compliant only if it:

- canonicalizes protocol objects deterministically
- preserves array ordering
- produces identical canonical structures across implementations

