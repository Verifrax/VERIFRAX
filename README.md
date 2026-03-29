# VERIFRAX

Normative protocol authoring, evidence-root registration, and verification boundary for the governed Verifrax system.

## Status

* Layer: protocol authoring, evidence, and verification boundary
* Repository class: governed flagship repository
* npm package: `@verifrax/verifrax`
* System role: authored source material plus artifact-chain registration
* Public host ownership: none claimed as sole host surface in this README
* License: Apache License Version 2.0

## One-sentence role

VERIFRAX authors normative source material, records the artifact chain, and defines the verification boundary that interprets governed authority and governed execution without becoming the authority issuer or the execution runtime itself.

## What this repository is

VERIFRAX is the flagship repository of the governed Verifrax stack.

It exists to provide:

* normative authored source material
* protocol and verification boundary definition
* maintained evidence-root structure
* artifact registration and chain continuity
* verification semantics for recorded inputs, receipts, and outputs
* historical and current-state separation inside the evidence surface
* linkage between authority, execution, proof, and public verifier surfaces

This repository is the authored and recorded center of the stack.

## What this repository is not

VERIFRAX is not:

* the authority issuance repository
* the execution runtime repository
* the derived specification publication surface
* the public verifier UI itself
* the public proof publication repository
* the intake repository
* the commercial landing surface
* a generic package marketing surface
* a substitute for authority issuance or receipt generation

VERIFRAX does not:

* mint authority objects
* admit or execute governed runtime actions
* replace AUCTORISEAL
* replace CORPIFORM
* replace the public verifier UI at `verify.verifrax.net`
* replace the proof publication surface at `proof.verifrax.net`

VERIFRAX interprets governed material and records chain truth. It does not create every input that it later verifies.

## Stack position

The governed stack reads in this order:

1. `.github` — governed repository boundary and governance linkage
2. `AUCTORISEAL` — authority issuance and public authority publication
3. `CORPIFORM` — governed execution and receipt emission
4. `VERIFRAX` — authored protocol boundary, evidence root, and chain registration
5. `VERIFRAX-verify` — public verification surface
6. `proof` — public proof publication surface
7. `apply` — public intake surface

VERIFRAX therefore sits after authority publication and execution recording when evaluating recorded chain truth, while also remaining upstream authored source material for the derived specification surface.

## Authority and specification direction

The load-bearing direction across the governed system is:

* VERIFRAX authors normative source material.
* VERIFRAX-SPEC publishes derived specification artifacts from VERIFRAX.
* Derived artifacts are not upstream authority.
* Governance authority is external and bound through AUCTORISEAL plus the governed repo set in `.github`.

That direction must stay explicit in this README because VERIFRAX is both authored-source surface and evidence-root surface.

VERIFRAX is upstream for authored protocol material.
VERIFRAX is not upstream for governance authority issuance.

## Public-surface relationship

This repository must connect to the public domain surfaces without falsely claiming ownership of all of them.

Relevant neighboring surfaces are:

* `https://api.verifrax.net/` — execution surface
* `https://proof.verifrax.net/` — proof publication surface
* `https://verify.verifrax.net/` — public verifier surface
* `https://auctoriseal.verifrax.net/` — authority issuance/reference surface
* `https://corpiform.verifrax.net/` — runtime reference surface
* `https://apply.verifrax.net/` — intake surface
* `https://sigillarium.verifrax.net/` — seal/archive reference surface

This repository must link to those surfaces as adjacent system boundaries.

It must not claim that VERIFRAX itself is the sole owner of:

* `api.verifrax.net`
* `proof.verifrax.net`
* `verify.verifrax.net`
* `apply.verifrax.net`
* `auctoriseal.verifrax.net`
* `corpiform.verifrax.net`
* `sigillarium.verifrax.net`

## Evidence root boundary

VERIFRAX is the evidence-root repository.

That means it is responsible for:

* artifact directory continuity
* recorded input/output boundaries where declared
* chain registration text
* current-state versus historical-state separation
* contradiction containment inside evidence surfaces
* evidence-visible linkage between authority, execution, receipt, and verification

It must not allow older files to impersonate current truth.

It must not allow README prose to outrun evidence.

## Artifact chain

The artifact chain must be described here with exact boundary discipline.

### Artifact-0004

Artifact-0004 is the recorded bounded execution boundary already present in the chain.

This repository may describe artifact-0004 as recorded execution evidence.

It must not describe artifact-0004 as equivalent to the first public canonical seal.

### Artifact-0005

Artifact-0005 is load-bearing across this repository because it is the next chain boundary that must connect:

* public canonical authority
* governed execution under that authority
* recorded CORPIFORM receipt
* VERIFRAX evidence registration
* matching verification interpretation
* public verification path

This README must therefore mention artifact-0005 as an active chain requirement.

It must not describe artifact-0005 as complete, sealed, or universally proven unless the evidence root actually proves that state.

## Verifier boundary

VERIFRAX and the public verifier are related but not identical.

### VERIFRAX

VERIFRAX defines and records the maintained verification boundary inside the governed repository system.

### VERIFRAX-verify

`VERIFRAX-verify` is the public verification surface at `https://verify.verifrax.net/`.

That public surface must remain linked from this repository because verifier visibility is part of the load-bearing public chain.

This README must make the distinction explicit:

* VERIFRAX = authored protocol + evidence root + maintained verification boundary
* VERIFRAX-verify = public verifier UI and public inspection surface

