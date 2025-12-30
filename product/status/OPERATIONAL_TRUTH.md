# VERIFRAX Operational Truth

This document defines authoritative operational facts.

---

## System State

VERIFRAX operates as a deterministic verification system.

No mutable user state exists.
No accounts exist.
No sessions exist.

---

## Availability

Verification execution is availability-dependent.
Historical verification artifacts remain valid regardless of system state.

---

## Failure Modes

If VERIFRAX is unavailable:
- No execution occurs
- No finality is issued
- No partial states are created

Previously issued artifacts remain verifiable.

---

## Transparency

Operational status reflects factual system behavior only.
No marketing, estimates, or forward-looking statements are provided.

---

## Finality Declaration

VERIFRAX v2.4.0 is frozen.

No retroactive changes will be made to:
- Verification logic
- Certificate format
- Finality statements

All verdicts and certificates issued by v2.4.0 survive:
- Company failure
- Infrastructure changes
- Service discontinuation

Verification artifacts remain independently verifiable regardless of VERIFRAX operational status.

---

## Profile Finality

For v2.4.0, verification profiles are treated as **externally interpretable rule sets** whose semantic meaning is not guaranteed by VERIFRAX.

The certificate guarantees execution *against a profile identifier*, not the correctness or completeness of the profile itself.

VERIFRAX does not:
- Guarantee profile semantics
- Guarantee profile correctness
- Guarantee profile completeness
- Interpret profile meaning

VERIFRAX does:
- Execute verification against the specified profile identifier
- Include the profile identifier in the certificate
- Produce deterministic results for the same bundle and profile identifier

Profile interpretation and meaning are external to VERIFRAX.

