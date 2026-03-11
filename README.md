# VERIFRAX

```
SYS-003
STATUS: REGISTERED
REGISTRY: https://speedkit.eu
SNAPSHOT: https://speedkit.eu/REGISTRY_SNAPSHOT.json
```

Deterministic verification for irreversible evidence, final judgments, and protocol-grade trust boundaries.

VERIFRAX is a protocol and maintained implementation surface designed to produce deterministic, auditable verification outcomes from structured evidence while preserving explicit authority boundaries between specification, conformance, execution, release integrity, and historical material.

---

![Determinism](https://img.shields.io/github/actions/workflow/status/Verifrax/VERIFRAX/determinism.yml?branch=main\&label=determinism)
![Integrity](https://img.shields.io/github/actions/workflow/status/Verifrax/VERIFRAX/integrity.yml?branch=main\&label=integrity)
![Reproducibility](https://img.shields.io/github/actions/workflow/status/Verifrax/VERIFRAX/verifier-reproducibility.yml?branch=main\&label=reproducibility)
![Fuzzing](https://img.shields.io/github/actions/workflow/status/Verifrax/VERIFRAX/clusterfuzzlite.yml?branch=main\&label=fuzzing)
![Protocol Baseline](https://img.shields.io/badge/protocol%20baseline-v1-blue)
![Spec](https://img.shields.io/badge/spec-VERIFRAX--SPEC-black)
![Engine Parity](https://img.shields.io/badge/engine%20parity-verified-green)

![Protocol](https://img.shields.io/badge/protocol-VERIFRAX-black)
![System ID](https://img.shields.io/badge/system-SYS--003-0A0A0A)
![Status](https://img.shields.io/badge/status-registered-brightgreen)
![Registry](https://img.shields.io/badge/registry-speedkit.eu-1f2328)
![Snapshot](https://img.shields.io/badge/snapshot-REGISTRY__SNAPSHOT.json-1f6feb)
![Branch](https://img.shields.io/badge/branch-main-2da44e)
![Tag](https://img.shields.io/badge/tag-v2.8.1-1f6feb)
![Specification](https://img.shields.io/badge/specification-normative-111111)
![Spec Root](https://img.shields.io/badge/spec%20root-docs%2Fspec-111111)
![Conformance](https://img.shields.io/badge/conformance-versioned-005cc5)
![Conformance Root](https://img.shields.io/badge/conformance%20root-protocol--conformance-005cc5)
![Verifier Surface](https://img.shields.io/badge/verifier-maintained-2da44e)
![Node Verifier](https://img.shields.io/badge/verifier%2Fnode-active-2da44e)
![Rust Verifier](https://img.shields.io/badge/verifier%2Frust-active-f0883e)
![Release Integrity](https://img.shields.io/badge/release%20integrity-active-2da44e)
![Freeze Surface](https://img.shields.io/badge/freeze%20surface-declared-0969da)
![Freeze Authority](https://img.shields.io/badge/freeze%20authority-release--integrity%2Ffreeze--surfaces.json-0969da)
![Authority Map](https://img.shields.io/badge/authority-AUTHORITY.md-critical)
![Registry Surface](https://img.shields.io/badge/registry%20surface-maintained-8250df)
![Index Surface](https://img.shields.io/badge/index%20surface-maintained-8250df)
![Ecosystem Docs](https://img.shields.io/badge/ecosystem%20docs-aligned-8250df)
![Historical Archives](https://img.shields.io/badge/history-preserved-lightgrey)
![Archive Boundary](https://img.shields.io/badge/archive-non--authoritative-lightgrey)
![Determinism Required](https://img.shields.io/badge/determinism-required-2da44e)
![Canonicalization](https://img.shields.io/badge/canonicalization-defined-2da44e)
![Bundle Hashing](https://img.shields.io/badge/bundle%20hashing-defined-2da44e)
![Contradiction Detection](https://img.shields.io/badge/contradiction%20detection-defined-2da44e)
![Invalidation](https://img.shields.io/badge/invalidation-defined-2da44e)
![Finality](https://img.shields.io/badge/finality-enforced-2da44e)
![Verdict Model](https://img.shields.io/badge/verdict%20model-deterministic-2da44e)
![Failure Semantics](https://img.shields.io/badge/failure%20semantics-explicit-2da44e)
![Implementation Neutrality](https://img.shields.io/badge/implementation-neutral-1f6feb)
![Interoperability](https://img.shields.io/badge/interoperability-targeted-1f6feb)
![Auditability](https://img.shields.io/badge/auditability-protocol--grade-1f6feb)
![Reproducibility Required](https://img.shields.io/badge/reproducibility-required-1f6feb)
![Governance](https://img.shields.io/badge/governance-defined-1f6feb)
![Contribution Discipline](https://img.shields.io/badge/contributions-authority--aware-1f6feb)
![Adversarial Posture](https://img.shields.io/badge/adversarial%20posture-explicit-d73a49)
![Legitimacy Signals](https://img.shields.io/badge/legitimacy%20signals-documented-d73a49)

## What VERIFRAX is

VERIFRAX is a deterministic verification protocol and repository architecture for:

* irreversible evidence evaluation
* canonical bundle verification
* explicit contradiction and invalidation handling
* reproducible final judgments
* auditable maintained verifier execution
* stable release-integrity boundaries
* long-horizon historical traceability

It is built so that independent implementations can converge on the same verification outputs without requiring hidden repository knowledge or ad hoc interpretation.

## Core protocol objective

VERIFRAX separates:

* normative semantics
* conformance targets
* maintained verifier execution
* release-integrity authority
* registry and index surfaces
* historical archives

This separation exists so that verification outcomes remain reproducible and resistant to silent drift, path confusion, archival substitution, and shadow-authority failure modes.

## Repository authority map

Active repository authority resolves through the following canonical surfaces:

* normative specification: `docs/spec/`
* conformance authority: `protocol-conformance/`
* maintained verifier surfaces: `verifier/node`, `verifier/rust`
* release-integrity surface: `release-integrity/`
* maintained registry surface: `registry/`
* maintained index surface: `index/`
* ecosystem documentation surface: `docs/ecosystem/`
* repository authority boundary: `AUTHORITY.md`

Historical materials remain preserved under:

* `archive/`
* `release-history/`

Those directories do not define active protocol authority unless explicitly re-designated by a canonical active surface.

## Repository entrypoints

### Specification

Primary normative entrypoint:

* `docs/spec/INDEX.md`

This surface defines:

* protocol invariants
* deterministic algorithms
* state-machine behavior
* failure semantics
* finality and termination rules
* verification contracts

### Conformance

Primary conformance entrypoints:

* `protocol-conformance/README.md`
* `protocol-conformance/v2/README.md`

This surface defines:

* maintained suites
* expected verdict outputs
* runner material
* implementation-alignment targets

### Maintained verifier surfaces

Execution entrypoints:

* `verifier/node/README.md`
* `verifier/rust/README.md`

These are the only maintained active verifier surfaces in the repository.

### Release integrity

Primary release-integrity entrypoint:

* `release-integrity/README.md`

Canonical active release metadata:

* `release-integrity/freeze-surfaces.json`
* `release-integrity/reference-verifier-hashes.json`
* `release-integrity/release-sha256-manifest.json`
* `release-integrity/genesis-lineage.json`

### Registry and index

Primary maintained records:

* `registry/VERIFIED_IMPLEMENTATIONS.json`
* `index/VERIFICATION_ARTIFACTS.json`

## Protocol architecture

VERIFRAX operates across five repository-level control layers.

### 1. Normative definition layer

`docs/spec/` defines what the protocol means.

This layer governs:

* bundle structure
* canonicalization
* contradiction detection
* invalidation
* signature verification semantics
* finality behavior
* deterministic failure classes

### 2. Conformance layer

`protocol-conformance/` defines what maintained implementations must match.

This layer governs:

* suite structure
* expected verdict outputs
* versioned compatibility targets
* execution alignment

### 3. Execution layer

`verifier/node` and `verifier/rust` define how maintained execution surfaces realize the protocol in practice.

This layer provides:

* maintained Node reference execution
* maintained Rust verifier execution
* auditable implementation surfaces
* reproducible verifier operation

### 4. Release-integrity layer

`release-integrity/` defines how active releases are frozen, hashed, traced, and verified.

This layer governs:

* release-freeze declarations
* verifier hash registries
* release manifests
* lineage continuity
* release evidence
* verification transcripts

### 5. Historical lineage layer

`archive/` and `release-history/` preserve superseded or historical material.

This layer exists for:

* audit continuity
* reconstruction
* lineage inspection
* long-horizon repository traceability

It is historical only.

## Deterministic verification model

A maintained VERIFRAX verification flow is expected to preserve the canonical order of operations:

1. evidence bundle validation
2. canonical normalization
3. profile compatibility evaluation
4. signature verification
5. contradiction detection
6. invalidation processing
7. verdict generation
8. finality enforcement

The repository is organized so that these semantics resolve first through `docs/spec/` and then through `protocol-conformance/`, with maintained verifier execution checked against those surfaces.

## Verification profiles

VERIFRAX supports profile-governed interpretation of evidence evaluation while preserving deterministic output rules.

Profile-sensitive behavior must still remain aligned with:

* normative specification
* canonical conformance suites
* maintained verifier execution
* release-integrity declarations

Profile variation must never become semantic ambiguity.

## Contracts and schemas

Protocol contract material includes:

* evidence bundle structures
* verifier verdict format expectations
* maintained release-integrity manifests
* implementation registry entries
* versioned conformance suite records

Contributors and implementers should treat schemas and manifests as boundary-defining protocol support surfaces, not as informal examples.

## Using VERIFRAX

### Review the protocol

Start here:

```
sed -n "1,220p" docs/spec/INDEX.md
```

### Review maintained conformance

Start here:

```
find protocol-conformance -maxdepth 2 -type f | LC_ALL=C sort
```

### Run the maintained Node verifier

```
cd verifier/node
npm install
node src/verifier.mjs
```

### Run the maintained Rust verifier

```
cd verifier/rust
cargo build --release
cargo run --release
```

### Review active release-integrity metadata

```
find release-integrity -maxdepth 2 -type f | LC_ALL=C sort
```

## Protocol guarantees

### Deterministic outputs

Identical maintained implementations given identical valid protocol inputs must converge on identical maintained outputs.

### Explicit authority boundaries

VERIFRAX prevents active authority from being inferred from historical or superseded surfaces.

### Reproducible release verification

Release integrity resolves through machine-readable manifests and verifier identity material.

### Historical continuity without historical authority

Historical material remains preserved without remaining ambiguously active.

## Adversarial posture

VERIFRAX assumes adversarial repository interpretation conditions, including:

* archived-material substitution
* path confusion
* shadow verifier authority
* unofficial conformance drift
* release-freeze ambiguity
* explanatory-document overreach
* historical surface impersonation

For that reason, deterministic verification is treated as insufficient unless authority resolution is also deterministic.

## Freeze record

Active freeze authority:

```
release-integrity/freeze-surfaces.json
```

Compatibility mirror retained for legacy workflow expectations:

```
freeze/FREEZE_SURFACE_MANIFEST.json
```

Historical freeze-era material:

```
release-history/v1/freeze/
release-history/v1/freeze-archive/
```

## Documentation index

### Specification

* `docs/spec/INDEX.md`

### Governance

* `docs/governance/AUTHORITY.md`
* `docs/governance/AUTHORITY_BOUNDARY.md`
* `docs/governance/GOVERNANCE.md`

### Ecosystem

* `docs/ecosystem/CONFORMANCE_CERTIFICATION_PROCESS.md`
* `docs/ecosystem/ECOSYSTEM_GOVERNANCE_FUTURE_EVOLUTION.md`
* `docs/ecosystem/VERIFIED_IMPLEMENTATION_REGISTRY.md`
* `docs/ecosystem/VERIFICATION_ARTIFACTS_INDEX.md`

### Operations and reproducibility

* `docs/REPRODUCIBLE_BUILD.md`
* `docs/PROTOCOL_SURFACE_FREEZE.md`

## Security and trust model

Repository trust depends on maintained alignment between:

* normative semantics
* conformance authority
* verifier execution
* release-integrity manifests
* registry declarations
* index references
* governance boundaries

A protocol claim is not trusted merely because it is present in the repository. It must resolve through the maintained canonical surfaces.

## Contributing

Contribution discipline is defined in:

* `CONTRIBUTING.md`

A valid change improves VERIFRAX without making protocol authority harder to resolve.

## License

See repository license metadata and associated licensing records in the repository.

## Maintained by

VERIFRAX is maintained as a protocol-first repository with explicit authority boundaries, deterministic execution discipline, and preserved historical continuity.
