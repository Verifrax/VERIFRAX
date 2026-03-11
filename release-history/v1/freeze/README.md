# Historical Freeze Surface Archive

This directory preserves earlier VERIFRAX freeze-era material strictly for historical continuity, audit lineage, and repository traceability.

It is not an active protocol authority surface.
It does not define current protocol semantics.
It must not be used as the canonical source for release verification, implementation targeting, protocol finality, or surface authority.

## Canonical authority

The authoritative frozen release surface for the active repository is defined by:

- `release-integrity/freeze-surfaces.json`

Where material in this directory differs from active repository authority, the active release-integrity surface prevails.

## Repository status

- Classification: archival
- Mutability: historical preservation only
- Normative authority: none
- Operational role: lineage retention, audit support, historical evidence preservation

## Mandatory interpretation rule

Consumers, implementers, auditors, downstream tooling, and governance processes must resolve active freeze-surface authority from `release-integrity/freeze-surfaces.json`, not from this directory.

## Scope note

This directory may contain prior freeze artifacts, release-bound snapshots, historical manifests, or earlier structural material retained solely to preserve chain-of-custody over repository evolution.
