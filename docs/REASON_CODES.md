# Reason Codes Playbook

This document defines all reason codes in the `VFX-<LAYER>-<####>` namespace. Each code must survive courtroom scrutiny with deterministic reproduction instructions.

## Code Format

- **Code**: `VFX-<LAYER>-<####>`
- **Name**: Human-readable name
- **Triggering Condition**: Exact condition
- **Required Proof Artifacts**: Evidence needed
- **Deterministic Reproduction**: Step-by-step instructions
- **Human-Readable Summary**: One-line summary

## AXIOM Layer

### VFX-AXIOM-0001: Contradiction Detected
- **Name**: Contradiction Detected
- **Triggering Condition**: Two claims with same subject have incompatible assertions, both with valid signatures
- **Required Proof Artifacts**: Both claim objects, signature verification results, subject comparison
- **Deterministic Reproduction**: 
  1. Create claim A with subject "X" and assertion "P"
  2. Create claim B with subject "X" and assertion "not P"
  3. Both have valid signatures
  4. Verify both claims → CONTRADICTED
- **Human-Readable Summary**: "Two valid claims about the same subject contradict each other"

### VFX-AXIOM-0002: Unappealable Surface Violation
- **Name**: Unappealable Surface Violation
- **Triggering Condition**: Verdict changed based on external arguments rather than bundle content
- **Required Proof Artifacts**: Verdict output, bundle hash, external state log
- **Deterministic Reproduction**: Attempt to change verdict by providing external arguments without changing bundle content → should fail
- **Human-Readable Summary**: "Verdict cannot be changed by external arguments, only bundle content"

## CONTRACT Layer

### VFX-CONTRACT-0001: Missing Required Field
- **Name**: Missing Required Field
- **Triggering Condition**: Required field in contract is missing from bundle
- **Required Proof Artifacts**: Contract definition, bundle structure, missing field name
- **Deterministic Reproduction**: Remove required field from bundle → verify → INVALID with VFX-CONTRACT-0001
- **Human-Readable Summary**: "Required field '{field_name}' is missing"

### VFX-CONTRACT-0002: Invalid Field Type
- **Name**: Invalid Field Type
- **Triggering Condition**: Field exists but has wrong type (e.g., string instead of array)
- **Required Proof Artifacts**: Contract definition, bundle field, expected vs actual type
- **Deterministic Reproduction**: Change field type to wrong type → verify → INVALID with VFX-CONTRACT-0002
- **Human-Readable Summary**: "Field '{field_name}' has invalid type: expected {expected}, got {actual}"

### VFX-CONTRACT-0003: Contract Version Mismatch
- **Name**: Contract Version Mismatch
- **Triggering Condition**: Bundle references contract version not supported by verifier
- **Required Proof Artifacts**: Bundle contract_hash, verifier supported contract versions
- **Deterministic Reproduction**: Use unsupported contract version in bundle → verify → UNSUPPORTED with VFX-CONTRACT-0003
- **Human-Readable Summary**: "Contract version '{version}' is not supported"

## EVIDENCE Layer

### VFX-EVIDENCE-0001: Missing Required Evidence
- **Name**: Missing Required Evidence
- **Triggering Condition**: Required evidence class is missing from bundle
- **Required Proof Artifacts**: Profile requirements, bundle evidence directory, missing evidence class
- **Deterministic Reproduction**: Remove required evidence from bundle → verify → INVALID with VFX-EVIDENCE-0001
- **Human-Readable Summary**: "Required evidence class '{class}' is missing"

### VFX-EVIDENCE-0002: Evidence Hash Mismatch
- **Name**: Evidence Hash Mismatch
- **Triggering Condition**: Evidence file hash doesn't match declared hash
- **Required Proof Artifacts**: Evidence file, declared hash, computed hash
- **Deterministic Reproduction**: Modify evidence file without updating hash → verify → INVALID with VFX-EVIDENCE-0002
- **Human-Readable Summary**: "Evidence file '{file}' hash mismatch: expected {expected}, got {actual}"

### VFX-EVIDENCE-0003: Evidence Corrupted
- **Name**: Evidence Corrupted
- **Triggering Condition**: Evidence file cannot be parsed or is corrupted
- **Required Proof Artifacts**: Evidence file, parse error
- **Deterministic Reproduction**: Corrupt evidence file → verify → INVALID with VFX-EVIDENCE-0003
- **Human-Readable Summary**: "Evidence file '{file}' is corrupted or unparseable"

