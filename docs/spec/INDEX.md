# VERIFRAX Protocol Specification

Status: Normative Specification  
Authority: VERIFRAX Protocol Governance  
Scope: Deterministic verification protocol

---

## 1. Protocol Overview

VERIFRAX defines a deterministic verification protocol designed to produce
auditable, reproducible verification outcomes from structured evidence.

The protocol enforces strict separation between:

- evidence
- verification logic
- authority
- enforcement

so that verification results remain reproducible and resistant to silent drift.

---

## 2. Specification Structure

The VERIFRAX specification is composed of the following normative components.

### Data Model

Defines the canonical structures used by the protocol.

- evidence bundle

Location:

docs/spec/data-model/

---

### Algorithms

Defines deterministic algorithms required for verification.

- canonicalization
- bundle hash derivation
- invalidation
- lie cost evaluation

Location:

docs/spec/algorithms/

---

### Interfaces

Defines protocol interaction surfaces.

- edge verification interface
- verification API

Location:

docs/spec/interfaces/

---

### State Machine

Defines the deterministic verification execution model.

Location:

docs/spec/state-machine/

---

## 3. Deterministic Protocol Guarantees

The protocol guarantees:

1. Deterministic verification
2. Reproducible evidence evaluation
3. Immutable verification outcomes
4. Explicit failure classification

Two independent implementations following this specification MUST produce
identical outputs for identical evidence bundles.

---

## 4. Normative vs Informational Documents

Normative specification documents reside under:

docs/spec/

Informational documentation resides under:

docs/

and does not modify protocol semantics.

---

## 5. Protocol Versioning

The protocol evolves through versioned releases.

Frozen protocol surfaces are recorded in:

- release-integrity/freeze-surfaces.json

Historical freeze-era and archival release material is preserved under:

- release-history/

Each protocol version contains:

- canonical specification
- maintained verifier alignment
- reproducible verification artifacts

---

## 6. Conformance

Implementations claiming VERIFRAX compatibility MUST implement:

- canonical evidence bundle structure
- deterministic verification algorithms
- protocol state machine
- failure classification rules

Implementation compliance is defined by the maintained versioned conformance suites under `protocol-conformance/`, including the active suite root at `protocol-conformance/v2/`.

---

## 7. Canonical Repository Surfaces

The canonical repository surfaces for active VERIFRAX protocol interpretation are:

- Specification root: `docs/spec/`
- Conformance root: `protocol-conformance/`
- Maintained verifier surfaces: `verifier/node`, `verifier/rust`
- Release-integrity root: `release-integrity/`
- Registry root: `registry/`
- Index root: `index/`
- Ecosystem documentation root: `docs/ecosystem/`
- Repository authority map: `AUTHORITY.md`

Historical directories such as `archive/` and `release-history/` are preserved for lineage and audit continuity but are not active protocol authority surfaces.

---

## 8. Authority

Protocol authority and governance are defined in:

docs/governance/

No specification document outside the normative specification root may
override protocol semantics.
