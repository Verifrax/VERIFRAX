# VERIFRAX Minimal Verifier Binary Distribution

This document defines the distribution model for minimal VERIFRAX verifier binaries.

The objective is to make protocol verification usable outside the reference
repository while preserving deterministic behavior.

## Distribution Objective

A distributed minimal verifier must:

- execute deterministic verification
- preserve protocol failure taxonomy
- match reference verifier outputs
- remain reproducible from repository state

Binary distribution is a transport mechanism, not an authority layer.

## Supported Distribution Forms

The protocol may distribute minimal verifiers as:

- compiled Rust binaries
- containerized verifier images
- packaged release artifacts
- checksummed downloadable executables

All forms must remain traceable to the canonical repository state.

## Required Distribution Metadata

Every verifier binary distribution must include:

- verifier name
- protocol version
- source commit reference
- SHA256 checksum
- supported platform
- build instructions

Without this metadata, the binary distribution is incomplete.

## Deterministic Requirement

A distributed verifier binary must produce:

- identical verdict outputs
- identical failure classes
- identical finality states
- identical canonical terminal output

Any divergence from the reference verifier is non-conforming.

## Verification of Distributed Binaries

Consumers must be able to verify distributed binaries by:

1. checking checksum integrity
2. matching source commit lineage
3. reproducing the build from source
4. comparing outputs against conformance expectations

Trust in the binary must derive from reproducibility.

## Non-Conforming Distribution

A binary distribution is non-conforming if it:

- omits checksum data
- cannot be traced to repository state
- produces divergent verification results
- modifies protocol semantics

## Initial Distribution Model

The initial VERIFRAX minimal verifier distribution model is:

- Rust minimal verifier as the distributable binary baseline
- repository build instructions as the canonical build path
- release integrity manifests as the verification anchor

## Ecosystem Role

Binary distribution enables external operators to execute
VERIFRAX verification without embedding the entire repository.

This supports broader ecosystem adoption while preserving
deterministic trust boundaries.