### VFX-EVIDENCE-0100: Bundle Hash Mismatch (Fatal)
- **Name**: Bundle Hash Mismatch (Fatal)
- **Triggering Condition**: Computed bundle hash does not match declared bundle hash, or bundle hash computation fails
- **Required Proof Artifacts**: Bundle directory, computed hash, declared hash (if any), computation error
- **Deterministic Reproduction**: Modify any file in bundle (except verdict.json) → verify → INVALID with VFX-EVIDENCE-0100
- **Human-Readable Summary**: "Bundle hash mismatch (fatal) - bundle content has been modified"

## EXEC Layer

### VFX-EXEC-0001: Non-Deterministic Execution
- **Name**: Non-Deterministic Execution
- **Triggering Condition**: Execution trace shows non-deterministic behavior
- **Required Proof Artifacts**: Execution trace, deterministic flag, non-deterministic operations
- **Deterministic Reproduction**: Run with non-deterministic operations → verify → INVALID with VFX-EXEC-0001
- **Human-Readable Summary**: "Execution was non-deterministic"

### VFX-EXEC-0002: Trace Root Mismatch
- **Name**: Trace Root Mismatch
- **Triggering Condition**: Computed trace root doesn't match declared trace root
- **Required Proof Artifacts**: Execution trace, declared trace_root, computed trace_root
- **Deterministic Reproduction**: Modify trace without updating trace_root → verify → INVALID with VFX-EXEC-0002
- **Human-Readable Summary**: "Trace root mismatch: expected {expected}, got {actual}"

## ENV Layer

### VFX-ENV-0001: Missing OS Attestation
- **Name**: Missing OS Attestation
- **Triggering Condition**: OS attestation required by profile but missing
- **Required Proof Artifacts**: Profile requirements, attestation bundle, missing OS field
- **Deterministic Reproduction**: Remove OS attestation from bundle → verify under strict profile → INVALID with VFX-ENV-0001
- **Human-Readable Summary**: "OS attestation is missing (required by profile)"

### VFX-ENV-0002: Missing Architecture Attestation
- **Name**: Missing Architecture Attestation
- **Triggering Condition**: Architecture attestation required by profile but missing
- **Required Proof Artifacts**: Profile requirements, attestation bundle, missing arch field
- **Deterministic Reproduction**: Remove arch attestation from bundle → verify under strict profile → INVALID with VFX-ENV-0002
- **Human-Readable Summary**: "Architecture attestation is missing (required by profile)"

### VFX-ENV-0003: Missing Toolchain Attestation
- **Name**: Missing Toolchain Attestation
- **Triggering Condition**: Toolchain version attestation required by profile but missing
- **Required Proof Artifacts**: Profile requirements, attestation bundle, missing toolchain field
- **Deterministic Reproduction**: Remove toolchain attestation from bundle → verify under strict profile → INVALID with VFX-ENV-0003
- **Human-Readable Summary**: "Toolchain attestation is missing (required by profile)"

### VFX-ENV-0004: Missing Container Digest
- **Name**: Missing Container Digest
- **Triggering Condition**: Container digest required by profile but missing
- **Required Proof Artifacts**: Profile requirements, attestation bundle, missing container_digest field
- **Deterministic Reproduction**: Remove container_digest from bundle → verify under strict profile → INVALID with VFX-ENV-0004
- **Human-Readable Summary**: "Container digest is missing (required by profile)"

### VFX-ENV-0005: Missing Git Commit
- **Name**: Missing Git Commit
- **Triggering Condition**: Git commit hash required by profile but missing
- **Required Proof Artifacts**: Profile requirements, attestation bundle, missing git_commit field
- **Deterministic Reproduction**: Remove git_commit from bundle → verify under strict profile → INVALID with VFX-ENV-0005
- **Human-Readable Summary**: "Git commit is missing (required by profile)"

### VFX-ENV-0006: Missing SBOM Hash
- **Name**: Missing SBOM Hash
- **Triggering Condition**: SBOM hash required by profile but missing
- **Required Proof Artifacts**: Profile requirements, attestation bundle, missing sbom_hash field
- **Deterministic Reproduction**: Remove sbom_hash from bundle → verify under strict profile → INVALID with VFX-ENV-0006
- **Human-Readable Summary**: "SBOM hash is missing (required by profile)"

## CHAIN Layer

