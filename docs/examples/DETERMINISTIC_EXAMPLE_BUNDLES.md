# VERIFRAX Deterministic Example Bundles

This document publishes the canonical deterministic example bundles for VERIFRAX.

The purpose of these examples is to give implementers and integrators a minimal,
stable artifact set for understanding protocol behavior outside the main
conformance corpus.

## Objective

These example bundles exist to provide:

- deterministic reference artifacts
- minimal integration examples
- reproducible verification demonstrations
- stable onboarding artifacts for external implementers

## Example Bundle Set

The initial deterministic example bundle set includes:

- minimal-valid
- minimal-invalid

Location:

- examples/bundles/minimal-valid/bundle.json
- examples/bundles/minimal-invalid/bundle.json

## Bundle Semantics

### minimal-valid

This example represents the smallest valid artifact bundle that should pass
verification under the current protocol release.

Expected behavior:

- verification succeeds
- deterministic verdict is preserved
- output matches reference verifier semantics

### minimal-invalid

This example represents the smallest invalid artifact bundle that should fail
verification under the current protocol release.

Expected behavior:

- verification fails deterministically
- failure classification remains stable
- output matches protocol failure semantics

## Example Bundle Rules

Deterministic example bundles must:

- remain byte-identical for the protocol release
- preserve canonical artifact structure
- remain traceable to protocol semantics
- be safe for external integration testing

## External Use

External implementers may use these bundles for:

- SDK testing
- service integration checks
- verifier smoke tests
- deterministic regression testing

## Non-Goals

These bundles do not replace:

- the official conformance suite
- certification evidence
- historical release snapshots

They are minimal public examples only.

## Conclusion

The deterministic example bundles provide the smallest public artifact set
for understanding and testing VERIFRAX verification behavior.

