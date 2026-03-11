# VERIFRAX Reference Verification Transcripts

This document publishes the canonical reference verification transcripts for VERIFRAX.

The purpose of these transcripts is to give external implementers a stable,
human-readable output target for deterministic verification behavior.

## Objective

Reference transcripts exist to provide:

- canonical verifier output examples
- deterministic output comparison targets
- implementation debugging aids
- external interoperability reference material

## Transcript Set

The initial reference transcript set includes:

- Node reference verifier transcript
- Rust minimal verifier transcript

Locations:

- docs/examples/examples-transcripts/node-verifier-reference.txt
- docs/examples/examples-transcripts/rust-verifier-reference.txt

## Expected Use

External implementers may use these transcripts to:

- compare verifier output byte-for-byte
- validate deterministic execution behavior
- debug integration mismatches
- confirm cross-implementation equivalence

## Transcript Rule

Reference transcripts must:

- remain byte-identical for the protocol release
- reflect canonical verifier behavior
- remain traceable to protocol release evidence
- align with the conformance and reproducibility surfaces

## Non-Goals

These transcripts do not replace:

- the official conformance suite
- release evidence bundles
- certification review artifacts

They are public deterministic reference outputs only.

## Conclusion

The reference verification transcripts provide a stable public output baseline
for systems implementing VERIFRAX outside the reference repository.

