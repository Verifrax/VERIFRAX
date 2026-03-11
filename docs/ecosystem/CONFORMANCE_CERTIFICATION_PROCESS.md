# VERIFRAX Conformance Certification Process

This document defines the formal process by which an independent
implementation may be recognized as protocol-conforming.

The objective is to ensure that implementations outside the reference
repository preserve deterministic verification semantics.

## Certification Objective

Certification confirms that an implementation:

- executes VERIFRAX verification deterministically
- matches protocol-defined failure taxonomy
- passes official conformance suites
- reproduces canonical verifier outputs
- preserves historical verification behavior

Certification is about protocol conformance, not operator trust.

## Certification Requirements

A candidate implementation must provide:

- implementation name
- implementation version
- source repository reference
- supported runtime or platform
- build instructions
- verification transcript outputs
- conformance suite results

Without these artifacts, certification is incomplete.

## Mandatory Verification Conditions

To qualify for certification, an implementation must:

1. execute the official conformance suites successfully
2. match deterministic verdict outputs
3. match protocol-defined failure classes
4. demonstrate reproducible execution from source
5. show no divergence from frozen protocol semantics

Any divergence is disqualifying.

## Required Evidence

The certification submission must include:

- conformance test transcript
- build or reproduction instructions
- source commit identifier
- artifact checksums when applicable
- implementation output samples

The evidence must be sufficient for independent re-verification.

## Certification Review Procedure

The certification process is:

1. submit implementation evidence
2. verify build reproducibility
3. execute official conformance suites
4. compare outputs to protocol expectations
5. record certification outcome

Successful review results in implementation registry eligibility.

## Failure Conditions

Certification must be denied if the implementation:

- produces divergent verdict outputs
- emits incompatible failure classes
- depends on non-deterministic behavior
- cannot be reproduced from source
- modifies protocol semantics

## Certification Scope

Certification applies to:

- a specific implementation
- a specific implementation version
- a specific protocol release boundary

Certification does not automatically extend to later versions.

## Re-Certification Requirement

An implementation must be re-certified when:

- verification semantics change
- build or runtime behavior changes
- protocol release boundary changes
- deterministic outputs change

Re-certification preserves ecosystem trust boundaries.

## Registry Relationship

Certified implementations may be recorded in the
verified implementation registry.

Registry entry is a publication consequence of certification,
not a substitute for certification.

