# VERIFRAX Verification Artifacts Index

This document defines the canonical index of verification artifacts used by VERIFRAX.

The purpose of the index is to give implementers, auditors, and operators
a single inventory of the files and directories that make up the
deterministic verification surface of the protocol.

## Index Objective

The verification artifacts index exists to identify:

- official conformance artifacts
- reference verifier implementations
- integrity manifests
- evidence bundles
- verification transcripts
- historical snapshots

The index improves discoverability without changing protocol semantics.

## Index Location

Machine-readable index:

- index/VERIFICATION_ARTIFACTS.json

## Artifact Classes

The index contains the following classes of artifacts:

- conformance suites
- verifier implementations
- release integrity manifests
- evidence bundles
- transcripts
- historical archives

Each indexed artifact has a defined protocol role.

## Inclusion Rule

An artifact belongs in the index only if it participates directly in:

- deterministic verification
- protocol reproducibility
- release integrity
- historical re-verification

Repository content outside these functions is not part of the index scope.

## Initial Indexed Artifacts

The initial index includes:

- protocol-conformance
- Node reference verifier
- Rust minimal verifier
- verifier hash registry
- release SHA256 manifest
- genesis lineage
- freeze surface manifest
- release evidence bundle
- verification transcripts
- historical release snapshot

## Stability Rule

The verification artifacts index must evolve only when the canonical
verification surface evolves.

Historical indexed artifacts must remain valid for the protocol release
under which they were published.

## Non-Goals

The index does not:

- certify implementations
- replace release manifests
- override verification semantics
- include non-verification repository content

## Conclusion

The verification artifacts index is the canonical inventory of the
artifacts that define and preserve VERIFRAX deterministic verification.

