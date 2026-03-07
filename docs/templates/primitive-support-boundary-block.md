# VERIFRAX Primitive Support Boundary Block

Use this support-boundary block in every standalone primitive README.

## Canonical support-boundary block

This primitive is a bounded Verifrax primitive. It must be understood through its explicit contract only.

### Supported surface

- the canonical CLI entrypoint
- the documented input contract
- the documented output contract
- the documented exit behavior
- the documented deterministic behavior
- the documented package identity

### Unsupported assumptions

- undocumented library APIs
- undocumented flags or environment contracts
- undocumented integration behavior
- behavior inferred only from internal implementation details
- guarantees not stated in the README contract
- cross-primitive responsibilities owned by another primitive

### Boundary rule

If a behavior is not explicitly defined in the canonical README and package contract, it is outside the supported surface of this primitive.

## Rules

1. Every primitive README must define its support boundary explicitly.
2. The support boundary must be consistent with the CLI-first package category.
3. The support boundary must prevent consumers from treating shell internals as a stable API.
4. Primitive-specific exclusions may be added, but they may not weaken the canonical boundary rule.
5. No README may imply support for hidden, unstated, or speculative behavior.
6. Support language must remain precise, operational, and non-marketing.

