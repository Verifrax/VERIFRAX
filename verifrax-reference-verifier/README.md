# VERIFRAX Reference Verifier v2.7.0

**VERSION:** v2.7.0  
**ROLE:** AUTHORITATIVE REFERENCE VERIFIER FOR v2.7.0  
**STATUS:** FROZEN

**Independent certificate verification without VERIFRAX infrastructure.**

See `VERSION_AUTHORITY.md` for version authority declaration.
See `verifrax.net/spec` for authoritative specifications.

This verifier allows third parties to validate VERIFRAX certificates without requiring:
- Cloudflare Workers
- Stripe payment systems
- R2 storage
- VERIFRAX infrastructure
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

### Minimal CLI

```bash
verify certificate.json
```

This automatically infers `bundle.bin` from the same directory and uses `public@1.0.0` as default profile.

### Full CLI

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
  "verifier_version": "2.6.0",
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

**v2.7.0** (frozen, immutable)

This verifier is authoritative for VERIFRAX v2.7.0 certificates.

Historical verification of v2.4.0 and v2.5.0 certificates remains possible using historical verifier versions, which are preserved for reference but are not authoritative for new executions.

## Files

- `src/canonical_stringify.js` - Deterministic JSON serialization
- `src/hash.js` - SHA-256 hash computation
- `src/verify.js` - Core verification logic
- `cli.js` - Command-line interface
- `profiles/public@1.0.0.json` - Verification profile

## License

See parent repository LICENSE file.

## Authority

See `REFERENCE_AUTHORITY.md` for authority declaration and binding guarantees.

## See Also

- `REFERENCE_AUTHORITY.md` - Authority declaration and binding guarantees
- `VERIFY_WITHOUT_VERIFRAX.md` - Complete guide for verifying certificates when VERIFRAX is unavailable

