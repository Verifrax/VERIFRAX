# Contributing to VERIFRAX

VERIFRAX is maintained as a deterministic, authority-bounded protocol repository.

Contributions are accepted only when they preserve deterministic semantics, explicit authority boundaries, release-integrity discipline, and historical traceability.

## Core contribution rule

No contribution may introduce ambiguity about:

- normative protocol semantics
- active conformance authority
- maintained verifier authority
- release freeze authority
- registry and index interpretation
- historical versus active repository surfaces

The repository authority boundary is defined by `AUTHORITY.md`.

## Canonical active surfaces

Contributors must understand the active repository surfaces before proposing changes:

- normative specification: `docs/spec/`
- maintained conformance surface: `protocol-conformance/`
- maintained verifier surfaces: `verifier/node`, `verifier/rust`
- active release-integrity surface: `release-integrity/`
- maintained registry surface: `registry/`
- maintained index surface: `index/`
- ecosystem documentation: `docs/ecosystem/`

Historical material under `archive/` and `release-history/` is not active protocol authority.

## Branching and change flow

Contributions must follow this repository flow:

1. branch from `main`
2. make a tightly scoped change
3. keep the change aligned to the canonical repository surfaces
4. run relevant checks locally
5. open a Pull Request
6. merge only after required review and policy checks succeed

Direct pushes to protected release authority surfaces must not bypass repository policy.

## Pull Request standard

Each Pull Request should be:

- narrowly scoped
- path-specific
- authority-aware
- explicit about which canonical surface is being changed
- explicit about whether the change is normative, conformance-related, implementation-related, release-integrity-related, registry-related, index-related, or explanatory

PR descriptions should identify:

- why the change is needed
- which canonical surface is affected
- whether historical material is involved
- whether release-integrity or conformance implications exist
- whether any verifier behavior or expected outputs are affected

## Change classification

### Normative changes

Changes under `docs/spec/` are protocol-semantic changes.

They must not be mixed casually with unrelated editorial or operational updates.

### Conformance changes

Changes under `protocol-conformance/` affect implementation alignment and expected protocol behavior.

They must remain versioned, deterministic, and auditable.

### Verifier changes

Changes under `verifier/node` or `verifier/rust` affect maintained execution surfaces.

They must remain aligned with the normative specification, maintained conformance suites, and release-integrity surfaces.

### Release-integrity changes

Changes under `release-integrity/` affect active release verification authority.

They require especially careful review because downstream trust resolution may depend on them directly.

### Registry and index changes

Changes under `registry/` and `index/` must preserve accurate references to active maintained surfaces and must not point to superseded historical locations as if they were active authority.

### Historical changes

Changes under `archive/` or `release-history/` must preserve historical continuity and must not reactivate historical material implicitly.

## What contributors must not do

Contributors must not:

- treat archived material as active protocol authority
- introduce duplicate active conformance roots
- reintroduce obsolete verifier roots as maintained surfaces
- point active documentation to superseded freeze-era paths
- blur the distinction between explanatory and normative material
- change active release-integrity declarations without understanding downstream verification impact
- land broad mixed-scope changes that make authority review difficult

## Documentation standard

New files must be complete, explicit, and authority-aware.

Do not add placeholder files, ambiguous notes, or partial authority statements.

When a new document is added, it must clearly indicate whether it is:

- normative
- conformance-related
- implementation-related
- release-integrity-related
- registry/index related
- explanatory only
- historical only

## Reproducibility and verification expectation

Where applicable, contributors should verify that changes preserve:

- deterministic outputs
- conformance alignment
- release-integrity consistency
- path correctness for maintained surfaces
- historical demotion for archived materials

## Review expectation

Reviewers should reject contributions that weaken:

- deterministic authority resolution
- repository surface clarity
- release-integrity boundaries
- verifier surface clarity
- conformance-root clarity
- historical demotion of superseded material

## Final rule

A valid contribution improves the repository without making protocol authority harder to resolve.
