# VERIFRAX Reference Verifier v2.3.0

**Frozen Release - Immutable**

## Purpose

The VERIFRAX Reference Verifier v2.3.0 enables independent certificate verification without requiring VERIFRAX infrastructure, services, or availability.

## Authority

This verifier is the **authoritative reference implementation** for verifying certificates issued by VERIFRAX Worker v2.3.0.

## Location

Source: `verifrax-reference-verifier/`

## Files

All files are hashed in `verifrax-reference-verifier/SHA256SUMS`:

See `verifrax-reference-verifier/SHA256SUMS` for authoritative file hashes.

## Verification Algorithm

1. Recompute `bundle_hash` from `bundle.bin` (SHA-256)
2. Rebuild certificate object (excluding `certificate_hash`)
3. Canonical-stringify certificate object
4. Recompute `certificate_hash` (SHA-256)
5. Compare with `certificate.json.certificate_hash`

**Match → VALID**  
**Mismatch → INVALID**

## Determinism

This verifier is deterministic:
- Same inputs → same outputs
- No randomness
- No network calls
- No time-dependent logic

## Usage

```bash
node cli.js \
  --bundle bundle.bin \
  --certificate certificate.json \
  --profile public@1.0.0
```

## Independence

This verifier requires **zero** VERIFRAX infrastructure:
- No Cloudflare Workers
- No Stripe
- No R2
- No network (after download)
- No VERIFRAX service

## Binding

This verifier binds:
- Logic (canonical stringify, hash computation)
- Output format (JSON status)
- Verification authority (deterministic algorithm)

## Survivability

Certificates verified by this verifier remain valid even if:
- VERIFRAX service is offline
- VERIFRAX domain is gone
- VERIFRAX company ceases operations
- All VERIFRAX infrastructure is destroyed

## Version

**v2.3.0** (frozen, immutable)

This matches VERIFRAX Worker verifier version 2.3.0.

## See Also

- `VERIFY_WITHOUT_VERIFRAX.md` - Complete guide for verifying when VERIFRAX is unavailable
- `OPERATIONAL_TRUTH.md` - Authoritative hashes and truth index

