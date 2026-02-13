# VERIFRAX Legal Evidence Package v2.3.0

**Frozen Release - Immutable**

## Purpose

The VERIFRAX Legal Evidence Package format enables court-grade evidence submission using VERIFRAX certificates. A complete package is self-contained and enables independent verification without any VERIFRAX infrastructure.

## Evidence Package Format

A complete Evidence Package contains:

1. **bundle.bin** - Original evidence bundle
2. **certificate.json** - VERIFRAX-issued certificate
3. **Reference Verifier** - From `verifrax-reference-verifier/` (v2.3.0)
4. **SHA256SUMS** - Package integrity hashes

## Legal Usage

See `verifrax-reference-verifier/LEGAL_USAGE.md` for complete legal boundaries.

### What Certificate Proves

- Cryptographic integrity
- Verification execution
- Finality declaration
- Independent verifiability

### What Certificate Does NOT Prove

- Truth or accuracy
- Intent or authorship
- Legal compliance
- Quality or suitability
- Completeness

## Third-Party Verification

Any third party (judge, auditor, regulator) can verify a package independently:

1. Verify file hashes (`sha256sum -c SHA256SUMS`)
2. Run reference verifier on certificate
3. Confirm `VALID` status

**No VERIFRAX involvement required.**

## Result

> A judge, auditor, or regulator can verify without asking VERIFRAX anything.

This turns VERIFRAX into a **procedural fact**, not a service.

## Version

**v2.3.0** (frozen, immutable)

This format applies to certificates issued by VERIFRAX Worker v2.3.0.

