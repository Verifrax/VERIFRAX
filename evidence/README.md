# VERIFRAX Evidence Index

This directory is the public evidence surface for VERIFRAX.

It exists so that any reviewer, claimant, challenger, auditor, or adversarial reader can inspect what was asserted, what was executed, what was observed, what was not executable, and what boundary the current evidence actually proves.

This index is not a substitute for the evidence objects themselves. It is the canonical navigation surface for those objects.

---

## Current boundary

Current bootstrap-chain status:

- **ARTIFACT-0001:** VERIFIED
- **ARTIFACT-0002:** VERIFIED
- **ARTIFACT-0003:** VERIFIED
- **ARTIFACT-0004:** RECORDED
- **ARTIFACT-0005:** VERIFIED

Bootstrap-chain status file:

- `bootstrap-chain-status/CHAIN_STATUS.txt`

Published npm package evidence currently recorded here:

- `package-surface/auctoriseal-0.1.2/`
- `package-surface/corpiform-0.1.4/`

That means the currently indexed public boundary is:

1. repository integrity evidence for the initial protocol object
2. authority readiness evidence for AUCTORISEAL
3. authority issuance presence and re-execution evidence
4. first recorded CORPIFORM authority-governed execution receipt evidence
5. verified artifact-0005 governed execution boundary recorded under public canonical authority and asserted as final public seal state
6. semantic cross-implementation execution evidence for earlier chain artifacts
7. package publication evidence for the full public `@verifrax/*` chain recorded under `package-surface/`
8. sovereign triad component surfaces for `SYNTAGMARIUM`, `ORBISTIUM`, and `CONSONORIUM` recorded under `component-surface/`

---

## How to read this evidence

The evidence tree is intentionally separated by function.

Read it in this order:

### 1. Bootstrap status

Start here if you want the shortest current state summary.

- `bootstrap-chain-status/CHAIN_STATUS.txt`

This tells you what the currently accepted boundary is for the bootstrap chain.

### 2. Artifact-level source evidence

Read the artifact directories if you want to inspect the declared subject, claim set, and collected evidence objects for each protocol artifact.

- `artifact-0001/`
- `artifact-0002/`
- `artifact-0003/`
- `artifact-0004/`
- `artifact-0005/`

These directories define what each artifact claims and what files were collected in support of that claim.

### 3. Execution evidence

Read execution directories if you want to inspect whether maintained implementations actually executed those claims.

- `artifact-0002-execution/`
- `artifact-0003-reexecution/`
- `artifact-semantic-execution/`

These surfaces matter because a claim without execution is weaker than a claim that survives execution across maintained implementations.

### 4. Gaps and boundary failures

Read these if you want to inspect where evidence or execution was previously incomplete, absent, or boundary-limited.

- `artifact-execution-gap/`

These surfaces are intentionally retained because protocol trust requires visibility into failure conditions, not only successful outcomes.

### 5. Component surfaces

Read this if you want to inspect stack components that are now publicly legible and recorded as canonical surfaces.

- `component-surface/corpiform/`
- `component-surface/syntagmarium/`
- `component-surface/orbistium/`
- `component-surface/consonorium/` - `component-surface/syntagmarium/` - `component-surface/orbistium/` - `component-surface/consonorium/`

This records CORPIFORM as an execution component surface connected to AUCTORISEAL authority inputs and VERIFRAX verification-facing boundaries.

### 6. External publication evidence

Read this if you want to inspect whether an externally distributed package surface was actually published and recorded.

- `package-surface/auctoriseal-0.1.2/`
- `package-surface/corpiform-0.1.4/`

This records package name, version, latest tag, repository head, and publication status for the current recorded npm boundary.

Earlier recorded package surfaces remain part of the evidence history and are not superseded as historical records.

---

## Evidence map

### `artifact-0001/`

Purpose:

- repository integrity and initial protocol object evidence

Use this when checking:

- whether the initial repository state was captured
- whether cross-verifier integrity evidence exists
- whether the first object was materially grounded

Primary file:

- `artifact-0001/artifact-0001.json`

Supporting examples:

- `artifact-0001/file-hashes.txt`
- `artifact-0001/git-fsck.txt`
- `artifact-0001/node-verifier.txt`
- `artifact-0001/rust-verifier.txt`

### `artifact-0002/`

Purpose:

- authority readiness evidence for AUCTORISEAL

Use this when checking:

- whether authority ledger publication exists
- whether genesis seal publication exists
- whether authority surfaces were merely implementation code or real published objects
- whether declared evidence now supports readiness

Primary file:

- `artifact-0002/artifact-0002.json`

Supporting examples:

- `artifact-0002/authority-surface-files.txt`
- `artifact-0002/ledger-presence.txt`
- `artifact-0002/seal-presence.txt`
- `artifact-0002/issued-object-search.txt`
- `artifact-0002/live-reference-search.txt`

### `artifact-0002-execution/`

Purpose:

- original maintained-verifier execution logs associated with artifact-0002

Use this when checking:

- whether maintained verifiers executed the artifact line
- what the original execution boundary was before semantic refresh
- how execution output was separated from later semantic interpretation

Key files:

- `artifact-0002-execution/INTERPRETATION_BOUNDARY.txt`
- `artifact-0002-execution/node-run.txt`
- `artifact-0002-execution/rust-run.txt`
- `artifact-0002-execution/output-hashes.txt`

### `artifact-0003/`

Purpose:

- issued-subject evidence for the authority publication boundary

Use this when checking:

- whether published authority ledger presence exists
- whether published genesis seal presence exists
- whether the claimed issuance subject exists as a public inspectable subject

Primary file:

- `artifact-0003/artifact-0003.json`

Supporting examples:

- `artifact-0003/authority-ledger-presence.txt`
- `artifact-0003/seal-0001-presence.txt`
- `artifact-0003/issued-object-search.txt`


### `artifact-0004/`

Purpose:

- first recorded CORPIFORM authority-governed execution receipt evidence

Use this when checking:

- whether CORPIFORM emitted a success receipt on corrected authority-binding semantics
- whether consumed command, consumed seal, and emitted receipt are identifier-consistent
- whether VERIFRAX preserves the first recorded end-to-end execution receipt as immutable evidence

Primary file:

- `artifact-0004/artifact-0004.json`

Supporting examples:

- `artifact-0004/context.md`
- `artifact-0004/receipt.json`
- `artifact-0004/receipt.sha256`
- `artifact-0004/receipt.canonical.sha256`
- `artifact-0004/EXECUTION_STATUS.txt`

### `artifact-0005/`

Purpose:

- verified artifact-0005 governed execution boundary and the contradiction surfaces it resolved

Use this when checking:

- whether a public canonical AUCTORISEAL seal was used for the governed execution boundary
- whether CORPIFORM recorded the governed execution receipt under that published seal
- whether the receipt authority binding matched the declared canonical seal id
- whether artifact-0005 current-truth surfaces now align to the recorded governed execution and verifier outputs

Primary file:

- `artifact-0005/artifact-0005.json`

Supporting examples:

- `artifact-0005/EXECUTION_STATUS.txt`
- `artifact-0005/CROSS_IMPLEMENTATION_STATUS.txt`
- `artifact-0005/receipt/receipt.json`
- `artifact-0005/receipt/receipt.digest.txt`
- `artifact-0005/reexecution/COMPARISON.txt`

### `artifact-0003-reexecution/`

Purpose:

- cross-implementation re-execution evidence after the authority subject became present

Use this when checking:

- whether node and rust re-execution matched
- whether canonicalized outputs matched
- whether the subject changed from absent/not executable to present/verifiable

Key files:

- `artifact-0003-reexecution/CROSS_IMPLEMENTATION_STATUS.txt`
- `artifact-0003-reexecution/artifact-0003.node.reexecution.json`
- `artifact-0003-reexecution/artifact-0003.rust.reexecution.json`
- `artifact-0003-reexecution/output-hashes.txt`

### `artifact-semantic-execution/`

Purpose:

- semantic evaluator outputs for artifact-0002 and artifact-0003 across maintained implementations

Use this when checking:

- whether semantic readiness was actually satisfied
- whether node and rust semantic outputs aligned
- whether the chain is semantically resolved rather than merely structurally present

Key files:

- `artifact-semantic-execution/CROSS_IMPLEMENTATION_STATUS.txt`
- `artifact-semantic-execution/artifact-0002.node.semantic.json`
- `artifact-semantic-execution/artifact-0002.rust.semantic.json`
- `artifact-semantic-execution/artifact-0003.node.semantic.json`
- `artifact-semantic-execution/artifact-0003.rust.semantic.json`
- `artifact-semantic-execution/output-hashes.txt`

### `package-surface/corpiform-0.1.4/`

Purpose:

- published npm package evidence for the first public CORPIFORM package surface

Use this when checking:

- whether `@verifrax/corpiform@0.1.4` was published
- whether the package is tagged `latest`
- whether the package is public and installable
- whether the published package surface is bound to repository head `289b977`

Primary files:

- `package-surface/corpiform-0.1.4/PACKAGE_IDENTITY.txt`
- `package-surface/corpiform-0.1.4/npm-view.json`

