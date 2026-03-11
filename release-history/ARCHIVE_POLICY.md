# VERIFRAX Historical Release Archive Policy

This document defines the permanence guarantees for historical protocol releases.

## Purpose

The archive policy ensures that once a protocol release is finalized, its verification
state remains reproducible indefinitely.

Historical releases must remain byte-identical so that independent verifiers can
reproduce the exact verification outcomes at any point in the future.

## Archived Release Contents

Each historical release snapshot MUST contain:

- protocol-conformance suites
- reference verifier implementations
- release SHA256 manifests
- reference verifier hash registry
- genesis lineage
- freeze surface manifest
- release evidence bundle
- verification transcripts
- snapshot manifest

These artifacts together form the complete deterministic verification boundary
for a protocol release.

## Immutability Guarantee

Once published:

- historical release directories MUST NOT be modified
- artifacts MUST remain byte-identical
- verification transcripts MUST remain reproducible

Any change to historical release content constitutes a protocol violation.

## Verification Reproduction

Reproducing a historical release requires:

1. Checking out the repository at the corresponding commit
2. Executing the reference verifiers
3. Comparing results with the archived verification transcripts

Matching outputs prove deterministic verification integrity.

## Long-Term Preservation

Historical releases should be mirrored across multiple independent archives:

- Git repository history
- protocol documentation mirrors
- public artifact storage

These redundant archives ensure protocol history cannot be silently altered.

## Protocol Integrity Boundary

The archive policy guarantees that verification results produced by VERIFRAX
remain stable across time.

If verification outcomes for historical releases change, the verifier
implementation is considered non-conforming.

