# VERIFRAX Canonical Verdict Generation

Status: Normative

---

## 1. Purpose

This document defines the deterministic verdict generation
algorithm used by the VERIFRAX protocol.

The verdict generation algorithm determines the final
verification outcome produced by the verification engine.

Verdict generation MUST be deterministic across all compliant
implementations.

---

## 2. Verdict Types

The protocol defines three possible verification verdicts:

VERIFIED  
FAILED  
INVALIDATED

No additional verdict types are permitted.

---

## 3. Verdict Determination Order

Verification engines MUST determine the final verdict using
the following deterministic precedence order.

1. INVALIDATED
2. FAILED
3. VERIFIED

The highest-precedence applicable condition determines the
final verdict.

---

## 4. INVALIDATED Conditions

Verification MUST produce the verdict:

INVALIDATED

if any of the following conditions occur:

- contradiction detection
- profile incompatibility
- invalidation rule trigger
- malformed bundle structure
- unsupported protocol conditions

INVALIDATED represents a terminal verification outcome.

---

## 5. FAILED Conditions

Verification MUST produce the verdict:

FAILED

when verification rules fail but no invalidation condition
occurs.

Examples include:

- invalid signatures
- hash mismatches
- protocol rule violations

FAILED indicates that verification completed but the
verification claim did not succeed.

---

## 6. VERIFIED Conditions

Verification MUST produce the verdict:

VERIFIED

only when:

- no invalidation condition occurs
- no verification failures occur
- all protocol verification rules succeed

VERIFIED represents successful verification.

---

## 7. Deterministic Requirement

Given identical inputs and protocol version, compliant
implementations MUST produce identical verification verdicts.

Verdict generation MUST NOT depend on:

- runtime environment
- implementation heuristics
- execution timing

---

## 8. Protocol Finality

Once a verdict has been generated:

- verification execution MUST terminate
- the verdict MUST remain immutable
- the verdict MUST be bound to the bundle hash

Verdict finality ensures protocol reproducibility.

---

## 9. Compliance

An implementation is VERIFRAX-compliant only if it:

- follows the canonical verdict generation rules
- produces deterministic verification verdicts
- respects verdict precedence rules

