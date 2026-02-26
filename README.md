# SYS-003 · VERIFRAX

[![Status](https://img.shields.io/badge/status-live--public-success)](#public-authority--freeze-statement)
[![Authority](https://img.shields.io/badge/authority-v2.7.0--frozen-black)](#version--authority-model-non-negotiable)
[![Runtime](https://img.shields.io/badge/runtime-v2.8.0-blue)](#runtime--discovery-layer-v280-live)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![CodeQL](https://github.com/Verifrax/VERIFRAX/actions/workflows/codeql.yml/badge.svg)](https://github.com/Verifrax/VERIFRAX/actions)
[![Scorecard](https://github.com/Verifrax/VERIFRAX/actions/workflows/scorecard.yml/badge.svg)](https://github.com/Verifrax/VERIFRAX/actions)
[![Release](https://img.shields.io/github/v/release/Verifrax/VERIFRAX?sort=semver)](https://github.com/Verifrax/VERIFRAX/releases)
[![Signed Commits](https://img.shields.io/badge/commits-signed-brightgreen)](#public-freeze--governance)
[![Branch Protection](https://img.shields.io/badge/branch-main--protected-critical)](#public-freeze--governance)

---

```
SYS-003
VERIFRAX
Deterministic verification

STATUS: REGISTERED
REGISTRY: https://speedkit.eu
SNAPSHOT: https://speedkit.eu/REGISTRY_SNAPSHOT.json
```

Registered system. Identity governed by SPEEDKIT registry.

---

# VERIFRAX

Deterministic verification system with irreversible governance enforcement.

VERIFRAX operates as:

* A publicly frozen authority engine
* A forward-only governance model
* A GitHub-native deterministic CI gate
* A publicly auditable verification surface

---

# GitHub Action (Marketplace)

Use VERIFRAX as a deterministic CI gate.

## Usage

```yaml
name: verifrax

on:
  pull_request:
  push:

jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout
      - uses: Verifrax/VERIFRAX
        with:
          mode: enforce
          config: .verifrax/gate.yml
          fail_on_warn: "false"
          working_directory: .
          log_level: normal
```

## Inputs

| name | default | meaning |
|---|---|---|
| `mode` | `enforce` | `enforce` = fail-closed, `audit` = non-blocking |
| `config` | `.verifrax/gate.yml` | gate config path |
| `fail_on_warn` | `false` | treat warnings as failure |
| `working_directory` | `.` | run gate from this dir |
| `log_level` | `normal` | `silent` | `normal` | `debug` |

## Outputs

| name | values |
|---|---|
| `decision` | `pass` | `warn` | `fail` |

---

# PUBLIC AUTHORITY & FREEZE STATEMENT

**STATUS:** LIVE · PUBLIC · FORWARD-ONLY
**PUBLIC EXECUTION ENDPOINT:** [https://api.verifrax.net](https://api.verifrax.net)

VERIFRAX produces:

> One execution → One certificate → Final.

Verification authority is immutable once frozen.

See:

* `CANONICAL.md`
* `ADVERSARIAL_FAQ.md`
* `AUTHORITATIVE_SCOPE.md`

---

# SYSTEM OVERVIEW

VERIFRAX enforces:

* Deterministic execution
* Immutable authority boundaries
* Cryptographic build attestation
* Forward-only governance
* Independent certificate verification

Designed for high-trust and regulated environments.

---

# VERSION & AUTHORITY MODEL (NON-NEGOTIABLE)

## AUTHORITATIVE ENGINE — v2.7.0 (FROZEN)

Authority is anchored to immutable artifacts:

* `freeze/v2.6.0/`
* `verifrax-engine/execute_v2_6_0.js`
* `verifrax-reference-verifier/src/verify_v2_6_0.js`
* `SYSTEM_IDENTITY.*`
* `BUILD_HASH.txt`

These define all authoritative behavior.

No runtime or infrastructure mutation can alter outcomes without a new freeze.

---

## RUNTIME / DISCOVERY LAYER — v2.8.0 (LIVE)

Runtime evolves independently of authority.

Includes:

* Public API surface
* Payment integration
* Tiered execution classes
* Operational monitoring

Authority remains anchored to v2.7.0.

---

# EXECUTION GUARANTEE

Each verification request:

1. Produces exactly one certificate
2. Cannot be re-executed with altered outcome
3. Is independently verifiable offline
4. Does not require VERIFRAX infrastructure for validation

No silent mutation path exists.

---

# CERTIFICATE MODEL

Certificates contain:

* Evidence hash
* Execution trace
* Deterministic output
* Authority version reference
* Build attestation reference

Validated via the reference verifier.

---

# GENESIS CERTIFICATE

First paid production verification: **2026‑01‑24**

```
d7c23b65887c0ef554555b231c59935f6e2717586b54a68da8dc49b0bc61731b
```

See: `public/genesis/certificate.json`

---

# PUBLIC FREEZE & GOVERNANCE

## Production Freeze

* Freeze Tag: `freeze-v2.8.0`
* Authority Version: v2.7.0
* Runtime Version: v2.8.0
* Deployment Date: 2026‑01‑24

Future authoritative changes require:

1. New frozen engine snapshot
2. Updated authority declaration
3. Public freeze publication
4. Signed release

---

## Repository Hardening

Main branch:

* Protected
* Linear-history enforced
* Signed commits required
* Strict status checks required
* CODEOWNERS enforced
* Admin bypass disabled

Required status contexts:

* `spec`
* `verify-integrity`
* `Freeze Guard / freeze-protection (push)`
* `UI Contract - Non-Authority Constraints / enforce-ui-non-authority (push)`

All CI workflows are SHA-pinned.

---

# SECURITY MODEL

Includes:

* CodeQL analysis
* OpenSSF Scorecard
* ClusterFuzzLite fuzzing
* Determinism integrity checks
* Governance boundary enforcement

Security policy: `.github/SECURITY.md`

---

# INSTALLATION (REFERENCE VERIFIER)

```bash
git clone https://github.com/Verifrax/VERIFRAX.git
cd VERIFRAX
node verifrax-reference-verifier/src/verify_v2_6_0.js certificate.json
```

Offline verification supported.

---

# WHAT THIS REPOSITORY IS

* Deterministic verification engine
* Governance enforcement system
* Immutable execution contract
* GitHub Action surface

---

# WHAT THIS REPOSITORY IS NOT

* Not a blockchain
* Not mutable SaaS logic
* Not a scoring engine
* Not a human review service
* Not dynamic policy infrastructure

---

# CANONICAL REFERENCES

* Specification: [https://verifrax.net/spec](https://verifrax.net/spec)
* Registry: [https://speedkit.eu](https://speedkit.eu)
* Authority Scope: `AUTHORITATIVE_SCOPE.md`
* Legal Position: `LEGAL_POSITION.md`

---

# RELEASE DISCIPLINE

* Semantic versioning
* Signed tags
* Immutable release artifacts
* SBOM attached to releases
* Provenance attestations enabled

Major alias tags maintained (`v1`).

---

# GOVERNANCE PRINCIPLES

* Forward-only
* Deterministic outcomes
* Public authority declaration
* No retroactive mutation
* Explicit freeze model

---

# FINALITY

State: **Immutable Authority · Evolving Runtime**
Direction: **Forward-only**

Any deviation without a new freeze declaration is invalid.

---

© 2026 VERIFRAX · SYS‑003
