# VERIFRAX Formal Failure Taxonomy

This document defines the formal taxonomy of deterministic verification
failures recognized by the VERIFRAX protocol.

The purpose of this taxonomy is to ensure that all conforming
implementations classify verification failures identically.

## Objective

Failure classification must be:

- deterministic
- implementation-neutral
- stable across protocol releases
- reproducible across environments

A verifier must never invent undefined failure classes.

## Failure Categories

### Structural Failures

These failures occur when the artifact cannot be interpreted as a valid
protocol object.

Examples:

- malformed JSON
- missing required fields
- invalid field types
- invalid bundle structure

Representative classes:

- MALFORMED_ARTIFACT
- INVALID_EVIDENCE_STRUCTURE
- MISSING_PROTOCOL_VERSION
- MISSING_BUNDLE_HASH

### Canonicalization Failures

These failures occur when artifact canonical form cannot be established.

Examples:

- invalid serialization
- ambiguous field encoding
- canonical hash mismatch

Representative classes:

- CANONICALIZATION_FAILURE
- HASH_MISMATCH

### Signature Failures

These failures occur when cryptographic authenticity cannot be established.

Examples:

- invalid signature bytes
- unknown signing key
- signature digest mismatch
- signature absent where required

Representative classes:

- INVALID_SIGNATURE
- UNKNOWN_SIGNER
- SIGNATURE_MISMATCH
- MISSING_SIGNATURE

### Profile Failures

These failures occur when artifact profile requirements are not satisfied.

Examples:

- unsupported profile
- malformed profile metadata
- incompatible profile constraints

Representative classes:

- UNSUPPORTED_PROFILE
- MALFORMED_PROFILE
- PROFILE_CONFLICT

### Logical Verification Failures

These failures occur when the artifact is structurally valid but fails
the protocol verification rules.

Examples:

- contradictory claims
- invalid evidence relationships
- failed verification conditions

Representative classes:

- CONTRADICTION_DETECTED
- VERIFICATION_RULE_FAILURE
- INVALID_CLAIM_RELATIONSHIP

### Invalidation Failures

These failures occur when an artifact has been explicitly invalidated.

Examples:

- revoked claim
- invalidated authority
- terminated verification lineage

Representative classes:

- CLAIM_INVALIDATED
- AUTHORITY_INVALIDATED
- LINEAGE_TERMINATED

### Finality Failures

These failures occur when protocol finality rules are violated.

Examples:

- mutation after finality
- conflicting post-finality evidence
- invalid finality state

Representative classes:

- FINALITY_VIOLATION
- POST_FINALITY_MUTATION
- INVALID_FINALITY_STATE

## Failure Classification Rules

A conforming verifier must:

1. assign exactly one deterministic failure class per failure condition
2. avoid undefined failure classes
3. preserve identical classification across implementations
4. emit taxonomy-consistent failure results

## Taxonomy Stability

Failure classes are part of protocol semantics.

Any change to existing failure classes requires a new protocol release.

Historical verification results must continue using the taxonomy
defined by the release under which they were verified.

## Compliance Requirement

An implementation is considered non-conforming if it:

- invents new undefined failure classes
- collapses distinct failure classes incorrectly
- classifies identical failures differently from the protocol taxonomy

