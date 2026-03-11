# VERIFRAX Node Reference Verifier

`verifier/node` is the maintained Node.js reference implementation for VERIFRAX protocol verification.

It exists to provide a reproducible, auditable execution target aligned to the canonical VERIFRAX specification and the active protocol conformance suites.

## Repository authority context

This directory is one of the active maintained verifier surfaces in the repository.

Canonical related surfaces:

- Specification root: `docs/spec/INDEX.md`
- Conformance root: `protocol-conformance/`
- Release integrity root: `release-integrity/`
- Verified implementation registry: `registry/VERIFIED_IMPLEMENTATIONS.json`
- Ecosystem documentation: `docs/ecosystem/`

Historical verifier surfaces under `archive/` are archival only and are not active implementation authority.

## Intended role

This implementation is the primary Node.js execution surface for:

- running protocol verification against VERIFRAX evidence bundles
- validating conformance against canonical versioned suites
- serving as an auditable maintained reference for downstream implementations

## Conformance alignment

Active conformance suites are maintained under:

- `protocol-conformance/v2/`

Any maintained execution behavior in this verifier must remain aligned with the canonical suites and expected verdict material defined there.

## Usage discipline

Consumers and implementers should treat this directory as an execution surface, not as a substitute for the normative specification.

Normative semantics are defined by the specification under `docs/spec/`.
Executable conformance targets are defined under `protocol-conformance/`.
Release freeze authority is defined under `release-integrity/`.

## Maintenance rule

Changes here must preserve deterministic behavior, remain auditable, and stay aligned with canonical release-integrity and conformance surfaces.