Supporting examples:

- `package-surface/corpiform-0.1.4/dist-tags.txt`
- `package-surface/corpiform-0.1.4/access-status.txt`
- `package-surface/corpiform-0.1.4/npm-packument.json`
- `package-surface/corpiform-0.1.4/install-help.txt`

### `component-surface/corpiform/`

Purpose:

- recorded public component surface for CORPIFORM

Use this when checking:

- whether CORPIFORM is now recorded as a legible execution component in the stack
- which repository head is associated with the recorded surface
- whether evidence-index presence and runtime verification presence were recorded at the VERIFRAX layer

Key files:

- `component-surface/corpiform/COMPONENT_STATUS.txt`
- `component-surface/corpiform/component-name.txt`
- `component-surface/corpiform/component-repository.txt`
- `component-surface/corpiform/component-head.txt`
- `component-surface/corpiform/evidence-index.txt`
- `component-surface/corpiform/runtime-verification.txt`

### `artifact-execution-gap/`

Purpose:

- retained visibility into earlier execution and publication gaps

Use this when checking:

- whether anything important was missing at prior execution time
- whether the protocol preserves evidence of absence rather than rewriting history
- whether a challenger can inspect failure-state surfaces directly

Key files:

- `artifact-execution-gap/repo-artifact-search.txt`
- `artifact-execution-gap/tooling-surface-files.txt`

### `bootstrap-chain-status/`

Purpose:

- concise current chain summary

Primary file:

- `bootstrap-chain-status/CHAIN_STATUS.txt`

This is the shortest route to the current accepted state, but it should be read as a summary layer, not the whole proof surface.

### `package-surface/auctoriseal-0.1.2/`

Purpose:

- external package publication evidence for the AUCTORISEAL npm surface

Use this when checking:

- whether `@verifrax/auctoriseal` was published
- whether the latest tag matches the recorded version
- whether the recorded package boundary points back to a specific repository head

Files:

- `package-surface/auctoriseal-0.1.2/PUBLICATION_STATUS.txt`
- `package-surface/auctoriseal-0.1.2/package-name.txt`
- `package-surface/auctoriseal-0.1.2/npm-version.txt`
- `package-surface/auctoriseal-0.1.2/npm-dist-tag-latest.txt`
- `package-surface/auctoriseal-0.1.2/repo-head.txt`

---

## Adversarial reading guide

This directory is designed to remain useful even for hostile review.

A challenger should ask, in order:

1. What exactly is being claimed?
2. What files support that claim?
3. Was the subject present at execution time?
4. Did more than one maintained implementation execute the same claim?
5. Did outputs match after canonicalization?
6. Is the current summary hiding an earlier failure state?
7. Is there a public artifact surface, or only implementation code?
8. Is there a publication boundary outside GitHub, and is it recorded here?

The evidence tree is intentionally structured so those questions can be answered from published files rather than informal explanation.

---

## Claimant guidance

If you want to challenge a conclusion, do not start with rhetoric.

Start by identifying one of these failure classes:

- claim/object mismatch
- evidence/object absence
- execution prerequisite failure
- cross-implementation divergence
- canonicalization mismatch
- summary overstating underlying evidence
- stale publication boundary
- unverifiable external reference

Then point to the exact file that creates the contradiction.

A valid challenge in this system is file-anchored.

---

## Transparency rule

This directory keeps both successful and adverse surfaces visible.

That includes:

- prior absence states
- execution-gap surfaces
- not-executable boundaries
- cross-implementation outputs
- canonicalized output derivatives
- publication evidence outside the repository itself

The objective is not to look clean.
The objective is to remain inspectable under adversarial review.

---

## Interpretation rule

When a summary file and a lower-level evidence file appear to conflict, the lower-level evidence file wins unless a later execution boundary explicitly supersedes it and that supersession is itself recorded in evidence.

That prevents silent narrative overwrite.

---

## Search starting points

If you are entering this tree for the first time, start here:

- current state summary: `bootstrap-chain-status/CHAIN_STATUS.txt`
- authority readiness object: `artifact-0002/artifact-0002.json`
- issuance object: `artifact-0003/artifact-0003.json`
- semantic cross-implementation result: `artifact-semantic-execution/CROSS_IMPLEMENTATION_STATUS.txt`
- recorded execution component surface: `component-surface/corpiform/COMPONENT_STATUS.txt`
- external package publication status: `package-surface/CURRENT_PACKAGE_INDEX.txt`

---

## Scope boundary

This index covers the evidence currently published under `VERIFRAX/evidence`.

It does not claim that every possible future artifact already exists.
It claims that the evidence that does exist is now navigable from a single public root.

