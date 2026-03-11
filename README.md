# VERIFRAX

Deterministic verification protocol for irreversible evidence, auditable judgments, and stable protocol trust boundaries.

VERIFRAX is structured so that protocol semantics, conformance targets, maintained verifier implementations, release integrity material, and historical archives are separated into explicit repository authority surfaces.

This repository is intended to support deterministic verification outcomes that remain reproducible, inspectable, and resistant to silent semantic drift.

---

## Repository entry map

### Normative specification

- `docs/spec/`

This is the canonical specification root for protocol semantics, invariants, state-machine behavior, deterministic algorithms, failure semantics, and finality rules.

Primary entrypoint:

- `docs/spec/INDEX.md`

### Protocol conformance

- `protocol-conformance/`

This is the canonical conformance surface for maintained suites, expected verdicts, runners, and versioned implementation-alignment targets.

Active versioned suite root:

- `protocol-conformance/v2/`

### Maintained verifier implementations

- `verifier/`

This directory contains the active maintained verifier surfaces:

- `verifier/node`
- `verifier/rust`

These are the only active maintained verifier directories in the repository.

### Release integrity

- `release-integrity/`

This surface contains active release-integrity material, including freeze-bound release authority, manifests, and release verification metadata.

The active frozen release-surface declaration is:

- `release-integrity/freeze-surfaces.json`

### Registry

- `registry/`

This directory contains maintained registry material used by the repository authority model, including verified implementation registration and related protocol metadata.

### Index

- `index/`

This directory contains maintained repository index material pointing to active artifacts and authority-relevant references.

### Ecosystem and supporting documentation

- `docs/ecosystem/`

This surface contains ecosystem-facing and explanatory documentation aligned with the active repository structure.

### Repository authority map

- `AUTHORITY.md`

This document defines which repository surfaces are canonical and which are historical, archival, or otherwise non-authoritative.

---

## Interpretation rules

- `docs/spec/` defines normative protocol semantics.
- `protocol-conformance/` defines maintained conformance targets.
- `verifier/` contains the maintained active verifier implementations.
- `release-integrity/` defines active release-bound integrity and freeze-surface authority.
- `registry/` contains maintained registry declarations.
- `index/` contains maintained active index material.
- `docs/ecosystem/` provides supporting ecosystem documentation aligned with the canonical surfaces.

If material outside those surfaces appears to overlap with active protocol content, the canonical surfaces above prevail.

---

## Historical material

The following locations are historical and must not be interpreted as active protocol authority:

- `archive/`
- `release-history/`

`archive/` preserves superseded verifier or repository surfaces for historical continuity.

`release-history/` preserves earlier freeze-era and historical release material for audit lineage and repository traceability.

Historical material is retained for continuity, not for active protocol root resolution.

---

## Intended reader paths

### For specification and protocol review

Start with:

- `docs/spec/INDEX.md`

### For implementation conformance

Start with:

- `protocol-conformance/README.md`
- `protocol-conformance/v2/README.md`

### For maintained execution surfaces

Start with:

- `verifier/node/README.md`
- `verifier/rust/README.md`

### For release-bound integrity review

Start with:

- `release-integrity/`

### For repository authority resolution

Start with:

- `AUTHORITY.md`

---

## Repository design objective

VERIFRAX separates normative definition, executable verification, conformance enforcement, release-integrity declaration, and historical preservation so that the protocol can evolve without collapsing authority boundaries.

That separation is intentional and is part of the protocol-grade auditability model of the repository.

---

## Status model

This repository contains:

- normative protocol specification
- maintained conformance suites
- maintained Node and Rust verifier surfaces
- release-integrity and freeze-surface authority material
- registry and index support surfaces
- preserved historical archives

It does not treat archived or historical directories as active protocol authority unless explicitly re-designated by a canonical active surface.