### VFX-CHAIN-0001: Invalid Anchor Proof
- **Name**: Invalid Anchor Proof
- **Triggering Condition**: Anchor proof cannot be verified against blockchain
- **Required Proof Artifacts**: Anchor proof, blockchain state, verification result
- **Deterministic Reproduction**: Use invalid anchor proof → verify → INVALID with VFX-CHAIN-0001
- **Human-Readable Summary**: "Anchor proof '{proof_ref}' is invalid"

### VFX-CHAIN-0002: Missing Anchor Commitment
- **Name**: Missing Anchor Commitment
- **Triggering Condition**: Anchor commitment hash is missing
- **Required Proof Artifacts**: Anchor definition, missing commitment_hash
- **Deterministic Reproduction**: Remove commitment_hash from anchor → verify → INVALID with VFX-CHAIN-0002
- **Human-Readable Summary**: "Anchor '{type}' is missing commitment hash"

### VFX-CHAIN-0003: Insufficient Anchor Diversity
- **Name**: Insufficient Anchor Diversity
- **Triggering Condition**: Less than 2 distinct anchor types present
- **Required Proof Artifacts**: Anchor list, anchor types
- **Deterministic Reproduction**: Use only one anchor type → verify → INVALID with VFX-CHAIN-0003
- **Human-Readable Summary**: "At least 2 distinct anchor types required, found {count}"

## SIG Layer

### VFX-SIG-0001: Invalid Signature
- **Name**: Invalid Signature
- **Triggering Condition**: Cryptographic signature verification fails
- **Required Proof Artifacts**: Signature, public key, signed data, verification result
- **Deterministic Reproduction**: Modify signed data without updating signature → verify → INVALID with VFX-SIG-0001
- **Human-Readable Summary**: "Signature '{key_id}' is invalid"

### VFX-SIG-0002: Missing Signature
- **Name**: Missing Signature
- **Triggering Condition**: Required signature is missing
- **Required Proof Artifacts**: Signature requirements, bundle signatures, missing signature
- **Deterministic Reproduction**: Remove required signature → verify → INVALID with VFX-SIG-0002
- **Human-Readable Summary**: "Required signature '{key_id}' is missing"

### VFX-SIG-0003: Expired Key
- **Name**: Expired Key
- **Triggering Condition**: Signing key has expired
- **Required Proof Artifacts**: Key metadata, expiration timestamp, current timestamp
- **Deterministic Reproduction**: Use expired key → verify → INVALID with VFX-SIG-0003
- **Human-Readable Summary**: "Signing key '{key_id}' expired at {expiration}"

### VFX-SIG-0004: Missing Public Key
- **Name**: Missing Public Key
- **Triggering Condition**: Public key for signature verification is missing
- **Required Proof Artifacts**: Signature, missing key_id, key registry
- **Deterministic Reproduction**: Remove public key from registry → verify → INVALID with VFX-SIG-0004
- **Human-Readable Summary**: "Public key '{key_id}' is missing from registry"

## TIME Layer

### VFX-TIME-0001: Future Timestamp
- **Name**: Future Timestamp
- **Triggering Condition**: Timestamp is in the future beyond acceptable clock skew
- **Required Proof Artifacts**: Timestamp, current time, clock skew tolerance
- **Deterministic Reproduction**: Set timestamp to future → verify → INVALID with VFX-TIME-0001
- **Human-Readable Summary**: "Timestamp '{timestamp}' is in the future (clock skew: {skew}s)"

### VFX-TIME-0002: Expired Claim
- **Name**: Expired Claim
- **Triggering Condition**: Claim has expired according to its expiration policy
- **Required Proof Artifacts**: Claim, expiration policy, current time
- **Deterministic Reproduction**: Use expired claim → verify → INVALID with VFX-TIME-0002
- **Human-Readable Summary**: "Claim '{claim_id}' expired at {expiration}"

### VFX-TIME-0003: Clock Skew Too Large
- **Name**: Clock Skew Too Large
- **Triggering Condition**: Clock skew exceeds tolerance
- **Required Proof Artifacts**: Timestamp, current time, skew tolerance, computed skew
- **Deterministic Reproduction**: Set timestamp with large skew → verify → INVALID with VFX-TIME-0003
- **Human-Readable Summary**: "Clock skew {skew}s exceeds tolerance {tolerance}s"

## POLICY Layer

### VFX-POLICY-0001: Profile Requirement Not Met
- **Name**: Profile Requirement Not Met
- **Triggering Condition**: Bundle doesn't meet requirements defined in profile
- **Required Proof Artifacts**: Profile definition, bundle content, unmet requirement
- **Deterministic Reproduction**: Remove required element → verify under profile → INVALID with VFX-POLICY-0001
- **Human-Readable Summary**: "Profile '{profile_id}' requirement '{requirement}' not met"

