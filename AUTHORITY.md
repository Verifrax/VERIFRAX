# VERIFRAX Repository Authority Map

This document defines the active repository surfaces for VERIFRAX and the interpretation boundary between normative, executable, registry, release-integrity, genesis, and historical material.

VERIFRAX authors normative source material.
VERIFRAX-SPEC publishes derived specification artifacts from VERIFRAX.
Derived specification artifacts are not upstream repository authority.
Governance authority is external and bound through AUCTORISEAL plus the governed repo set in `.github`.

Its purpose is to remove ambiguity about which directories define protocol semantics, which directories execute maintained verifier logic, which directories record release authority, which directories anchor the protocol genesis lineage, and which directories are historical only.

The authority map is intended for maintainers, auditors, implementers, and ecosystem integrators who must determine which repository locations define active protocol meaning.

---

# Core rule

Only the repository surfaces listed in this document define active repository authority.

No other directory defines protocol semantics, maintained verifier authority, active release freeze authority, or current conformance authority.

Historical, archived, experimental, generated, transitional, or superseded material outside these surfaces must not be interpreted as active protocol authority.

---

# Canonical active surfaces

## 1 — Genesis authority surface

Genesis authority defines the immutable root of the protocol lineage.

Active surfaces:

* `index/GENESIS_HASH.txt`
* `public/genesis/`
* `release-integrity/genesis-lineage.json`

Interpretation rules:

* `index/GENESIS_HASH.txt` defines the canonical genesis root.
* `public/genesis/` publishes the public genesis certificate and explanatory documentation.
* `release-integrity/genesis-lineage.json` binds the genesis root to the active repository release lineage.

No other file or directory defines genesis semantics.

Historical mirrors of the genesis root may exist under `release-history/`, but they must never be interpreted as defining a second genesis.

---

## 2 — Normative specification surface

* `docs/spec/`

This surface defines the normative protocol semantics authored in VERIFRAX.

It is the canonical source for:

* protocol definitions
* invariants
* state-machine behavior
* data-model semantics
* algorithm definitions
* failure semantics
* termination and finality rules
* authority relationships stated at the specification layer

Where executable implementations differ from the normative specification, the normative specification prevails.

---

## 3 — Conformance surface

* `protocol-conformance/`

This surface defines canonical conformance suites, expected outputs, runner material, and versioned implementation-alignment targets.

It is the canonical source for:

* maintained conformance suites
* expected verdict fixtures
* suite versioning
* implementation compliance targets

Where a maintained verifier claims conformance, that claim must resolve against this surface.

---

## 4 — Maintained verifier surface

* `verifier/`

This surface contains the active maintained verifier implementations.

Current active maintained verifier directories are:

* `verifier/node`
* `verifier/rust`

No archived verifier directory, superseded verifier root, or historical execution surface outside `verifier/` is active implementation authority.

---

## 5 — Release-integrity surface

* `release-integrity/`

This surface defines active release-bound integrity material and freeze-bound release authority.

It is the canonical source for active release verification artifacts such as:

* `release-integrity/freeze-surfaces.json`
* `release-integrity/reference-verifier-hashes.json`
* `release-integrity/release-sha256-manifest.json`
* `release-integrity/genesis-lineage.json`

These files are the maintained canonical release metadata surfaces for active repository release verification and lineage resolution.

Where historical freeze-era directories differ from this surface, the active `release-integrity/` surface prevails.

---

## 6 — Registry surface

* `registry/`

This surface contains maintained registry material for active repository interpretation, including verified implementation registration and other registry-bound protocol metadata.

It is the canonical source for maintained registry declarations used by the repository authority model.

---

## 7 — Index surface

* `index/`

This surface contains maintained index material that points to active repository artifacts, release-linked materials, and authority-relevant references intended to support deterministic navigation and auditability.

It must point to current active surfaces rather than superseded historical locations.

---

## 8 — Ecosystem documentation surface

* `docs/ecosystem/`

This surface contains explanatory ecosystem material, integration-facing documentation, and supporting repository interpretation documents aligned with the active authority structure.

It is informative unless a document explicitly states otherwise and is anchored by the normative specification and other canonical authority surfaces.

---

# Explicit non-authority surfaces

The following categories are not active protocol authority unless explicitly re-designated by the repository surfaces above:

* derived publication surfaces, including VERIFRAX-SPEC

* `archive/`
* `release-history/`
* build output directories
* local tool output
* temporary material
* experimental material not incorporated into canonical surfaces
* superseded top-level directories retained only for historical continuity

---

## Archive rule

Anything under `archive/` is historical unless and until a canonical surface explicitly reactivates it.

---

## Release-history rule

Anything under `release-history/` is historical lineage material.

It exists for:

* continuity
* audit traceability
* preservation of earlier repository states

It is **not** the active release-integrity authority surface.

---

# Conflict-resolution rule

If multiple repository locations appear to define the same subject, interpret them in this order:

1. `index/GENESIS_HASH.txt`
2. `docs/spec/`
3. `protocol-conformance/`
4. `release-integrity/`
5. `registry/`
6. `index/`
7. `verifier/`
8. `docs/ecosystem/`

This order does not convert informative material into normative material.

It exists to prevent ambiguous root resolution when duplicated or stale material remains in repository history.

---

# Maintainer interpretation rule

Maintainers, reviewers, auditors, implementers, and downstream integrators must use this authority map when deciding:

* which files govern active protocol semantics
* which verifier implementations are maintained
* which conformance suites are canonical
* which release-freeze declarations are authoritative
* which directories define the genesis authority chain
* which directories are historical only

---

# Operational consequence

A repository surface not listed in the **canonical active surfaces** section must not be treated as defining current VERIFRAX protocol authority.

If new authoritative surfaces are introduced, they must be explicitly added to this document before they can be considered part of the active repository authority model.
