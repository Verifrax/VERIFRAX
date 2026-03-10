# VERIFRAX Deterministic Sorting Rules

Status: Normative

---

## 1. Purpose

This document defines deterministic sorting rules used by the
VERIFRAX protocol.

Sorting rules ensure that protocol objects are processed in a
stable and identical order across all compliant implementations.

Deterministic ordering is required for:

- canonicalization
- serialization
- hashing
- verification reproducibility

---

## 2. Sorting Requirement

All collections that require ordering MUST follow deterministic
sorting rules defined by this specification.

Implementations MUST NOT rely on language-specific default
sorting behavior.

---

## 3. String Ordering

Strings MUST be sorted using bytewise lexicographic ordering
based on UTF-8 encoding.

Example ordering:

a  
aa  
ab  
b  

Sorting MUST compare raw UTF-8 byte sequences.

---

## 4. Object Key Sorting

Object keys MUST be sorted lexicographically using the string
ordering rules defined above.

This rule applies to all canonicalized protocol objects.

---

## 5. Deterministic Set Ordering

When protocol logic requires ordering of sets or unordered
collections, elements MUST be sorted using canonical ordering
rules before processing.

---

## 6. Numeric Sorting

Numeric values MUST be sorted using numeric comparison.

When numbers appear as strings they MUST follow string
ordering rules.

---

## 7. Nested Structures

Sorting rules MUST apply recursively when processing nested
objects or collections.

Nested collections MUST be sorted independently using the
same deterministic rules.

---

## 8. Deterministic Requirement

Given identical inputs, deterministic sorting MUST produce
identical ordering across all compliant implementations.

Sorting MUST NOT depend on:

- runtime environment
- locale settings
- implementation-specific libraries

---

## 9. Protocol Integration

Deterministic sorting MUST be applied during:

- canonicalization
- verification evaluation stages
- protocol comparison operations

---

## 10. Compliance

An implementation is VERIFRAX-compliant only if it:

- applies deterministic sorting rules
- produces identical ordering across implementations
- avoids runtime-dependent sorting behavior

