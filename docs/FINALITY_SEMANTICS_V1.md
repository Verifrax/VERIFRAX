# Finality Semantics V1

## Overview

Finality Semantics V1 defines the deterministic, non-negotiable rules for how VERIFRAX produces and maintains verdicts over claims, evidence bundles, and truth assertions.

## Core Principles

1. **Deterministic Verdicts**: Given identical inputs (bundle content, profile, contracts, schemas), any verifier must produce byte-identical verdict output.

2. **Unappealable Surface**: Only bundle content can change outcomes. Arguments, interpretations, or external state cannot alter a verdict once the bundle is frozen.

3. **Contradiction Detection**: Two claims with the same subject but incompatible assertions, both with valid signatures, must result in `CONTRADICTED` verdict.

4. **Retroactive Invalidation**: Invalidations are cryptographically bound and discoverable. Any matching invalidation downgrades the verdict with explicit reason codes.

5. **Profile-Based Legal Modes**: Different profiles (public, enterprise, legal_strict, regulator, forensics) define required evidence classes, trust assumptions, and failure severity mappings.

## Verdict Enum

The verdict enum is non-negotiable and must be one of:

- `VALID`: All evidence is consistent, all required attestations present, no contradictions, all signatures valid.
- `INVALID`: Missing required evidence, invalid signatures, hash mismatches, or schema violations.
- `INCONCLUSIVE`: Required evidence is present but insufficient to establish validity (e.g., missing attestations under strict profile).
- `CONTRADICTED`: Two or more claims with same subject have incompatible assertions, both with valid signatures.
- `UNSUPPORTED`: Bundle references unsupported schema version, contract version, or profile version.
- `NONCONFORMING`: Bundle structure violates required layout or manifest rules.

## Reason Code System

Reason codes follow the namespace: `VFX-<LAYER>-<####>`

### Layers

- `AXIOM`: Violations of fundamental axioms (e.g., unappealable surface)
- `CONTRACT`: Contract violations (missing fields, invalid structure)
- `EVIDENCE`: Evidence-related failures (missing, corrupted, mismatched)
- `EXEC`: Execution environment failures (non-deterministic, trace mismatch)
- `ENV`: Environment attestation failures (missing OS, arch, toolchain)
- `CHAIN`: Blockchain anchor failures (invalid proof, missing commitment)
- `SIG`: Signature failures (invalid signature, missing key, expired)
- `TIME`: Timestamp failures (clock skew, future timestamps, expired)
- `POLICY`: Policy violations (profile requirements not met)
- `PROFILE`: Profile-specific failures (unsupported profile, version mismatch)
- `LOG`: Logging/transparency failures (log root mismatch, missing entry)
- `INVALIDATION`: Retroactive invalidation matches

### Reason Code Format

Each reason code must include:
- Code: `VFX-<LAYER>-<####>` (e.g., `VFX-EVIDENCE-0001`)
- Name: Human-readable name
- Triggering Condition: Exact condition that triggers this code
- Required Proof Artifacts: What evidence must be present to prove this failure
- Deterministic Reproduction: Instructions to reproduce the failure
- Human-Readable Summary: One-line summary for humans

## Verdict Output Contract

Every verifier must output a `verdict.json` with the following structure:

```json
{
  "verdict": "VALID" | "INVALID" | "INCONCLUSIVE" | "CONTRADICTED" | "UNSUPPORTED" | "NONCONFORMING",
  "reason_codes": ["VFX-EVIDENCE-0001", "VFX-SIG-0002"],
  "reason_graph": {
    "claims": [...],
    "evidence": [...],
    "rules": [...],
    "failure_points": [...]
  },
  "counterfactuals": [
    {
      "condition": "If X evidence were present",
      "would_become": "VALID"
    }
  ],
  "profile_id": "public@1.0.0",
  "contract_hash": "sha256:...",
  "schema_hashes": ["sha256:...", "sha256:..."],
  "bundle_hash": "sha256:...",
  "verifier_build_hash": "sha256:...",
  "timestamp_utc": "2024-01-01T00:00:00Z",
  "lie_cost_score": 0.0,
  "attack_surface_summary": {
    "independent_bindings": 5,
    "contradiction_exposure": 0,
    "missingness_penalties": 0
  }
}
```

## Claim Structure

A claim is a first-class post-hoc dispute unit:

- `claim_id`: Unique identifier (UUID)
- `claim_type`: Type of claim (e.g., "media-finality", "build-provenance")
- `subject`: The artifact/run/person/system being claimed about
- `assertions[]`: Array of assertions made in this claim
- `evidence_refs[]`: References to evidence supporting the claim
- `profile_id`: Profile under which this claim is valid
- `issuer`: Who issued the claim (org, key_id)
- `issued_at`: ISO8601 timestamp

## Contradiction Rules

Two claims contradict if:
1. Same `subject` (by subject identifier)
2. Incompatible `assertions` (logically incompatible, not just different)
3. Both have valid signatures
4. Both are under the same or compatible profiles

When contradiction is detected:
- Verdict: `CONTRADICTED`
- Reason codes: `VFX-AXIOM-0001` (contradiction detected)
- Reason graph must cite which evidence invalidates which claim

## Invalidation Mechanism

Invalidations are retroactive and structural:

- `invalidation_id`: Unique identifier
- `targets[]`: Array of claim_id or bundle_hash being invalidated
- `basis`: Reason codes + evidence refs that justify invalidation
- `issuer`: Who issued the invalidation
- `issued_at`: ISO8601 timestamp
- `signature`: Cryptographic signature

Any verifier must check for matching invalidations and downgrade verdict accordingly with `VFX-LOG-` reason codes.

## Bundle Structure

Standard evidence pack layout:

```
bundle.json (manifest)
claims/
evidence/
artifacts/
contracts/
schemas/
profiles/
signatures/
transparency/
verdict.json
```

## Truth Index

Public truth index maintains:

- `index/claims.ndjson`: All claims (one per line)
- `index/bundles.ndjson`: All bundles (one per line)
- `index/invalidations.ndjson`: All invalidations (one per line)
- `index/edges.ndjson`: Claim ↔ evidence ↔ invalidation relationships

## Versioning

All components must be versioned:
- Schemas: Semantic versioning
- Contracts: Semantic versioning
- Profiles: Semantic versioning
- Verifier build: Semantic versioning
- Reason-code set: Semantic versioning

Changelog must include "verdict compatibility" section indicating whether verdicts for existing bundles remain valid.

## Done-Definition

"Dominance complete" only when:

1. Two contradictory claims cannot both remain VALID under the same profile
2. Any third party can reproduce the verdict offline
3. Invalidations are cryptographically bound and discoverable
4. The truth index prevents narrative rollback by reference

