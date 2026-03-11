# VERIFRAX Release Integrity

This directory contains the active release-integrity surface for VERIFRAX.

It defines the canonical release-bound integrity materials used to verify frozen protocol surfaces, maintained verifier artifacts, release manifests, lineage continuity, and release evidence.

This directory is an active authority surface.

## Canonical role

`release-integrity/` is the canonical source for active release verification artifacts and machine-readable release-bound integrity metadata.

Where historical freeze-era material under `release-history/` differs from this directory, the active material in `release-integrity/` prevails for current repository authority resolution.

## Canonical files

### Freeze surface declaration

- `freeze-surfaces.json`

Defines the machine-readable frozen release surfaces for the active repository authority model.

This file is the authoritative active freeze surface definition.

### Reference verifier hash registry

- `reference-verifier-hashes.json`

Records canonical maintained verifier hash material used for active release verification.

### Release SHA-256 manifest

- `release-sha256-manifest.json`

Records release-bound digest material for canonical active release artifacts.

### Genesis lineage

- `genesis-lineage.json`

Defines lineage continuity for the active release history model and links current release integrity to the repository lineage anchor.

## Supporting release-integrity surfaces

### Evidence bundles

- `evidence/`

Contains release evidence bundles associated with active release verification.

### Verification transcripts

- `transcripts/`

Contains canonical verifier execution transcripts and transcript manifest material supporting release verification and audit inspection.

## Reproduction and verification model

Release verification must resolve through the active maintained verifier surfaces:

- `verifier/node`
- `verifier/rust`

Protocol semantics must resolve through:

- `docs/spec/`

Conformance expectations must resolve through:

- `protocol-conformance/`
- `protocol-conformance/v2/`

Repository authority resolution must resolve through:

- `AUTHORITY.md`

## Verification discipline

When verifying an active release, consumers, auditors, and downstream integrators should:

1. resolve the active frozen release surface from `freeze-surfaces.json`
2. verify release-bound artifact digests against `release-sha256-manifest.json`
3. verify maintained verifier identity and integrity against `reference-verifier-hashes.json`
4. confirm release lineage against `genesis-lineage.json`
5. inspect evidence and transcript support under `evidence/` and `transcripts/`
6. confirm implementation alignment against the maintained verifier and conformance surfaces

## Historical boundary

Historical freeze manifests, prior release snapshots, and superseded archival materials are preserved under:

- `release-history/`

Those materials are retained for lineage continuity and audit traceability, but they are not the active release-integrity authority surface.

## Interpretation rule

Files in this directory define active release integrity only. They do not independently redefine normative protocol semantics, which remain governed by `docs/spec/`.
