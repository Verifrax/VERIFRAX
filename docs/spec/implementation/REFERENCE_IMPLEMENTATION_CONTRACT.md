# VERIFRAX Reference Implementation Contract

## Purpose

This document defines the formal behavioral contract that any
VERIFRAX protocol implementation MUST satisfy in order to be
considered conformant with the protocol.

The contract ensures that independent implementations produce
identical verification outcomes for identical inputs.

This contract applies to:

• reference verifiers
• independent third-party implementations
• experimental verification engines

Implementations failing to satisfy this contract MUST NOT claim
protocol compatibility.

---

## Deterministic Input Model

Implementations MUST accept verification inputs defined by the
VERIFRAX bundle structure.

Inputs include:

• protocol version
• bundle hash
• claims
• evidence
• attestations
• optional protocol metadata

Inputs MUST be interpreted strictly according to the canonical
protocol specification.

Implementations MUST NOT introduce implicit fields or heuristics.

---

## Verification Execution

Verification execution MUST follow the deterministic evaluation
rules defined by the protocol algorithms.

Execution MUST include:

1. bundle structural validation
2. canonical normalization
3. profile compatibility evaluation
4. signature verification
5. contradiction detection
6. invalidation semantics
7. verdict generation
8. finality enforcement

Implementations MUST evaluate these stages deterministically.

Execution ordering MUST remain stable across implementations.

---

## Deterministic Verdict Generation

Implementations MUST produce verification verdicts conforming to
the canonical verdict model defined in:

protocol-conformance/v2/EXPECTED_VERDICT_FORMAT.md

Verdicts MUST be identical across implementations when inputs
and protocol version are identical.

Permitted verdict values:

• VERIFIED
• FAILED
• INVALIDATED

Optional fields MAY appear according to verification outcome.

---

## Conformance Requirements

An implementation is considered protocol-compatible only if it:

• passes all conformance suites
• produces deterministic verdict outputs
• preserves canonical equivalence behavior
• respects invalidation semantics
• enforces finality guarantees

Conformance suites are located in:

protocol-conformance/

---

## Implementation Independence

The protocol MUST remain implementation-neutral.

The reference verifier exists only as a behavioral specification.

Independent implementations MAY use any language or runtime
environment provided they satisfy this contract.

---

## Compliance Declaration

Implementations claiming VERIFRAX compatibility SHOULD publish:

• implementation identifier
• supported protocol version
• conformance suite results
• deterministic build information

Compliance declarations enable ecosystem interoperability.
