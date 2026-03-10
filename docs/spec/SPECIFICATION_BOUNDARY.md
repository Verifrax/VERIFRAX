# VERIFRAX Specification Boundary

Status: Normative

---

## 1. Purpose

This document defines the boundary between normative protocol
specification and informational documentation within the VERIFRAX
repository.

The boundary ensures that protocol semantics remain stable,
auditable, and resistant to accidental modification.

---

## 2. Normative Specification

The authoritative protocol specification consists exclusively of
documents located under:

docs/spec/

Normative protocol semantics may only be defined in this directory.

Documents inside docs/spec/ define:

- protocol rules
- deterministic algorithms
- canonical data structures
- protocol state machine behavior
- verification semantics
- compliance requirements

---

## 3. Informational Documentation

Documentation located outside docs/spec/ is informational.

Informational documentation may include:

- architecture explanations
- governance documentation
- operational procedures
- examples
- tutorials
- ecosystem descriptions

Informational documentation MUST NOT modify or override
normative protocol semantics.

---

## 4. Conflict Resolution

If any informational document conflicts with a normative
specification document, the normative specification SHALL prevail.

Implementations MUST follow the normative specification.

---

## 5. Specification Authority

The complete normative protocol specification is defined by:

docs/spec/INDEX.md  
docs/spec/NORMATIVE_LANGUAGE.md  
docs/spec/

No documentation outside this directory alters protocol behavior.

---

## 6. Implementation Rule

Protocol implementations MUST rely exclusively on the normative
specification for protocol behavior.

Informational documentation MUST NOT be treated as authoritative
protocol definition.