### VFX-POLICY-0002: Trust Assumption Violation
- **Name**: Trust Assumption Violation
- **Triggering Condition**: Bundle violates trust assumptions defined in profile
- **Required Proof Artifacts**: Profile trust assumptions, bundle content, violation
- **Deterministic Reproduction**: Violate trust assumption → verify under profile → INVALID with VFX-POLICY-0002
- **Human-Readable Summary**: "Trust assumption '{assumption}' violated"

## PROFILE Layer

### VFX-PROFILE-0001: Unsupported Profile
- **Name**: Unsupported Profile
- **Triggering Condition**: Profile version is not supported by verifier
- **Required Proof Artifacts**: Profile ID, verifier supported profiles
- **Deterministic Reproduction**: Use unsupported profile → verify → UNSUPPORTED with VFX-PROFILE-0001
- **Human-Readable Summary**: "Profile '{profile_id}' is not supported"

### VFX-PROFILE-0002: Profile Version Mismatch
- **Name**: Profile Version Mismatch
- **Triggering Condition**: Profile version in bundle doesn't match verifier expectations
- **Required Proof Artifacts**: Bundle profile version, verifier expected version
- **Deterministic Reproduction**: Use mismatched profile version → verify → UNSUPPORTED with VFX-PROFILE-0002
- **Human-Readable Summary**: "Profile version mismatch: expected {expected}, got {actual}"

## LOG Layer

### VFX-LOG-0001: Log Root Mismatch
- **Name**: Log Root Mismatch
- **Triggering Condition**: Computed transparency log root doesn't match declared root
- **Required Proof Artifacts**: Log entries, declared log_root, computed log_root
- **Deterministic Reproduction**: Modify log without updating root → verify → INVALID with VFX-LOG-0001
- **Human-Readable Summary**: "Log root mismatch: expected {expected}, got {actual}"

### VFX-LOG-0002: Missing Log Entry
- **Name**: Missing Log Entry
- **Triggering Condition**: Required log entry is missing
- **Required Proof Artifacts**: Log requirements, log entries, missing entry
- **Deterministic Reproduction**: Remove required log entry → verify → INVALID with VFX-LOG-0002
- **Human-Readable Summary**: "Log entry '{entry_hash}' is missing"

### VFX-LOG-0003: Retroactive Invalidation Matched
- **Name**: Retroactive Invalidation Matched
- **Triggering Condition**: Bundle or claim matches a valid invalidation
- **Required Proof Artifacts**: Invalidation object, bundle/claim, matching criteria
- **Deterministic Reproduction**: Create invalidation targeting bundle → verify bundle → verdict downgraded with VFX-LOG-0003
- **Human-Readable Summary**: "Bundle/claim matches invalidation '{invalidation_id}'"

### VFX-LOG-0101: Active Invalidation Applied
- **Name**: Active Invalidation Applied
- **Triggering Condition**: One or more invalidations match bundle_hash, claim_id, or profile scope
- **Required Proof Artifacts**: Invalidation objects, bundle hash, claim IDs, profile ID, matching results
- **Deterministic Reproduction**: Create invalidation targeting bundle hash → verify bundle → verdict downgraded with VFX-LOG-0101
- **Human-Readable Summary**: "Active invalidation applied - bundle/claim has been invalidated"

## INVALIDATION Layer

### VFX-INVALIDATION-0001: Invalid Invalidation Signature
- **Name**: Invalid Invalidation Signature
- **Triggering Condition**: Invalidation signature is invalid
- **Required Proof Artifacts**: Invalidation object, signature, public key, verification result
- **Deterministic Reproduction**: Modify invalidation without updating signature → verify → INVALID with VFX-INVALIDATION-0001
- **Human-Readable Summary**: "Invalidation '{invalidation_id}' has invalid signature"

### VFX-INVALIDATION-0002: Invalidation Target Not Found
- **Name**: Invalidation Target Not Found
- **Triggering Condition**: Invalidation targets bundle/claim that doesn't exist
- **Required Proof Artifacts**: Invalidation targets, bundle/claim registry
- **Deterministic Reproduction**: Create invalidation targeting non-existent bundle → verify → INVALID with VFX-INVALIDATION-0002
- **Human-Readable Summary**: "Invalidation '{invalidation_id}' targets non-existent '{target}'"

