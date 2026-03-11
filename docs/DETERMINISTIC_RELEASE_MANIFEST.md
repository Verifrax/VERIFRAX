# VERIFRAX Deterministic Release Manifest

## Purpose

Define the deterministic contents of a VERIFRAX protocol release.

A release manifest specifies the exact artifacts and surfaces that define a protocol version.

This guarantees that protocol history cannot silently drift.

## Release Components

Each release includes the following deterministic components.

### Protocol Specification

The normative protocol specification defining verification semantics.

### Reference Verifiers

Independent implementations that execute the protocol.

Current implementations:

- Node reference verifier
- Rust minimal verifier

### Protocol Conformance Suites

Canonical verification suites that define protocol correctness.

Location:

protocol-conformance/

### Canonical Artifact Formats

Protocol artifact structures.

Examples:

- bundle.json
- verdict.json

### Canonical Hash Rules

Deterministic hashing rules applied to protocol artifacts.

### Protocol Profiles

Verification behavior definitions under different contexts.

### Verification Outputs

Deterministic verification results for the conformance suites.

Example:

canonical-equivalence: PASS  
contradiction: PASS  
finality-lock: PASS  
invalidation: PASS  
minimal-invalid: PASS  
minimal-valid: PASS  
profile-compatibility: PASS  
signature-verification: PASS

## Release Integrity

A protocol release is considered valid only if:

- all frozen surfaces remain byte-identical
- canonical artifact hashes remain identical
- conformance suite verdicts remain identical
- independent implementations produce identical outputs

## Deterministic Guarantee

Any implementation executing the release manifest must produce identical verification outcomes.

## Conclusion

The deterministic release manifest defines the canonical state of a VERIFRAX protocol release.

