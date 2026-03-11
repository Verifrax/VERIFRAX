# VERIFRAX Protocol Surface Freeze

## Purpose

Define the protocol surfaces that are frozen for each deterministic release of the VERIFRAX verification protocol.

A frozen surface guarantees that the protocol behavior cannot silently change for that release.

## Frozen Surfaces

The following surfaces are considered protocol-critical and must not change within a release.

### Protocol Specification

VERIFRAX specification documents defining protocol semantics.

Examples:

- VERIFRAX specification
- profile schemas
- protocol primitives definitions

### Verification Logic

Reference verification algorithms and deterministic execution rules.

Locations:

- verifier/node
- verifier/rust

### Protocol Conformance Suites

Canonical verification suites used to validate implementations.

Location:

protocol-conformance/

### Canonical Artifact Structures

Bundle formats and artifact serialization rules.

Examples:

- bundle.json
- verdict.json

### Canonical Hashing Rules

Rules that define deterministic hashing of protocol artifacts.

### Protocol Profiles

Profiles defining verification behavior under different contexts.

## Release Boundary

When a release is cut:

- the frozen surfaces above must remain byte-identical
- any change requires a new protocol release

## Allowed Changes Outside Freeze

The following areas may evolve without affecting protocol determinism:

- documentation improvements
- examples
- auxiliary tooling
- repository metadata

## Verification Guarantee

Any implementation verifying artifacts under a frozen release must produce identical results.

## Conclusion

Protocol surface freezing ensures that VERIFRAX releases are deterministic, auditable, and historically stable.

