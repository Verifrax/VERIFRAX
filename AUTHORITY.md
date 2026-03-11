# VERIFRAX Repository Authority Map

This document defines the active canonical repository surfaces for VERIFRAX and the interpretation boundary between normative, executable, registry, release-integrity, and historical material.

Its purpose is to remove ambiguity about which directories define protocol semantics, which directories execute maintained verifier logic, which directories record release authority, and which directories are historical only.

## Core rule

Only the canonical surfaces listed in this document define active repository authority.

No other directory defines protocol semantics, maintained verifier authority, active release freeze authority, or current conformance authority.

Historical, archived, experimental, generated, transitional, or superseded material outside these surfaces must not be interpreted as active protocol authority.

## Canonical active surfaces

### 1. Normative specification surface

- `docs/spec/`

This surface defines the normative protocol semantics.

It is the canonical source for:

- protocol definitions
- invariants
- state-machine behavior
- data-model semantics
- algorithm definitions
- failure semantics
- termination and finality rules
- authority relationships stated at the specification layer

Where executable implementations differ from the normative specification, the normative specification prevails.

### 2. Conformance surface

- `protocol-conformance/`

This surface defines canonical conformance suites, expected outputs, runner material, and versioned implementation-alignment targets.

It is the canonical source for:

- maintained conformance suites
- expected verdict fixtures
- suite versioning
- implementation compliance targets

Where a maintained verifier claims conformance, that claim must resolve against this surface.

### 3. Maintained verifier surface

- `verifier/`

This surface contains the active maintained verifier implementations.

Current active maintained verifier directories are:

- `verifier/node`
- `verifier/rust`

No archived verifier directory, superseded verifier root, or historical execution surface outside `verifier/` is active implementation authority.

### 4. Release-integrity surface

- `release-integrity/`

This surface defines active release-bound integrity material and freeze-bound release authority.

It is the canonical source for active release verification artifacts such as:

- `release-integrity/freeze-surfaces.json`
- `release-integrity/reference-verifier-hashes.json`
- `release-integrity/release-sha256-manifest.json`
- `release-integrity/genesis-lineage.json`

These files are the maintained canonical release metadata surfaces for active repository release verification and lineage resolution.

Where historical freeze-era directories differ from this surface, the active `release-integrity/` surface prevails.

### 5. Registry surface

- `registry/`

This surface contains maintained registry material for active repository interpretation, including verified implementation registration and other registry-bound protocol metadata.

It is the canonical source for maintained registry declarations used by the repository authority model.

### 6. Index surface

- `index/`

This surface contains maintained index material that points to active repository artifacts, release-linked materials, and authority-relevant references intended to support deterministic navigation and auditability.

It must point to current active surfaces rather than superseded historical locations.

### 7. Ecosystem documentation surface

- `docs/ecosystem/`

This surface contains explanatory ecosystem material, integration-facing documentation, and supporting repository interpretation documents aligned with the active authority structure.

It is informative unless a document explicitly states otherwise and is anchored by the normative specification and other canonical authority surfaces.

## Explicit non-authority surfaces

The following categories are not active protocol authority unless explicitly re-designated by the canonical surfaces above:

- `archive/`
- `release-history/`
- build output directories
- local tool output
- temporary material
- experimental material not incorporated into canonical surfaces
- superseded top-level directories retained only for historical continuity

### Archive rule

Anything under `archive/` is historical unless and until a canonical surface explicitly reactivates it.

### Release-history rule

Anything under `release-history/` is historical lineage material. It exists for continuity, audit traceability, and preservation of earlier repository states. It is not the active release-integrity authority surface.

## Conflict-resolution rule

If multiple repository locations appear to define the same subject, interpret them in this order:

1. `docs/spec/`
2. `protocol-conformance/`
3. `release-integrity/`
4. `registry/`
5. `index/`
6. `verifier/`
7. `docs/ecosystem/`

This order does not convert informative material into normative material. It exists to prevent ambiguous root resolution when duplicated or stale material remains in repository history.

## Maintainer interpretation rule

Maintainers, reviewers, auditors, implementers, and downstream integrators must use this authority map when deciding:

- which files govern active protocol semantics
- which verifier implementations are maintained
- which conformance suites are canonical
- which release-freeze declarations are authoritative
- which directories are historical only

## Operational consequence

A repository surface not listed in the canonical active surfaces section must not be treated as defining current VERIFRAX protocol authority.
