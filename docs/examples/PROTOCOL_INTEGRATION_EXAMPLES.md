# VERIFRAX Protocol Integration Examples

This document provides practical examples for integrating VERIFRAX
verification into external systems.

The purpose is to show how protocol verification can be embedded
into applications, services, and pipelines while preserving
deterministic behavior.

## Objective

An integration must ensure that:

- protocol artifacts are verified before trust decisions
- deterministic outputs are preserved
- verification failures are handled explicitly
- historical verification remains reproducible

## Example 1 — Command Line Verification

A simple integration pattern for local artifact verification.

Process:

1. Load a bundle artifact
2. Execute the verifier
3. Read the deterministic verdict
4. Fail the local process if verification fails

Expected use cases:

- local artifact inspection
- release validation
- operator workflows

## Example 2 — CI Pipeline Verification

A CI system can verify artifacts before accepting a change.

Process:

1. Checkout repository state
2. Run protocol verification
3. Compare outputs against expected results
4. Fail the pipeline on non-conforming output

Expected use cases:

- protocol release validation
- deterministic build protection
- repository enforcement

## Example 3 — Service API Verification

A service may expose a verification endpoint.

Process:

1. Receive artifact bundle
2. Execute deterministic verification
3. Return structured verdict result
4. Record verification transcript

Expected use cases:

- remote artifact validation
- automated verification services
- trust boundary enforcement

## Example 4 — Registry Admission Verification

A package or artifact registry may require VERIFRAX verification
before accepting submissions.

Process:

1. Receive submission
2. verify artifact lineage and signatures
3. reject invalid or contradictory submissions
4. store verification evidence

Expected use cases:

- registry trust enforcement
- deterministic admission rules
- ecosystem publication safety

## Example 5 — Historical Re-Verification

A historical release may be re-verified later.

Process:

1. Load historical snapshot
2. execute the reference verifier
3. compare results with archived transcripts
4. confirm byte-identical outcomes

Expected use cases:

- forensic review
- archive validation
- protocol history preservation

## Integration Requirements

All integrations must preserve:

- deterministic artifact parsing
- protocol-defined failure classes
- canonical verification semantics
- reproducible verifier outputs

An integration must never reinterpret verification results
outside protocol semantics.

## Non-Conforming Integrations

An integration is non-conforming if it:

- suppresses deterministic failures
- alters verifier outputs
- rewrites protocol verdicts
- ignores verification transcripts

## Conclusion

These examples define the expected integration patterns for
systems adopting VERIFRAX outside the reference repository.

