# VERIFRAX Artifact Semantic Execution Contract

## Purpose

This surface defines the first-class execution contract for protocol artifacts whose verdicts must be derived from evidence semantics rather than from conformance-suite fixture loading.

This contract exists because the maintained verifier surfaces currently execute only canonical conformance suites under `protocol-conformance/v2` and do not yet evaluate repository artifact evidence objects as semantic claims.

The goal of this surface is to open a disciplined path from:

- evidence record
- deterministic evaluator input
- semantic verdict output
- cross-implementation agreement

without overstating what the current verifier model proves.

---

## Boundary

### What current maintained verifiers prove today

The current Node and Rust verifier entrypoints prove only that:

- a suite is discovered
- bundle material is loaded
- an expected verdict artifact exists
- implementations emit matching output for the suite set

They do **not** yet prove that an external artifact claim is semantically true or false.

### What this contract adds

This contract defines the execution model for semantic artifact verdicts such as:

- `VERIFIED`
- `FAILED`
- `INVALIDATED`
- `INCOMPLETE`
- `NOT_EXECUTABLE`

where the verdict must be derived from the evidence set itself.

---

## Scope

This execution contract applies to artifact objects such as:

- repository integrity baseline artifacts
- external readiness evaluation artifacts
- external issuance validation artifacts
- future revocation, dispute, or authority-transition artifacts

This contract does **not** replace the canonical conformance suite model. It extends VERIFRAX with a separate, first-class semantic execution surface.

---

## Canonical Input Object

A semantic artifact evaluator MUST accept a single artifact json object as input.

Minimum required structure:

```json
{
  "artifact_id": "artifact-0002",
  "title": "AUCTORISEAL Activation Readiness Evaluation",
  "subject": {
    "subject": "AUCTORISEAL activation readiness",
    "subject_ref": "github.com/Verifrax/AUCTORISEAL",
    "commit": "<commit>",
    "branch": "main",
    "event": "protocol readiness verification"
  },
  "claim_set": [
    "claim 1",
    "claim 2"
  ],
  "evidence_objects": [
    {
      "path": "protocol/seal.schema.json",
      "sha256": "<digest>",
      "role": "seal schema"
    }
  ],
  "supporting_evidence": {
    "seal_presence_log": "evidence/artifact-0002/seal-presence.txt"
  }
}
````

The evaluator MAY read both:

* structured fields inside the artifact json
* referenced local evidence files declared by that artifact json

The evaluator MUST NOT rely on undeclared ambient files for verdict semantics.

---

## Execution Modes

### Mode A — Local Evidence Execution

The evaluator executes against evidence already materialized in the local repository working tree.

Use cases:

* artifact-0001 repository deterministic integrity baseline
* copied external evidence under `evidence/artifact-*`

### Mode B — Repository Inspection Execution

The evaluator inspects a target repository path declared by the artifact subject or evidence records and derives observations directly.

Use cases:

* external readiness inspection
* external issuance presence validation

If repository inspection is used, the inspected repository path MUST be explicitly declared in the artifact input or execution manifest.

---

## Determinism Requirements

A semantic artifact evaluator MUST be deterministic.

For the same:

* artifact json
* referenced evidence files
* repository commit inputs
* evaluation rules

it MUST produce the same verdict output.

The evaluator MUST NOT depend on:

* wall-clock time except when explicitly declared as an evidence field
* network state
* mutable external APIs
* nondeterministic filesystem traversal order
* unspecified default environment behavior

All directory scans MUST be sorted before evaluation.

---

## Canonical Output Object

A semantic evaluator MUST emit a verdict object with this minimum structure:

```json
{
  "artifact_id": "artifact-0002",
  "verdict": "FAILED",
  "status": "EXECUTED",
  "reason_codes": [
    "GENESIS_SEAL_ABSENT",
    "AUTHORITY_LEDGER_ABSENT"
  ],
  "observations": {
    "seal_presence": "ABSENT",
    "ledger_presence": "ABSENT"
  }
}
```

### Required fields

* `artifact_id`
* `verdict`
* `status`
* `reason_codes`
* `observations`

### Allowed verdict values

* `VERIFIED`
* `FAILED`
* `INVALIDATED`
* `INCOMPLETE`
* `NOT_EXECUTABLE`

### Allowed status values

* `EXECUTED`
* `NOT_EXECUTED`

---

## Verdict Semantics

### VERIFIED

Use only when the claimed subject exists and all required semantic checks succeed.

### FAILED

Use when the artifact was executable and the claim was evaluated, but one or more required claim conditions were not satisfied.

### INVALIDATED

Use when evidence shows a stronger contradiction condition that voids prior validity rather than merely failing satisfaction.

### INCOMPLETE

Use when the artifact subject may exist, but required evidence is insufficient to reach a stable semantic conclusion.

### NOT_EXECUTABLE

Use when execution cannot begin because the claimed subject or indispensable execution prerequisite is absent.

Examples:

* missing claimed seal object
* missing authoritative ledger object
* absent required evidence file declared as mandatory

---

## Claim Evaluation Rules

Each artifact type MUST define explicit claim-to-observation mapping rules.

### Repository Integrity Baseline Class

Typical rules:

* repository head matches declared commit
* required authority files exist
* required hashes match
* fsck completes without structural corruption
* maintained implementations produce matching outputs

### External Readiness Evaluation Class

Typical rules:

* expected issuance object absent
* expected authoritative ledger absent
* implementation surfaces may exist as code
* semantic readiness remains unsatisfied

Important:

A conformance-suite `PASS` line alone is not sufficient to classify the artifact claim as `FAILED` or `VERIFIED`.

### External Issuance Validation Class

Typical rules:

* canonical seal path exists
* authoritative ledger path exists
* declared schema exists
* object/ledger linkage succeeds
* conflict checks succeed

If the claimed seal path is absent, the artifact MUST be `NOT_EXECUTABLE`, not `FAILED`.

---

## Cross-Implementation Rule

Node and Rust semantic evaluators MUST both execute the same artifact input and emit structurally equivalent verdict outputs.

Publication-grade semantic conclusion requires:

* both implementations executed
* outputs matched
* no interpretation boundary remained open

If both implementations match only at adapter or harness level, but no semantic evaluator exists, that result MUST be recorded as execution evidence only and MUST NOT be promoted into a semantic verdict claim.

---

## Publication Rule

An artifact may enter the canonical artifact index with a semantic verdict only if:

1. the artifact json exists
2. semantic evaluator execution occurred
3. Node and Rust outputs matched
4. the verdict is justified by the semantic rules for that artifact class
5. no unresolved interpretation boundary remains

If any of the above is missing, evidence may be recorded, but canonical publication MUST remain blocked.

---

## Bootstrap Chain Interpretation

Given the current repository state, this contract implies:

### artifact-0001

Eligible for semantic publication because repository-backed evidence exists and cross-implementation execution is already recorded.

### artifact-0002

Not yet eligible for semantic publication as `FAILED` until a first-class semantic evaluator derives that classification from evidence rather than from conformance-suite adapter acceptance.

### artifact-0003

Not executable while the claimed canonical issuance surfaces are absent. It cannot be published as `VERIFIED` until the subject is first published and then semantically evaluated.

---

## Required Next Implementation Surface

The next implementation step after this contract is:

* add a Node semantic artifact evaluator entrypoint
* add a Rust semantic artifact evaluator entrypoint
* define a stable artifact verdict output format
* run both against artifact-0002 first
* only then reopen canonical publication of artifact-0002

Artifact-0003 remains downstream of external issuance publication in AUCTORISEAL.

