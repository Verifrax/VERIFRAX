# VERIFRAX Protocol Compliance Badge System

This document publishes the compliance badge framework for VERIFRAX-certified implementations.

## Objective

The badge system exists to provide a visible and standardized signal
that an implementation has successfully demonstrated deterministic
conformance to VERIFRAX.

## Canonical Source

The canonical badge policy is defined in:

- badges/PROTOCOL_COMPLIANCE_BADGE_SYSTEM.md

## Badge Meaning

A VERIFRAX compliance badge means:

- certification was completed
- deterministic verification behavior was demonstrated
- the implementation matched the scoped protocol release

It does not mean:

- protocol ownership
- authority over semantics
- universal certification for future versions

## Badge Eligibility

Badge eligibility depends on:

- successful conformance certification
- verified implementation registry inclusion
- scoped release-specific certification validity

## Badge Stability

Badges are tied to implementation state and protocol release scope.

Any change in implementation state requires re-evaluation.

## Conclusion

The compliance badge system provides the public signaling layer
for deterministic protocol conformance in the VERIFRAX ecosystem.



Active repository authority is defined by `AUTHORITY.md`. Maintained conformance suites are under `protocol-conformance/`, with the active suite root at `protocol-conformance/v2/`. Active maintained verifier implementations are `verifier/node` and `verifier/rust`. Active release freeze authority is defined by `release-integrity/freeze-surfaces.json`.
