# VERIFRAX

```
SYS-003
STATUS: REGISTERED
REGISTRY: https://speedkit.eu
SNAPSHOT: https://speedkit.eu/REGISTRY_SNAPSHOT.json
```

Deterministic verification for irreversible evidence, final judgments, and protocol-grade trust boundaries.

VERIFRAX is a protocol and maintained implementation surface designed to produce deterministic, auditable verification outcomes from structured evidence while preserving explicit authority boundaries between specification, conformance, execution, release integrity, genesis authority, and historical material.

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
![Genesis Root](https://img.shields.io/badge/genesis-root%20anchored-2da44e)
![Genesis Certificate](https://img.shields.io/badge/genesis%20certificate-published-2da44e)
![Genesis Lineage](https://img.shields.io/badge/genesis%20lineage-tracked-2da44e)
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

---

## What VERIFRAX is

VERIFRAX is a deterministic verification protocol and repository architecture for:

* irreversible evidence evaluation
* canonical bundle verification
* explicit contradiction and invalidation handling
* reproducible final judgments
* auditable maintained verifier execution
* stable release-integrity boundaries
* explicit genesis authority anchoring
* long-horizon historical traceability

Independent implementations can converge on identical outputs without requiring hidden repository knowledge or ad hoc interpretation.

---

## Genesis anchor

The VERIFRAX protocol lineage begins from a single immutable genesis root.

Canonical genesis root:

```
index/GENESIS_HASH.txt
```

Public genesis certificate:

```
public/genesis/certificate.json
```

Genesis lineage record:

```
release-integrity/genesis-lineage.json
```

Human-readable genesis documentation:

```
docs/genesis/GENESIS_CHAIN.md
```

The genesis root defines the immutable origin of the protocol lineage and must never change.

---

## Repository authority map

Active repository authority resolves through the following repository surfaces:

* normative specification: `docs/spec/`

VERIFRAX authors normative source material.
VERIFRAX-SPEC publishes derived specification artifacts from VERIFRAX.
Derived artifacts are not upstream repository authority.
Governance authority is external and bound through AUCTORISEAL plus the governed repo set in `.github`.
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

These directories never define active protocol authority.

---

## Repository entrypoints

### Specification

Primary normative entrypoint in VERIFRAX authoring source:

```
docs/spec/INDEX.md
```

### Conformance

Primary conformance entrypoints:

```
protocol-conformance/README.md
protocol-conformance/v2/README.md
```

### Maintained verifier surfaces

```
verifier/node/README.md
verifier/rust/README.md
```

### Release integrity

```
release-integrity/README.md
```

Canonical active metadata:

```
release-integrity/freeze-surfaces.json
release-integrity/reference-verifier-hashes.json
release-integrity/release-sha256-manifest.json
release-integrity/genesis-lineage.json
```

---

## Protocol architecture

VERIFRAX operates across five repository-level control layers.

### Normative layer

`docs/spec/`

Defines protocol semantics.

### Conformance layer

`protocol-conformance/`

Defines implementation alignment targets.

### Execution layer

`verifier/node`

`verifier/rust`

Defines maintained execution surfaces.

### Release-integrity layer

`release-integrity/`

Defines frozen release surfaces and manifests.

### Historical lineage layer

`archive/`

`release-history/`

Preserves historical material only.

---

## Deterministic verification model

Canonical execution order:

1. bundle validation
2. canonical normalization
3. profile compatibility
4. signature verification
5. contradiction detection
6. invalidation processing
7. verdict generation
8. finality enforcement

---

## Protocol guarantees

### Deterministic outputs

Identical implementations must converge on identical outputs.

### Explicit authority boundaries

Authority cannot be inferred from historical or archived surfaces.

### Reproducible release verification

Release integrity resolves through deterministic manifests and verifier identity records.

### Historical continuity without historical authority

Historical records remain preserved without remaining authoritative.

---

## Using VERIFRAX

Review protocol:

```
sed -n "1,220p" docs/spec/INDEX.md
```

Run Node verifier:

```
cd verifier/node
npm install
node src/verifier.mjs
```

Run Rust verifier:

```
cd verifier/rust
cargo run --release
```

Inspect release metadata:

```
find release-integrity -maxdepth 2 -type f | LC_ALL=C sort
```

---

## Contributing

Contribution discipline is defined in `CONTRIBUTING.md`.

Valid contributions must preserve deterministic protocol authority resolution.

---

## License

See repository licensing metadata.

---

## Maintained by

VERIFRAX is maintained as a protocol-first repository with deterministic verification discipline and explicit authority boundaries.
