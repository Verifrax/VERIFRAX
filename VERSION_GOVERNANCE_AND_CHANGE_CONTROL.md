# VERIFRAX — Version Governance and Change Control

## Authority

This document defines what may change and what is permanently forbidden in VERIFRAX, across all versions. This document is binding on all future versions. Violation of forbidden changes constitutes a system break, not a feature.

---

## Frozen Versions

A frozen version means:

- No retroactive changes to verification logic
- No retroactive changes to certificate format
- No retroactive changes to finality semantics
- No retroactive changes to reference verifier behavior
- All changes require explicit version increment
- Frozen versions remain independently verifiable forever

v2.4.0 is frozen. All future versions must increment version number.

---

## Permitted Changes (Future Versions Only)

Future versions may:

- Add new verification profiles (with new profile IDs)
- Add new reason codes (non-conflicting with existing codes)
- Add new certificate fields (backward-compatible extensions only)
- Improve reference verifier performance (behavior must remain identical)
- Add new documentation (non-authoritative)
- Fix bugs that cause non-deterministic behavior (must preserve deterministic outputs)
- Add new API endpoints (with version prefixes, e.g., `/api/v3/verify`)
- Change pricing (new version, new pricing)
- Improve error messages (non-semantic changes only)

All permitted changes require explicit version increment. No changes to frozen versions.

---

## Forbidden Changes (All Versions)

The following changes are permanently forbidden, across all versions:

- Retroactive logic changes to frozen versions
- Certificate reinterpretation or re-evaluation
- Finality weakening (making certificates mutable or revocable)
- Adding mutable state to verification execution
- Adding accounts, sessions, or user identity to verification
- Turning payment into access, subscription, or ongoing service
- Turning verification into advice, judgment, or legal validation
- Introducing subscriptions, recurring billing, or stored value
- Making certificates dependent on VERIFRAX infrastructure
- Making certificates dependent on VERIFRAX availability
- Changing deterministic behavior to non-deterministic
- Breaking reference verifier compatibility with frozen versions
- Modifying frozen version certificates after issuance
- Adding revocation mechanisms to certificates
- Making payment refundable by default (discretion only)
- Adding guarantees, warranties, or promises beyond execution
- Making verification depend on external services or networks
- Adding time-dependent logic that affects verification outcomes
- Breaking certificate independence from infrastructure
- Making certificates require VERIFRAX for verification

These prohibitions apply to all versions, present and future.

---

## Version Increment Requirements

A new version number is required when:

- Verification logic changes (even if behavior appears identical)
- Certificate format changes (even if backward-compatible)
- Finality semantics change
- Reference verifier behavior changes
- Payment model changes
- API contract changes (without version prefix)
- Deterministic behavior changes
- Profile interpretation changes

Version increments are mandatory, not optional. Skipping version increments is forbidden.

---

## Non-Negotiable Invariants

These system truths never change, across all versions:

- Verification is deterministic (same inputs → same outputs)
- Certificates are immutable after issuance
- Certificates are independently verifiable
- Certificates do not require VERIFRAX infrastructure
- Payment authorizes computation only (not service, not access)
- No accounts, sessions, or user identity in verification
- No mutable state in verification execution
- Reference verifier wins over infrastructure
- Frozen versions remain frozen forever
- Version increments are mandatory for any change

These invariants are permanent. Violation breaks the system.

---

## Final Lock Statement

No version may violate forbidden changes. No version may break non-negotiable invariants. Frozen versions remain frozen forever. This governance is binding on all future versions.

---

**Status:** FROZEN — v2.4.0

**Authority:** This document is binding on all VERIFRAX versions.

**Updates:** No updates without explicit version increment.

