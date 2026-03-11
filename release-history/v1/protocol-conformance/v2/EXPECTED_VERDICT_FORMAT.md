# VERIFRAX Expected Verdict Output Format

This document defines the canonical structure of verification
verdict outputs used by the VERIFRAX protocol conformance suites.

All implementations executing the conformance suites MUST produce
outputs structurally equivalent to the expected verdict artifacts.

## Canonical Structure

A verification verdict MUST follow this structure:

{
  "bundle_hash": "<string>",
  "verdict": "<VERIFIED | FAILED | INVALIDATED>",
  "protocol_version": "<string>"
}

Optional fields MAY appear depending on the verification outcome.

### Failure Classification

When verification fails:

{
  "bundle_hash": "<string>",
  "verdict": "FAILED",
  "error_class": "<failure-class>",
  "protocol_version": "<string>"
}

### Invalidation

When invalidation occurs:

{
  "bundle_hash": "<string>",
  "verdict": "INVALIDATED",
  "error_class": "<invalidation-class>",
  "protocol_version": "<string>"
}

### Finality

When verification reaches protocol finality:

{
  "bundle_hash": "<string>",
  "verdict": "<VERIFIED | FAILED | INVALIDATED>",
  "finality": "LOCKED",
  "protocol_version": "<string>"
}

## Deterministic Requirement

Implementations MUST produce structurally equivalent verdict
outputs for identical inputs and protocol version.

Field ordering MUST NOT affect semantic equivalence.

## Conformance

All conformance suites reference verdict outputs following this
canonical format.

Implementations passing the conformance suites demonstrate that
their verdict outputs conform to the protocol verification model.
