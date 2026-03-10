# VERIFRAX Normative Language

Status: Normative  
Applies to: All documents within docs/spec/

---

## 1. Purpose

This document defines the normative language used by the VERIFRAX
protocol specification.

Normative language determines which statements represent mandatory
protocol behavior required for compliant implementations.

All normative requirements in the specification MUST use the
terminology defined here.

---

## 2. Normative Keywords

The following keywords define protocol requirement strength.

### MUST

Indicates an absolute protocol requirement.

An implementation that violates a MUST requirement is not
VERIFRAX-compliant.

Example:

Verification engines MUST compute canonical bundle hashes using the
canonicalization algorithm defined by the specification.

---

### MUST NOT

Indicates an absolute prohibition.

Example:

Implementations MUST NOT modify evidence structures during verification.

---

### REQUIRED

Synonymous with MUST.

---

### SHALL

Synonymous with MUST.

Used primarily when defining deterministic protocol rules.

---

### SHALL NOT

Synonymous with MUST NOT.

---

### SHOULD

Indicates a strong recommendation.

Valid reasons MAY exist to deviate, but implications MUST be
fully understood.

---

### SHOULD NOT

Indicates discouraged behavior that may be acceptable only
under exceptional circumstances.

---

### MAY

Indicates optional protocol behavior.

Implementations MAY implement the behavior but are not required to.

---

### OPTIONAL

Synonymous with MAY.

---

## 3. Normative Scope

Normative protocol requirements appear only within:

docs/spec/

Documents outside this directory are informational and MUST NOT
modify protocol semantics.

---

## 4. Protocol Compliance

An implementation is VERIFRAX-compliant only if it:

1. Implements all normative protocol requirements.
2. Produces deterministic verification outcomes.
3. Passes official conformance suites when available.

---

## 5. Specification Authority

The authoritative specification consists of:

docs/spec/INDEX.md  
docs/spec/

No external documentation overrides the normative specification.

