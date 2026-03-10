# VERIFRAX
SYS-003

STATUS: REGISTERED  
REGISTRY: https://speedkit.eu  
SNAPSHOT: https://speedkit.eu/REGISTRY_SNAPSHOT.json
---

**Deterministic verification for irreversible evidence, final judgments, and protocol‑grade trust boundaries.**

VERIFRAX is a protocol and reference implementation designed to produce deterministic, auditable verification outcomes from structured evidence.

It enforces strict boundaries between authority, verification logic, and enforcement so that verification results remain reproducible and resistant to silent drift.

---

![Determinism](https://img.shields.io/github/actions/workflow/status/Verifrax/VERIFRAX/determinism.yml?branch=main\&label=determinism)
![Integrity](https://img.shields.io/github/actions/workflow/status/Verifrax/VERIFRAX/integrity.yml?branch=main\&label=integrity)
![Reproducibility](https://img.shields.io/github/actions/workflow/status/Verifrax/VERIFRAX/verifier-reproducibility.yml?branch=main\&label=reproducibility)
![Fuzzing](https://img.shields.io/github/actions/workflow/status/Verifrax/VERIFRAX/cflite.yml?branch=main\&label=fuzzing)
![License](https://img.shields.io/github/license/Verifrax/VERIFRAX)
![Release](https://img.shields.io/github/v/tag/Verifrax/VERIFRAX?label=release)
![Protocol Baseline](https://img.shields.io/badge/protocol%20baseline-v1-blue)
![Engine Parity](https://img.shields.io/badge/engine%20parity-verified-success)

---

## Protocol baseline

Current protocol baseline:

```
verifrax-protocol-baseline-v1
```

The primitive verification layer has been hardened, verified, and frozen.

The freeze snapshot and verification records are available in:

```
docs/freeze/
docs/verification/
```

Protocol evolution after this baseline must follow formal evolution procedures.

---

# What VERIFRAX is

VERIFRAX is a deterministic verification protocol intended for environments where verification results must be reproducible, auditable, and structurally bounded.

It provides:

* deterministic verification outputs
* explicit failure codes and verdict contracts
* authority boundary enforcement
* reproducible verification execution
* hardened irreversible primitives
* protocol‑level governance and freeze discipline

VERIFRAX is not a generic workflow engine or advisory attestation tool. It is designed for verification surfaces where ambiguity or silent drift would undermine trust.

---

# Protocol architecture

The protocol separates authority, verification, and enforcement surfaces.

```
Authority
   ↓
Governance
   ↓
Verification Engine
   ↓
Irreversible Primitives
   ↓
Evidence / Verdict Output
```

This structure prevents verification components from acquiring implicit authority or modifying evidence evaluation rules without explicit governance procedures.

---

# Repository structure

## Core protocol implementation

```
core/
```

Contains canonical verification logic, schemas, contracts, and profiles.

Includes:

* verification engine
* contract definitions
* schema validation
* deterministic evaluation rules

---

## Primitive execution layer

```
engine/
```

Contains mirrored irreversible primitives used by the runtime engine.

Each primitive has an external source‑of‑truth implementation and a mirrored engine copy verified for byte‑level parity.

---

## Integration adapters

```
adapters/
```

Adapters provide verification integrations for external ecosystems such as:

* provenance
* SBOM verification
* compliance evidence
* signature verification

---

## CI verification surface

```
.github/workflows/
```

CI workflows enforce protocol invariants including:

* determinism validation
* schema integrity
* verifier reproducibility
* fuzz testing
* freeze protections
* governance boundary enforcement

CI in VERIFRAX acts as part of the protocol verification surface rather than only development automation.

---

# Primitive layer

VERIFRAX uses hardened irreversible primitives that define protocol‑level actions.

Primitives included in the baseline:

```
originseal
archicustos
kairoclasp
limenward
validexor
attestorium
irrevocull
guillotine
```

These primitives enforce specific verification behaviors including:

* origin anchoring
* custody recording
* time boundary enforcement
* verification rule execution
* witness attestation
* irreversible judgment
* termination discipline

Each primitive has been verified for:

* POSIX shell compatibility
* syntax correctness
* deterministic stdout behavior
* exit‑code classification
* runtime contract correctness
* engine ↔ standalone parity

---

# Verification profiles

Verification behavior is controlled by profiles located in:

```
core/profiles/
```

Available profiles include:

```
public
enterprise
forensics
legal_strict
regulator
regulator_strict
delivery_v1
```

Profiles determine verification strictness, evidence interpretation rules, and compatibility boundaries.

---

# Contracts and schemas

VERIFRAX treats protocol data structures as explicit contracts.

Contracts located in:

```
core/contracts/
```

Schemas located in:

```
core/schemas/
```

Examples include:

* evidence bundle schema
* attestation schema
* verdict schema
* invalidation schema

These schemas allow verification results to be machine‑verifiable and protocol‑stable.

---

# Using VERIFRAX

VERIFRAX can be used in several ways.

### GitHub Action

```
- uses: Verifrax/VERIFRAX@v1
  with:
    profile: public
    evidence: evidence.json
```

### Local verification

```
npm install
npm test

node ci/verify-reproducibility.mjs
node ci/verify-truth-index.mjs
```

### Reproducible build verification

```
bash BUILD_REPRODUCE.sh
bash build.sh
```

Operational usage may vary depending on verification profile and evidence structure.

---

# Protocol guarantees

VERIFRAX provides the following guarantees when used correctly.

### Deterministic verification

Equivalent inputs produce equivalent semantic verification results.

### Authority isolation

Verification logic cannot silently extend governance authority.

### Explicit verdict contracts

Verification outputs follow defined contract structures.

### Reproducibility

Verifier execution is checked in CI for reproducibility.

### Finality discipline

The protocol distinguishes provisional states from frozen states.

---

# Freeze record

The primitive layer freeze produced the following artifacts.

```
primitive-defect-ledger.md
primitive-verification-report.md
verification-artifacts-index.md
primitive-contract-baseline.md
engine-primitive-mirror-baseline.md
final-primitive-layer-snapshot.md
```

These documents form the permanent record of primitive layer verification.

---

# Documentation

Key protocol documentation:

```
INVARIANTS.md
CANONICAL.md
REPRODUCIBILITY.md
EVIDENCE_FINALITY.md
TRUST_BOUNDARY.md
```

Governance documentation:

```
docs/governance/
```

Verification records:

```
docs/verification/
```

Freeze snapshots:

```
docs/freeze/
```

---

# Security

Security and verification discipline documentation:

```
SECURITY.md
SAST_STANCE.md
docs/security/
```

---

# License

Distributed under the repository license located in:

```
LICENSE
```

---

# Maintained by

VERIFRAX

Deterministic verification, authority boundaries, and irreversible trust surfaces.
