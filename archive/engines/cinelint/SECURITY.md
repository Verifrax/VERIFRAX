PBFT: enabled
Slashing: enforced
Threshold signatures: required
Zero-trust: enabled
Audit logs: immutable

## Typed Verdict Invariant (Non-Negotiable)

All security-critical verification paths MUST:
- Return explicit, typed verdicts (e.g. "VALID", "ANCHORS_VALID")
- NEVER return boolean success
- Throw on failure (fail-closed)

Any boolean success path in zk, anchoring, attestation, or transparency code
is a release-blocking violation.