If that distinction is blurred, proof, verifier, and protocol roles collapse into each other.

## Proof boundary

The proof publication surface is separate from both VERIFRAX and the public verifier.

* `proof` owns `https://proof.verifrax.net/`
* VERIFRAX records and links evidence boundaries
* VERIFRAX-verify gives public verifier access

This repository must not present proof publication as if it were the same thing as authored protocol or public verifier UI.

## Inputs and outputs

### Inputs consumed by this repository

VERIFRAX consumes and records material such as:

* authority references published by AUCTORISEAL
* governed execution receipts emitted by CORPIFORM
* evidence bundles and protocol inputs
* conformance material
* verifier outputs and cross-implementation comparison material
* chain registration metadata

### Outputs produced by this repository

VERIFRAX produces and maintains:

* authored normative source material
* evidence-root registration and artifact indexing
* verification documentation and maintained verifier boundary
* current-state and historical-state evidence mapping
* chain continuity across recorded artifacts

It does not produce authority objects or governed runtime admission.

## Package and publication truth

This repository is first and foremost a protocol/evidence repository.

This README must not imply a public npm runtime package unless package metadata and publication reality prove that claim.

If package metadata changes, the README must follow the metadata rather than the reverse.

## Current reading rule

Read the neighboring repositories in this order when tracing the full system:

* [`.github`](https://github.com/Verifrax/.github) — governance root
* [`AUCTORISEAL`](https://github.com/Verifrax/AUCTORISEAL) — authority issuance/reference
* [`CORPIFORM`](https://github.com/Verifrax/CORPIFORM) — governed execution and receipts
* [`VERIFRAX-SPEC`](https://github.com/Verifrax/VERIFRAX-SPEC) — derived specification publication
* [`VERIFRAX-PROFILES`](https://github.com/Verifrax/VERIFRAX-PROFILES) — deterministic profile constraints
* [`VERIFRAX-verify`](https://github.com/Verifrax/VERIFRAX-verify) — public verifier UI
* [`proof`](https://github.com/Verifrax/proof) — proof publication surface
* [`apply`](https://github.com/Verifrax/apply) — intake surface
* [`VERIFRAX-DOCS`](https://github.com/Verifrax/VERIFRAX-DOCS) — documentation/reference surface
* [`ARCHITECTURE`](https://github.com/Verifrax/ARCHITECTURE) — topology and interaction map

## CI and governance expectations

Any CI posture described in this README must be real.

The flagship repository should enforce real checks for:

* identity alignment
* integrity alignment
* determinism where declared
* verifier reproducibility where declared
* artifact registration consistency
* evidence-root drift detection
* cross-reference consistency for artifact, authority, version, and digest surfaces

This README must not use badges or prose to imply success states that the evidence root and workflows do not actually prove.

## README truth rules

This README fails if it:

* blurs protocol authorship with authority issuance
* blurs verification boundary with execution runtime
* blurs public verifier UI with evidence root
* overclaims artifact-0005 status
* describes historical files as current truth
* claims sole host ownership where none is proved
* implies package publication beyond metadata reality

## Verifrax system path labels

The governed Verifrax path that this README must stay compatible with is:

1. `.github` — organization governance and governed repository boundary
2. `AUCTORISEAL` — authority issuance and public authority reference
3. `CORPIFORM` — governed execution and receipt emission
4. `VERIFRAX` — authored protocol, evidence root, and artifact-chain registration boundary
5. `VERIFRAX-SPEC` — derived specification publication surface
6. `VERIFRAX-PROFILES` — deterministic profile-constraint surface
7. `VERIFRAX-SAMPLES` — pinned sample and reproducibility surface
8. `VERIFRAX-verify` — public verification repository and UI boundary
9. `VERIFRAX-DOCS` — explanatory documentation surface
10. `cicullis` — enforcement boundary
11. `proof` — proof publication surface
12. `SIGILLARIUM` — seal and archive reference surface
13. `apply` — intake surface

The live host-label map that must remain explicit and non-contradictory is:

* `https://api.verifrax.net/` — execution surface
* `https://proof.verifrax.net/` — proof publication surface
* `https://auctoriseal.verifrax.net/` — authority issuance and authority reference surface
* `https://corpiform.verifrax.net/` — runtime and receipt reference surface
* `https://cicullis.verifrax.net/` — enforcement reference surface
* `https://verify.verifrax.net/` — public verification surface
* `https://sigillarium.verifrax.net/` — seal and archive reference surface
* `https://apply.verifrax.net/` — intake surface
* `https://docs.verifrax.net/` — documentation surface

This README must remain compatible with `artifact-0005` as the load-bearing authority → execution → verification → evidence boundary without claiming that this repository alone authors, proves, seals, or registers `artifact-0005` unless that role is actually true for this repository.

## Security

Do not publish hidden authority material, private execution inputs, unpublished verifier compromises, or internal evidence-handling vulnerabilities that would weaken the governed chain.

Security issues that affect authority, execution, or evidence linkage are chain-integrity issues, not cosmetic issues.

## Contributing

A change is wrong if it:

* weakens the authored-source direction from VERIFRAX to VERIFRAX-SPEC
* weakens the authority direction from AUCTORISEAL into governed execution
* weakens artifact registration discipline
* weakens evidence-root current-state truth
* treats README prose as a substitute for evidence
* introduces future-state claims as present state

## License

Apache License Version 2.0. See `LICENSE`.
