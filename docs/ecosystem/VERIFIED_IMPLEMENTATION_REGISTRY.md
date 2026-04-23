# VERIFRAX Verified Implementation Registry

This document defines the verified implementation registry for VERIFRAX.

The registry records independent implementations that have successfully
completed the protocol conformance certification process.

## Registry Objective

The registry exists to publish implementations that have demonstrated:

- deterministic verification behavior
- successful conformance certification
- reproducible execution
- compatibility with the protocol release boundary

Registry inclusion is evidence of conformance, not a source of protocol authority.

## Registry Location

Machine-readable registry:

- registry/VERIFIED_IMPLEMENTATIONS.json

## Entry Requirements

An implementation may be entered into the registry only if it:

1. completes the formal conformance certification process
2. passes the official conformance suites
3. matches canonical verifier outputs
4. preserves protocol failure taxonomy
5. remains reproducible from repository or declared source state

## Registry Fields

Each registry entry must include:

- implementation identifier
- implementation name
- implementation language or runtime
- verification status
- supported protocol release
- certification status
- source location
- notes

## Initial Verified Implementations

The initial registry includes:

- Node reference verifier
- Rust minimal verifier

These implementations establish the verified cross-implementation baseline
for the current protocol release.

## Registry Stability

Registry entries are tied to:

- a specific implementation
- a specific implementation version or source state
- a specific protocol release boundary

A later implementation revision requires independent re-evaluation.

## Non-Goals

The registry does not:

- grant authority over protocol semantics
- replace conformance certification
- override deterministic verification results

## Conclusion

The verified implementation registry provides the public record of
implementations that have demonstrated deterministic conformance to VERIFRAX.

Active repository authority is defined by `AUTHORITY.md`. Maintained conformance suites are under `protocol-conformance/`, with the active suite root at `protocol-conformance/v2/`. Active maintained verifier implementations are `verifier/node` and `verifier/rust`. Active release freeze authority is defined by `release-integrity/freeze-surfaces.json`.
