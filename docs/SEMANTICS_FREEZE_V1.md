# Public Semantics Freeze v1

**Tag**: `finality-semantics-v1`

**Date**: 2024-12-28

## Frozen Components

The following components are **IMMUTABLE** and **NON-NEGOTIABLE**:

### Verdict Enum

```typescript
type Verdict = 
  | "VALID"
  | "INVALID"
  | "INCONCLUSIVE"
  | "CONTRADICTED"
  | "UNSUPPORTED"
  | "NONCONFORMING";
```

**Status**: FROZEN. No additions, removals, or modifications allowed.

### Reason Code Namespace

Format: `VFX-<LAYER>-<####>`

Layers (FROZEN):
- AXIOM
- CONTRACT
- EVIDENCE
- EXEC
- ENV
- CHAIN
- SIG
- TIME
- POLICY
- PROFILE
- LOG
- INVALIDATION

**Status**: FROZEN. Layer list is immutable. Code assignments are immutable once assigned.

### Axioms

- `core/axioms/finality.axiom.json` - FROZEN
- `core/axioms/unappealable.axiom.json` - FROZEN

**Status**: FROZEN. Axioms cannot be modified or removed.

### Schemas

- `core/schemas/verdict.schema.json` - v1 FROZEN
- `core/schemas/reason.schema.json` - v1 FROZEN
- `core/schemas/claim.schema.json` - v1 FROZEN
- `core/schemas/invalidation.schema.json` - v1 FROZEN
- `core/schemas/attestation.schema.json` - v1 FROZEN

**Status**: v1 FROZEN. New versions may be added, but v1 remains immutable.

### Contracts

- `core/contracts/verdict.contract.json` - v1.0.0 FROZEN
- `core/contracts/claim.contract.json` - v1.0.0 FROZEN
- `core/contracts/attestation.contract.json` - v1.0.0 FROZEN

**Status**: v1.0.0 FROZEN. New versions may be added, but v1.0.0 remains immutable.

## Published Artifacts

The following are published and publicly accessible:

- `core/schemas/` - All schema definitions
- `core/contracts/` - All contract definitions
- `docs/VERDICT_SEMANTICS_REFERENCE.md` - Integration guide
- `docs/REASON_CODES.md` - Complete reason code playbook
- `docs/FINALITY_SEMANTICS_V1.md` - Core semantics specification

## Versioning Policy

- **Semantic Versioning**: All components use semantic versioning
- **Backward Compatibility**: New versions must maintain backward compatibility where possible
- **Breaking Changes**: Breaking changes require new major version
- **Freeze Notice**: This freeze applies to v1 only. Future versions may introduce changes.

## Enforcement

- Verifiers MUST support v1 semantics
- Verdicts MUST conform to v1 schema
- Reason codes MUST follow v1 namespace
- Axioms MUST be enforced

## Irreversibility

This freeze is **irreversible**. Once published:

- Verdict enum cannot change
- Reason code namespace cannot change
- Axioms cannot be removed
- v1 schemas and contracts remain immutable

## Proof of Authority

See `tests/irreversibility-demo.md` for demonstration that contradictory claims cannot both be VALID.

---

**FINALITY FIRST. NO COMPROMISES.**

