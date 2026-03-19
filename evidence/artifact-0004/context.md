# Artifact-0004 — Authority-Governed CORPIFORM Execution Proof

## Purpose

Artifact-0004 records the first VERIFRAX evidence object that binds an authority-governed CORPIFORM execution to its emitted receipt as one immutable verification line.

Artifacts 0001–0003 established repository integrity, bootstrap continuity, component surfaces, and earlier execution-chain status. They did not yet bind a concrete CORPIFORM execution artifact produced under a consumed authority object and preserved inside VERIFRAX evidence.

Artifact-0004 closes that gap by recording, in one place:

- the consumed command object
- the consumed authority seal object
- the emitted CORPIFORM receipt
- raw and canonical receipt digests
- the exact CORPIFORM runtime commit on `main` that corrected receipt authority identity binding

This artifact therefore advances the stack from component existence to recorded orchestration behavior.

## Scope of Claim

This artifact makes a bounded claim.

It does claim that:

- CORPIFORM `main` at commit `f257493` executed command `cmd-valid-001`
- the execution consumed authority object `seal-valid-001`
- the emitted receipt binds the same `command_id` and `authority_seal_id`
- the resulting receipt was preserved in VERIFRAX as immutable evidence

It does not claim that:

- the recorded authority seal is a production cryptographic authority proof
- AUCTORISEAL main currently publishes this exact fixture seal as a canonical public authority object
- this single execution proves full production readiness of the complete stack

Those stronger claims are outside the evidence presently frozen in this artifact.

## Authority Input

The consumed authority object recorded in this artifact is `evidence/artifact-0004/seal.json`.

The recorded fields are:

- `issuer`: `root.primary`
- `authority_seal_id`: `seal-valid-001`
- `custodian`: `test-custodian`
- `scope.body`: `mail`
- `scope.action`: `MAIL_DISPATCH`
- `scope.adapter`: `smtp`
- `valid_from`: `2025-01-01T00:00:00Z`
- `valid_until`: `2030-01-01T00:00:00Z`
- `single_use`: `true`

The consumed command object recorded in this artifact is `evidence/artifact-0004/command.json`.

The recorded fields are:

- `command_id`: `cmd-valid-001`
- `body`: `mail`
- `action`: `MAIL_DISPATCH`
- `adapter`: `smtp`
- `authority_seal_id`: `seal-valid-001`

The command and seal are structurally aligned. The command references the same authority seal identifier recorded in the consumed seal object.

## Execution Environment

The execution referenced by this artifact was produced by CORPIFORM on `main` at commit:

- `f257493` — `Align CORPIFORM receipt emission with authority seal identity (#34)`

That commit is the first canonical CORPIFORM mainline state in which success receipts bind:

- `authority_seal_id`

rather than a null authority field caused by reading `.seal_id`.

The recorded runtime context bound into the receipt is:

- `system`: `CORPIFORM`
- `system_fingerprint`: `test-fingerprint`
- `build_hash`: `test-build-hash`
- `version`: `v0.test`
- `body`: `mail`
- `action`: `MAIL_DISPATCH`
- `adapter`: `smtp`
- `timestamp`: `2026-03-19T12:39:16Z`
- `outcome`: `EXECUTED`

## Receipt Object

The emitted receipt preserved by VERIFRAX is:

- `evidence/artifact-0004/receipt.json`

Its recorded fields are:

- `receipt_id`: `EE07B689-F1BF-4518-B49C-C973CB178029`
- `system`: `CORPIFORM`
- `system_fingerprint`: `test-fingerprint`
- `build_hash`: `test-build-hash`
- `version`: `v0.test`
- `command_id`: `cmd-valid-001`
- `authority_seal_id`: `seal-valid-001`
- `body`: `mail`
- `action`: `MAIL_DISPATCH`
- `adapter`: `smtp`
- `timestamp`: `2026-03-19T12:39:16Z`
- `outcome`: `EXECUTED`

The receipt therefore preserves the same execution identity and authority identity as the consumed command and seal objects.

## Integrity Surface

Artifact-0004 preserves two receipt digests, because they answer different verification questions.

### Raw file digest

The raw byte-level digest of the stored receipt file is recorded in:

- `evidence/artifact-0004/receipt.sha256`

Value:

- `344392fb7630aafaf3cc9a974a6c02e938cccdc09266b7f1cf8874452f855c48`

This digest verifies the exact bytes stored in VERIFRAX.

### Canonical JSON digest

The canonical JSON digest of the receipt object, computed with sorted keys and compact separators, is recorded in:

- `evidence/artifact-0004/receipt.canonical.sha256`

Value:

- `2ec13a623cd9fca11601f1df8b186007e74ecab316354d296660511453cff456`

This digest verifies the receipt as a normalized JSON object independent of whitespace formatting.

Both digests are intentionally preserved. One proves file immutability. The other proves object identity.

## Cross-Object Consistency

Artifact-0004 establishes the following mechanically checkable bindings:

- `command.json.command_id` = `receipt.json.command_id` = `cmd-valid-001`
- `seal.json.authority_seal_id` = `command.json.authority_seal_id` = `receipt.json.authority_seal_id` = `seal-valid-001`
- `seal.json.scope.body` = `command.json.body` = `receipt.json.body` = `mail`
- `seal.json.scope.action` = `command.json.action` = `receipt.json.action` = `MAIL_DISPATCH`
- `seal.json.scope.adapter` = `command.json.adapter` = `receipt.json.adapter` = `smtp`

These bindings are the core reason this artifact matters. The receipt is not merely adjacent to the authority object. It is identifier-consistent with the consumed authority and command.

## Single-Use Boundary

The consumed seal object records:

- `single_use: true`

This artifact records the first successful execution receipt tied to that consumed authority identifier.

What Artifact-0004 proves directly is that a successful receipt now exists for that single-use authority path.

What it does not itself prove is a separately recorded replay refusal event. That stronger replay proof belongs in a future dedicated evidence object unless separately preserved with execution traces and refusal artifacts.

## Significance

Artifact-0004 is the first VERIFRAX evidence object that records the orchestrated relation:

- authority object consumed by CORPIFORM
- execution completed by CORPIFORM
- receipt emitted by CORPIFORM
- evidence frozen by VERIFRAX

That is the first real closure of the intended stack shape:

- AUCTORISEAL as authority model
- CORPIFORM as execution body
- VERIFRAX as immutable verification record

The closure is still bounded by fixture reality. The preserved authority object is a consumed fixture authority surface, not a demonstrated public production issuance surface. That boundary is a strength, not a weakness, because the artifact claims only what the evidence proves.

## Evidence Inventory

Artifact-0004 consists of:

- `command.json`
- `seal.json`
- `receipt.json`
- `receipt.sha256`
- `receipt.canonical.sha256`
- `context.md`

Together these files define the complete immutable verification unit for this first authority-governed CORPIFORM execution record.
