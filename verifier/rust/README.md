# VERIFRAX Rust Verifier

`verifier/rust` is the maintained Rust verifier surface for VERIFRAX.

It provides a compiled-language verifier implementation aligned to the canonical specification and active conformance suites, and serves as the maintained Rust execution target within the repository authority structure.

## Repository authority context

This directory is one of the active maintained verifier surfaces in the repository.

Canonical related surfaces:

- Specification root: `docs/spec/INDEX.md`
- Conformance root: `protocol-conformance/`
- Release integrity root: `release-integrity/`
- Verified implementation registry: `registry/VERIFIED_IMPLEMENTATIONS.json`
- Ecosystem documentation: `docs/ecosystem/`

Historical verifier material under `archive/` is archival only and must not be interpreted as active verifier authority.

## Intended role

This implementation exists to provide:

- a maintained Rust verification surface
- deterministic verifier behavior suitable for conformance execution
- an auditable compiled-language implementation aligned with current repository authority

## Installation

### Local repository usage

From the repository root:

cd verifier/rust
cargo build --release

### Package publication target

This verifier is the maintained Rust crate publication surface for VERIFRAX.

When published, crate metadata must resolve from `verifier/rust/Cargo.toml`.

### Expected operator workflow

Typical local execution flow:

cd verifier/rust
cargo run --release

## Conformance alignment

Active conformance suites are maintained under:

- `protocol-conformance/v2/`

This verifier must track those versioned suites and must produce behavior consistent with the canonical expected outputs and failure semantics defined by the specification and conformance roots.

## Usage discipline

This directory is an implementation surface, not the normative definition of the protocol.

Normative semantics are defined under `docs/spec/`.
Conformance targets are defined under `protocol-conformance/`.
Release freeze authority is defined under `release-integrity/`.

## Publication rule

Any crate publication from this surface must preserve deterministic behavior, remain traceable to the repository release-integrity material, and stay aligned with the maintained conformance suites.

## Maintenance rule

Changes here must preserve deterministic behavior, remain auditable, and stay aligned with the canonical specification, conformance suites, and release-integrity surfaces.
