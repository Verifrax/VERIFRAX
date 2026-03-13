# VERIFRAX Genesis Lineage Policy

This document defines the governance rule for genesis continuity, future lineage creation, and prevention of ambiguous multi-genesis authority inside a single active repository lineage.

Its purpose is to ensure that VERIFRAX always preserves exactly one canonical genesis root for any active protocol lineage and that no future work introduces competing genesis interpretation inside the same authority tree.

## Core rule

An active VERIFRAX protocol lineage must have exactly one canonical genesis root.

That root is defined by:

- `index/GENESIS_HASH.txt`

No second active genesis root may be introduced into the same active repository lineage.

No file, directory, branch snapshot, release artifact, certificate, mirror, or documentation surface may be interpreted as defining an alternative active genesis unless a new lineage is explicitly created under the governance rules in this document.

## Canonical genesis authority chain

The active genesis authority chain resolves through:

- `index/GENESIS_HASH.txt`
- `public/genesis/`
- `release-integrity/genesis-lineage.json`
- `release-integrity/freeze-surfaces.json`
- `release-integrity/release-sha256-manifest.json`

These surfaces define the active genesis publication and active genesis lineage interpretation boundary.

Historical mirrors may preserve copies or snapshots of genesis-related material, but they do not create a second genesis.

## What does not create a new genesis

The following actions do not create a new genesis lineage by themselves:

- publishing a new certificate
- issuing a new release
- updating verifier implementations
- updating documentation
- adding historical mirrors
- adding audit records
- adding new conformance material
- adding new manifests that continue the same genesis root
- adding explanatory material under `docs/`
- preserving historical material under `release-history/` or `archive/`

These actions may extend, document, or verify the lineage, but they do not replace the genesis root.

## What would constitute a new genesis event

A new genesis event exists only if governance intentionally establishes a new protocol lineage root that is not the existing canonical value in:

- `index/GENESIS_HASH.txt`

That means a new genesis event requires an explicit decision to create a distinct lineage rather than continue the existing one.

Examples include:

- a deliberate protocol re-foundation
- a fork intended to operate as a distinct authority lineage
- a new system lineage that must not inherit the prior genesis root
- a governance-approved re-genesis event after an explicit authority break

## Repository rule for future genesis events

If a future genesis event is ever required, it must not be introduced as a second active genesis inside the same active repository lineage.

A future genesis event must use one of the following boundaries:

1. a separate repository, or
2. an explicitly segregated lineage branch that is governed and published as a distinct protocol lineage, or
3. a clearly re-designated repository authority model that archives the prior lineage and replaces it through an explicit governance transition

The default rule is the first option: use a separate repository.

This default exists because it minimizes ambiguity, prevents mixed-lineage interpretation, and protects downstream integrators from silent root substitution.

## Branch rule

Ordinary feature branches, maintenance branches, release branches, and historical restoration branches must not introduce a competing genesis root.

A branch is not allowed to become a second active genesis authority surface merely because it contains modified files.

If a branch is used for research, simulation, or migration planning involving a hypothetical new genesis, that branch must be clearly non-authoritative and must not be published as the active lineage without explicit governance transition.

## Historical preservation rule

Historical genesis-related material may be preserved for continuity and auditability.

Examples include:

- historical mirrors under `release-history/`
- archived verification artifacts
- prior release snapshots
- governance records describing lineage decisions
- audit logs and reproduction records

Historical preservation is allowed only when the historical material is clearly subordinate to the active genesis authority chain and cannot be misread as a second active genesis definition.

## Release-integrity rule

Release-integrity artifacts must continue to bind to the same canonical genesis root unless governance explicitly creates a new lineage.

In particular:

- `release-integrity/genesis-lineage.json` must continue to resolve to the active canonical genesis lineage
- `release-integrity/freeze-surfaces.json` must preserve the active genesis authority surfaces required for deterministic interpretation
- `release-integrity/release-sha256-manifest.json` must continue to hash the active genesis authority publication set for the active lineage

If governance ever authorizes a new lineage, the release-integrity surfaces for that lineage must be published in a way that does not create ambiguity with the prior lineage.

## Certificate rule

A certificate is not the genesis root.

A bundle hash is not the genesis root.

A certificate hash is not the genesis root.

Certificates, bundle hashes, and certificate hashes may attest to execution or publication events inside a lineage, but they do not replace the canonical genesis root.

## Integrator rule

Downstream integrators, auditors, maintainers, and verifiers must treat any attempt to introduce multiple active genesis roots in one active lineage as invalid unless an explicit governance transition says otherwise.

If conflicting genesis signals appear, integrators must resolve authority in this order:

1. `index/GENESIS_HASH.txt`
2. the active genesis authority chain
3. the governance documents defining lineage policy
4. historical materials only for audit and reconstruction

## Governance threshold for lineage replacement

A lineage replacement or re-genesis event is a protocol-governance event, not a routine repository change.

It must be accompanied by:

- explicit governance authorization
- explicit publication boundary definition
- explicit downstream interpretation guidance
- explicit historical treatment of the superseded lineage
- explicit release-integrity publication for the new lineage

Without those conditions, any proposed new genesis is invalid.

## Operational consequence

For the active VERIFRAX lineage, there is one canonical genesis root and one active genesis authority chain.

Any future genesis must be treated as a distinct governance event and must not be introduced as a competing active root inside the current active repository lineage.
