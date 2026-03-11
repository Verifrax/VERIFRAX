# VERIFRAX Deterministic Verifier Specification

## Purpose

This document defines the deterministic execution model that all
VERIFRAX verification engines MUST follow.

The goal is to ensure that independent implementations produce
identical verification results when given identical inputs and
protocol version.

Deterministic verification is the foundation of protocol-level
interoperability.

---

## Deterministic Inputs

Verification engines MUST consume inputs defined by the
VERIFRAX bundle structure.

A verification input includes:

• protocol_version  
• bundle_hash  
• claims  
• evidence  
• attestations  
• optional protocol metadata

Inputs MUST be interpreted strictly according to the normative
protocol specification.

No implementation-specific fields may influence verification
behavior.

---

## Canonical Processing Order

Verification MUST follow the canonical evaluation sequence.

Implementations MUST execute the following stages:

1. bundle structure validation  
2. canonical normalization  
3. profile compatibility evaluation  
4. signature verification  
5. contradiction detection  
6. invalidation processing  
7. verdict generation  
8. finality enforcement  

The execution order MUST remain stable across implementations.

---

## Canonical Normalization

Structured inputs MUST be normalized using canonical JSON
semantics.

Normalization rules:

• object keys MUST be sorted lexicographically  
• arrays MUST preserve order  
• whitespace MUST NOT affect semantics  

Normalization ensures cross-language equivalence.

---

## Deterministic Verdict Generation

Verification engines MUST generate verdicts using the canonical
verdict model.

Permitted values:

VERIFIED  
FAILED  
INVALIDATED  

Verdict outputs MUST follow the canonical format defined in:

protocol-conformance/v2/EXPECTED_VERDICT_FORMAT.md

---

## Deterministic Failure Handling

Verification failures MUST produce deterministic failure classes.

Examples:

• INVALID_EVIDENCE_STRUCTURE  
• MISSING_PROTOCOL_VERSION  
• MISSING_BUNDLE_HASH  
• CONTRADICTION_DETECTED  
• CLAIM_INVALIDATED  

Implementations MUST NOT introduce undefined failure classes.

---

## Conformance Execution

Implementations MUST execute the official conformance suites.

Location:

protocol-conformance/v2/

Successful execution of the suites demonstrates protocol
compatibility.

---

## Cross-Implementation Consistency

Independent implementations MUST produce:

• identical verdict outputs  
• identical canonical bundle hashes  
• identical failure classes  
• identical finality states  

Any deviation indicates non-compliance.

---

## Protocol Compatibility

An implementation is considered VERIFRAX-compatible only if it:

• follows this deterministic verifier specification  
• satisfies the reference implementation contract  
• passes the official conformance suites  
• preserves deterministic verification behavior

## Adversarial Integrity Considerations

VERIFRAX verification surfaces must be interpreted under adversarial conditions.

The protocol therefore assumes that ambiguity, silent drift, shadow authority, path confusion, unverifiable historical substitution, and verifier-surface impersonation are live failure modes rather than theoretical edge cases.

### Required adversarial posture

Maintained implementations and auditors must defend against at least the following repository-level threats:

- substitution of historical material for active authority surfaces
- presentation of archived verifier material as maintained verifier authority
- freeze-surface ambiguity between historical and active release declarations
- conformance drift through unofficial or superseded suite roots
- path-level confusion between explanatory documentation and normative protocol semantics
- release verification claims that do not resolve through maintained verifier and release-integrity surfaces

### Protocol consequence

Deterministic verification is not sufficient unless authority resolution is also deterministic.

For that reason, active verification interpretation must resolve through:

- normative semantics: `docs/spec/`
- conformance authority: `protocol-conformance/`
- maintained verifier surfaces: `verifier/node`, `verifier/rust`
- active freeze authority: `release-integrity/freeze-surfaces.json`
- repository authority boundary: `AUTHORITY.md`

Any verification result that depends on superseded, archived, or historically preserved material outside those surfaces is outside the maintained active repository contract.

