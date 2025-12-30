# VERIFRAX Reference Verifier v2.4.0

**Independent certificate verification without VERIFRAX infrastructure.**

This verifier allows third parties to validate VERIFRAX certificates without requiring:
- Cloudflare Workers
- Stripe payment systems
- R2 storage
- VERIFRAX service availability
- Network connectivity (after download)

## Purpose

This verifier proves that VERIFRAX certificates are **self-sufficient legal artifacts** that survive service failure, company dissolution, or infrastructure shutdown.

## Installation

```bash
# Clone or download this repository
cd verifrax-reference-verifier

# No dependencies required (uses Node.js standard library only)
# Node.js 14+ required
```

## Usage

```bash
node cli.js \
  --bundle bundle.bin \
  --certificate certificate.json \
  --profile public@1.0.0
```

### Output

**Valid certificate:**
```json
{
  "status": "VALID",
  "certificate_hash": "sha256:...",
  "verifier_version": "2.4.0",
  "bundle_hash": "sha256:..."
}
```

**Invalid certificate:**
```json
{
  "status": "INVALID",
  "reason": "CERTIFICATE_HASH_MISMATCH",
  "message": "..."
}
```

## Verification Algorithm

The verifier performs these steps:

1. **Recompute bundle_hash** from `bundle.bin` (SHA-256)
2. **Rebuild certificate object** (excluding `certificate_hash` field)
3. **Canonical-stringify** the certificate object (deterministic ordering)
4. **Recompute certificate_hash** (SHA-256 of canonical string)
5. **Compare** computed hash with `certificate.json.certificate_hash`

If hashes match → **VALID**  
If hashes mismatch → **INVALID**

## Determinism

This verifier is **deterministic**:
- Same inputs → same outputs
- No randomness
- No network calls
- No time-dependent logic
- No external state

## Version

**v2.4.0** (frozen, immutable)

This verifier is the authoritative reference for all VERIFRAX v2.4.0 certificates.

## Files

- `src/canonical_stringify.js` - Deterministic JSON serialization
- `src/hash.js` - SHA-256 hash computation
- `src/verify.js` - Core verification logic
- `cli.js` - Command-line interface
- `profiles/public@1.0.0.json` - Verification profile

## License

See parent repository LICENSE file.

## See Also

- `VERIFY_WITHOUT_VERIFRAX.md` - Complete guide for verifying certificates when VERIFRAX is unavailable

