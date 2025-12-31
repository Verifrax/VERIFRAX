> **NON-AUTHORITATIVE — EXPLANATION ONLY**  
> This document is for educational purposes. Authoritative specifications are in `freeze/v2.4.0/`.

# VERIFRAX Governance: Version Finality

**Version:** 1.0.0  
**Status:** FROZEN  
**Effective:** v2.0.0

This document defines the **version finality guarantees** for VERIFRAX verifiers. It specifies how long older verifiers remain runnable, how version pinning works, and the deprecation policy.

## Core Principle

**Verifier versions are immutable snapshots. Once released, a verifier version must remain runnable and reproducible indefinitely.**

## Verifier Version Pinning

### Version Format

Verifier versions follow semantic versioning:
- **Format:** `MAJOR.MINOR.PATCH`
- **Example:** `2.0.0`, `2.1.0`, `3.0.0`

### Version Components

Each verifier version includes:
- **Verifier binary:** Executable or script
- **Profile definitions:** Supported verification profiles
- **Contract definitions:** Supported evidence bundle contracts
- **Schema definitions:** Supported bundle schemas
- **Reason codes:** Supported verdict reason codes

### Version Pinning in Bundles

Bundles may specify:
- **Verifier version:** `"verifier_version": "2.0.0"` (optional, for reproducibility)
- **Profile version:** `"profile_id": "public@1.0.0"` (required)
- **Contract version:** `"contract_version": "1.0.0"` (required)

### Version Pinning Guarantees

**Guarantee 1: Backward Compatibility**

Older verifier versions remain runnable:
- Verifier v2.0.0 can verify bundles created for v1.0.0 (if compatible)
- Verifier v2.1.0 can verify bundles created for v2.0.0
- Verifier v3.0.0 may break compatibility (MAJOR version bump)

**Guarantee 2: Reproducibility**

Same bundle + same verifier version → same verdict:
- Bundle verified with v2.0.0 must produce identical verdict when re-verified with v2.0.0
- Verdict includes: verdict status, reason codes, bundle_hash

**Guarantee 3: Version Availability**

Released verifier versions are:
- **Archived:** Available for download indefinitely
- **Documented:** Release notes and changelog preserved
- **Reproducible:** Build instructions and dependencies frozen

## Deprecation Policy

### What Gets Deprecated

1. **Profiles:** Old profile versions may be deprecated
2. **Contracts:** Old contract versions may be deprecated
3. **Schemas:** Old schema versions may be deprecated
4. **Reason Codes:** Old reason codes may be deprecated (but remain valid for old verdicts)

### Deprecation Process

**Step 1: Deprecation Notice**

- Published in release notes
- Minimum 90 days notice before removal
- Migration path documented

**Step 2: Support Period**

- Deprecated components remain supported for minimum 1 year
- New bundles cannot use deprecated components
- Old bundles continue to verify correctly

**Step 3: Removal**

- Deprecated components removed from latest verifier
- Old verifier versions remain available
- Old bundles must use archived verifier versions

### Explicit Deprecation Policy

**No Silent Deprecations:**

- All deprecations must be explicitly announced
- All deprecations must have migration paths
- All deprecations must respect minimum notice periods

## Verdict Compatibility

### Verdict Validity Across Versions

**Old verdicts remain valid:**
- Verdict issued by v2.0.0 remains valid even if v3.0.0 is released
- Verdict cannot be "invalidated" by verifier version upgrade
- Only invalidation records can retroactively downgrade verdicts

### Verdict Reproduction

**Reproducing old verdicts:**
- Use the same verifier version that issued the verdict
- Use the same profile version
- Use the same bundle (by bundle_hash)

**If verdict differs:**
- Verifier bug (non-deterministic behavior)
- Bundle content changed (hash mismatch)
- Profile changed (version mismatch)

## Version Lifecycle

### Release

1. **Version Tagged:** Git tag `v2.0.0`
2. **Artifacts Published:** Verifier binary, documentation, schemas
3. **Hash Computed:** Canonical hash of verifier release bundle
4. **Frozen:** Version cannot be modified after release

### Maintenance

- **Bug Fixes:** New PATCH version (e.g., 2.0.1)
- **Features:** New MINOR version (e.g., 2.1.0)
- **Breaking Changes:** New MAJOR version (e.g., 3.0.0)

### Archive

- **Old Versions:** Remain available indefinitely
- **Documentation:** Preserved with version
- **Build Instructions:** Frozen for reproducibility

## Institutional Guarantees

### Long-Term Reproducibility

**Guarantee:** Verdicts issued today remain reproducible in 10+ years:
- Verifier versions archived
- Dependencies documented
- Build environment specified
- Reproducibility instructions provided

### Version Audit Trail

**All version changes are:**
- Tagged in git
- Documented in changelog
- Justified with rationale
- Backward compatibility assessed

### Zero Silent Breaking Changes

**Policy:** No breaking changes without:
1. MAJOR version bump
2. Explicit deprecation notice
3. Migration path documented
4. Minimum notice period respected

## Version Pinning in Production

### Edge API Versioning

- **Current:** v2.0.0 (frozen)
- **API Endpoints:** `/api/upload` (no version prefix for v2)
- **Future Versions:** `/api/v3/upload` (explicit versioning)

### Verifier Version Selection

- **Default:** Latest stable version
- **Explicit:** Bundle can request specific verifier version (if supported)
- **Fallback:** If requested version unavailable, use latest compatible version

## Freeze Protocol

### Version Freeze

Each release freezes:
- Verifier binary
- Profile definitions
- Contract definitions
- Schema definitions
- API specification
- Documentation

### Freeze Artifacts

Stored in `freeze/v2/releases/v2.0.0/`:
- `wrangler.toml` (Worker configuration)
- `index.js` (Worker source)
- `V2_EDGE_API.md` (API specification)
- Governance documents
- `SHA256SUMS.txt` (canonical hashes)

## References

- `GOVERNANCE_DISPUTE_FINALITY.md` - Dispute resolution protocol
- `EVIDENCE_BUNDLE_SPEC_v1.md` - Bundle structure
- `freeze/v2/README.md` - Freeze protocol
- `VERSION.txt` - Current version

