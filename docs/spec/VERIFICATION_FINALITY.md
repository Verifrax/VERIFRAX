# VERIFRAX Verification Finality

Status: Normative

---

## 1. Purpose

This document defines verification finality for the VERIFRAX protocol.

Verification finality guarantees that once a verification verdict
has been produced for a specific evidence bundle and protocol
version, the verdict cannot change.

Finality is a core protocol guarantee required for reproducible
verification and auditable trust.

---

## 2. Final Verdict Definition

A final verdict is the deterministic outcome produced by the
verification process.

Possible final verdicts are:

- VERIFIED
- FAILED
- INVALIDATED

These represent terminal protocol outcomes.

---

## 3. Finality Condition

Verification finality is reached when:

1. verification execution reaches a terminal state
2. verdict generation completes
3. verification output is produced

Once these conditions occur, the verification result becomes final.

---

## 4. Immutability of Verdicts

Final verification verdicts MUST NOT change.

Given identical inputs:

- evidence bundle
- protocol version
- verification profile

all compliant implementations MUST produce the same final verdict.

A verdict MUST remain stable across time.

---

## 5. Version-Bound Finality

Verification results are bound to the protocol version used
during verification.

A verification verdict is valid only for the protocol version
that produced it.

Protocol upgrades MUST NOT retroactively alter previously
produced verification results.

---

## 6. Evidence-Bound Finality

Verification results are bound to the evidence bundle.

If the evidence bundle changes in any way:

- canonical hash changes
- verification MUST be re-executed
- the previous verdict does not apply

---

## 7. Reproducibility Requirement

Independent auditors MUST be able to reproduce the final verdict
using:

- the same evidence bundle
- the same protocol version
- the same deterministic algorithms

Reproducibility is required for protocol compliance.

---

## 8. Finality and Trust

Verification finality establishes the trust boundary of the
protocol.

Users of VERIFRAX MUST be able to rely on the fact that
verification outcomes will not change silently.

Finality ensures that verification results remain auditable
and stable across time.

---

## 9. Compliance

A verification engine is VERIFRAX-compliant only if it:

- produces deterministic verdicts
- preserves verification finality
- does not modify previously produced verdicts

