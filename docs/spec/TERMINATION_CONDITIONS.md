# VERIFRAX Verification Termination Conditions

Status: Normative

---

## 1. Purpose

This document defines the termination conditions of the VERIFRAX
verification protocol.

Termination conditions determine when verification execution
MUST stop and produce a final outcome.

All compliant implementations MUST follow the termination
rules defined in this specification.

---

## 2. Deterministic Termination

Verification execution MUST terminate deterministically.

Given identical inputs and protocol version, implementations
MUST terminate at the same protocol state.

Verification engines MUST NOT enter indefinite or
non-terminating execution states.

---

## 3. Terminal States

Verification execution may terminate only in the following
terminal states:

- VERIFIED
- FAILED
- INVALIDATED

No additional terminal states are permitted.

---

## 4. Successful Verification Termination

Verification terminates with VERIFIED when:

- the evidence bundle structure is valid
- canonicalization succeeds
- bundle hash derivation succeeds
- signatures are valid
- no contradictions invalidate the claims
- no invalidation rules trigger

All verification stages MUST complete successfully.

---

## 5. Failure Termination

Verification terminates with FAILED when:

- protocol rules are violated
- signature verification fails
- canonicalization fails
- required evidence is missing
- policy evaluation fails

Failures MUST follow the deterministic failure semantics
defined in the protocol specification.

---

## 6. Invalidation Termination

Verification terminates with INVALIDATED when:

- contradiction analysis invalidates evidence
- invalidation rules trigger
- evidence conflicts render claims non-verifiable

Invalidation represents a deterministic protocol outcome.

---

## 7. Early Termination

Verification MAY terminate early when a failure condition
is detected.

In such cases:

1. failure classification MUST occur
2. verdict generation MUST occur
3. verification execution MUST stop

No further verification stages may execute.

---

## 8. Finality of Termination

Once verification reaches a terminal state:

- execution MUST stop
- the verdict MUST remain stable
- no further evaluation is permitted

Terminal states represent irreversible protocol outcomes.

---

## 9. Implementation Compliance

Implementations MUST guarantee that:

- termination conditions are deterministic
- terminal states are identical across implementations
- verification always reaches a terminal state

