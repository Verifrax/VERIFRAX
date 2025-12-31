> **NON-AUTHORITATIVE — EXPLANATION ONLY**  
> This document is for educational purposes. Authoritative specifications are in `freeze/v2.4.0/`.

# VERIFRAX Governance: Dispute Finality

**Version:** 1.0.0  
**Status:** FROZEN  
**Effective:** v2.0.0

This document defines the **dispute finality protocol** for VERIFRAX. It specifies what evidence is admissible, what invalidates a bundle, and the dispute resolution process.

## Core Principle

**Verdict finality is achieved through deterministic verification, not through human adjudication.**

Once a verdict is issued for a bundle, it cannot be changed except by:
1. Re-running the verifier with the same bundle and profile (must produce identical result)
2. Discovering an invalidation that retroactively applies to the bundle
3. Verifier bug fix (requires explicit versioning and re-verification)

## Admissible Evidence Rules

### What Constitutes Evidence

Evidence must be:
- **Contained in the bundle:** All evidence files must be present in the uploaded bundle
- **Hash-verifiable:** Each evidence file must have a declared hash that matches its content
- **Timestamped:** Evidence must include creation timestamps (metadata only, excluded from hash)
- **Signed (if required by profile):** Cryptographic signatures must be present and valid

### What is NOT Evidence

The following are **excluded** from verification:
- External data fetched at verification time
- Mutable state (databases, APIs, external services)
- Human testimony or interpretation
- Post-upload modifications to bundle content

### Evidence Bundle Structure

Evidence bundles must conform to the structure defined in `EVIDENCE_BUNDLE_SPEC_v1.md`:
- `bundle.json` manifest
- `evidence/` directory with evidence files
- `claims/` directory with claim definitions
- `signatures/` directory with cryptographic signatures
- `attestations/` directory with external attestations (if any)

## Bundle Invalidation

### What Invalidates a Bundle

A bundle is invalidated if:

1. **Hash Mismatch:** Computed bundle hash does not match declared hash
2. **Missing Required Evidence:** Profile requires evidence that is absent
3. **Invalid Signature:** Cryptographic signature verification fails
4. **Contradiction Detected:** Two claims with same subject have incompatible assertions
5. **Retroactive Invalidation:** An invalidation record matches the bundle_hash, claim_id, or profile scope
6. **Contract Violation:** Bundle violates the evidence bundle contract (see `core/contracts/evidence_bundle.contract.json`)

### Invalidation Process

Invalidations are:
- **Cryptographically signed:** Must include valid signature from authorized issuer
- **Publicly discoverable:** Published in the truth index (`index/invalidations.ndjson`)
- **Retroactive:** Can invalidate bundles verified before the invalidation was issued
- **Deterministic:** Verifier must check invalidations and downgrade verdict accordingly

### Invalidation Matching

An invalidation matches a bundle if:
- `invalidation.target.bundle_hash === bundle.bundle_hash`, OR
- `invalidation.target.claim_id` matches any claim in bundle, OR
- `invalidation.target.profile_id === bundle.profile_id`

## Dispute Protocol

### What Changes a Verdict

**Short answer: Nothing, except re-running the verifier.**

The verdict for a bundle is **immutable** once issued, unless:

1. **Re-verification:** Same bundle + same profile → must produce identical verdict
2. **Invalidation Applied:** New invalidation matches bundle → verdict downgraded with `VFX-LOG-0101` reason code
3. **Verifier Bug Fix:** Verifier version updated → old verdicts remain valid, new verification may differ

### Dispute Resolution Process

**Step 1: Verify Reproducibility**

Disputant must demonstrate:
- Same bundle hash
- Same profile ID
- Same verifier version
- Different verdict output

If verdict differs, this indicates:
- Non-deterministic verifier (bug)
- Bundle content changed (hash mismatch)
- Profile changed (version mismatch)

**Step 2: Check Invalidations**

If verdict is `VERIFIED` but should be `INVALID`, check:
- Truth index for matching invalidations
- Invalidation signatures
- Invalidation scope (bundle_hash, claim_id, profile_id)

**Step 3: Verifier Bug Report**

If verifier is non-deterministic:
- Report bug with reproduction steps
- Verifier maintainer fixes bug
- New verifier version released
- Old verdicts remain valid (frozen)
- New verification with fixed verifier may produce different result

### What Does NOT Change a Verdict

The following **cannot** change a verdict:
- External arguments or testimony
- Post-upload evidence discovery
- Human interpretation or judgment
- Appeals or reconsideration requests
- Time passage (unless invalidation issued)

## Finality Guarantees

### Verdict Immutability

Once a verdict is issued:
- It cannot be "overturned" by human decision
- It cannot be changed by external evidence
- It can only be invalidated by cryptographically signed invalidation record

### Reproducibility Guarantee

Any third party can:
1. Download the bundle (by bundle_hash)
2. Run the same verifier version
3. Apply the same profile
4. Reproduce the exact same verdict

### Invalidation Transparency

All invalidations are:
- Publicly discoverable in truth index
- Cryptographically signed
- Deterministically applied by verifier
- Non-repudiable

## Institutional Compatibility

This protocol enables:
- **Courtroom admissibility:** Verdicts are reproducible and auditable
- **Audit compliance:** Immutable evidence trail
- **Regulatory reporting:** Deterministic verification process
- **Zero human discretion:** No escalation path that requires human judgment

## Versioning

This governance document is **frozen** as of v1.0.0. Changes require:
1. New version number (v1.1.0, v2.0.0, etc.)
2. Explicit deprecation notice
3. Migration path for existing verdicts

## References

- `EVIDENCE_BUNDLE_SPEC_v1.md` - Bundle structure specification
- `REASON_CODES.md` - Verdict reason codes
- `core/contracts/evidence_bundle.contract.json` - Bundle contract
- `index/invalidations.ndjson` - Public invalidation index

