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

VERIFRAX v2.3.0 is frozen.

No retroactive changes will be made to:
- Verification logic
- Certificate format
- Finality statements

All verdicts and certificates issued by v2.3.0 survive:
- Company failure
- Infrastructure changes
- Service discontinuation

Verification artifacts remain independently verifiable regardless of VERIFRAX operational status.

---

## Finality Declaration

VERIFRAX v2.4.0 is frozen.

No retroactive changes will be made to:
- Verification logic
- Certificate format
- Finality semantics
- Reference verifier behavior

All certificates and verdicts issued by v2.4.0 survive:
- Company failure
- Infrastructure changes
- Service discontinuation

Verification artifacts remain independently verifiable without VERIFRAX.

### Cryptographic Anchors

**Freeze commit:** `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

**Worker version hash:** `sha256:07b7164b80b10ee59f56ad6465e3b6c2cf127bfec26fc2b71638020b19d7f5c8`

**Freeze artifact hashes:**
- `a11cea82c2e9f76f61c43223fcb32e19c6731b7238efbccb13fc24e7ca240366` - `freeze/v2.4.0/REFERENCE_VERIFIER.md`
- `56b1c0bbcd5ffcf5164501f0216e787895ca58ec57581cb1e354cf6ebd9fba61` - `freeze/v2.4.0/RELEASE_v2.4.0.md`
- `97f3de610c482b05417e13eb09103e24de01dbf0729ed638bbe8b9c9dda124c5` - `freeze/v2.4.0/SYSTEM_SURFACE_MANIFEST.md`
- `8105eb9b812f69acf89ce1f9e814e6902da73800ac85607c3f515b349a9280b1` - `freeze/v2.4.0/VERSION.md`

---

## Profile Finality

For v2.3.0 and v2.4.0, verification profiles are treated as **externally interpretable rule sets** whose semantic meaning is not provided by VERIFRAX.

The certificate confirms execution *against a profile identifier*, not the correctness or completeness of the profile itself.

VERIFRAX does not:
- Provide profile semantics
- Provide profile correctness
- Provide profile completeness
- Interpret profile meaning

VERIFRAX does:
- Execute verification against the specified profile identifier
- Include the profile identifier in the certificate
- Produce deterministic results for the same bundle and profile identifier

Profile interpretation and meaning are external to VERIFRAX.

