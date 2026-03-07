# VERIFRAX Primitive README Structure

This document freezes the canonical README section order for the Verifrax primitive layer.

This README structure is normative for:

- standalone primitive repositories
- npm package landing surfaces
- public documentation consistency
- engine parity references
- release-readiness review

## Canonical README order

Every primitive README must use this exact section order:

1. Title
2. Primitive identity line
3. One-line description
4. Status
5. Purpose
6. What This Primitive Does
7. What This Primitive Does Not Do
8. Behavioral Contract
9. Usage
10. Determinism Guarantees
11. Security Model
12. Relationship to Other Primitives
13. Installation
14. License

## Canonical section definitions

### 1. Title
The primary README title must be the canonical uppercase primitive name.

### 2. Primitive identity line
This line must state the primitive ID and canonical identity with no drift.

### 3. One-line description
This line must summarize the primitive in one precise sentence.

### 4. Status
This section must state the current maturity and release condition honestly.

### 5. Purpose
This section must explain why the primitive exists in the Verifrax system.

### 6. What This Primitive Does
This section must define positive responsibilities only.

### 7. What This Primitive Does Not Do
This section must define scope exclusions and prevent role confusion.

### 8. Behavioral Contract
This section must define invocation model, input behavior, output behavior, and exit behavior.

### 9. Usage
This section must provide command examples aligned to the package category rule.

### 10. Determinism Guarantees
This section must define what is deterministic and what assumptions exist.

### 11. Security Model
This section must define the protection boundary, assumptions, and failure surface.

### 12. Relationship to Other Primitives
This section must place the primitive in the canonical primitive order.

### 13. Installation
This section must provide the canonical install surface for npm distribution.

### 14. License
This section must state the project license cleanly and consistently.

## Rules

1. Section order must remain exactly as defined above.
2. Section names must remain stable unless changed through governance.
3. Primitive-specific content may differ, but structure may not drift.
4. No README may omit a canonical section.
5. Additional subsections are allowed only inside canonical sections, not as replacements for them.
6. README structure must support CLI-first packaging and public release readiness.

## Constraint

No primitive README or package landing surface may contradict this README structure.
