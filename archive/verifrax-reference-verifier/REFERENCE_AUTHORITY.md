# VERIFRAX Reference Verifier Authority Declaration

## Authority

**This reference verifier (`verifrax-reference-verifier/`) is the authoritative offline, deterministic verification implementation for VERIFRAX v2.4.0.**

---

## Authority Statement

### What This Verifier Is

- **Offline:**** Requires zero network connectivity after download
- **Deterministic:**** Same inputs always produce same outputs
- **Independent:**** No VERIFRAX infrastructure required
- **Authoritative:**** Verifier wins over infrastructure

### What This Verifier Guarantees

- **Correctness:** Implements the same verification algorithm as VERIFRAX Worker v2.4.0
- **Determinism:** Reproducible results for identical inputs
- **Independence:** Verification succeeds without VERIFRAX infrastructure
- **Survivability:** Certificates remain verifiable even if VERIFRAX ceases operations

---

## Version

**v2.4.0** (frozen, immutable)

This verifier matches VERIFRAX Worker verifier version 2.4.0.

---

## Freeze Commit

**Freeze Commit Hash:** `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

This verifier is pinned to the same freeze commit as the core engine.

---

## Verification Algorithm

The verifier implements the canonical verification algorithm:

1. Recompute `bundle_hash` from `bundle.bin` (SHA-256)
2. Rebuild certificate object (excluding `certificate_hash`)
3. Canonical-stringify certificate object
4. Recompute `certificate_hash` (SHA-256)
5. Compare with `certificate.json.certificate_hash`

**Match → VALID**  
**Mismatch → INVALID**

---

## Authority Over Infrastructure

**The reference verifier is authoritative over VERIFRAX infrastructure.**

If the reference verifier and VERIFRAX infrastructure produce different results:
- **Reference verifier wins**
- Infrastructure result is considered incorrect
- Certificate validity is determined by reference verifier

---

## Independence

This verifier requires **zero** VERIFRAX infrastructure:
- No Cloudflare Workers
- No Stripe payment systems
- No R2 storage
- No network (after download)
- No VERIFRAX service

---

## Survivability

Certificates verified by this verifier remain valid even if:
- VERIFRAX service is offline
- VERIFRAX domain is gone
- VERIFRAX company ceases operations
- All VERIFRAX infrastructure is destroyed

---

## Usage

```bash
node cli.js \
  --bundle bundle.bin \
  --certificate certificate.json \
  --profile public@1.0.0
```

Or as a minimal CLI:

```bash
verify certificate.json
```

---

## Files

All files are hashed in `SHA256SUMS`:
- `src/canonical_stringify.js` - Deterministic JSON serialization
- `src/hash.js` - SHA-256 hash computation
- `src/verify.js` - Core verification logic
- `cli.js` - Command-line interface
- `profiles/public@1.0.0.json` - Verification profile

---

## Related Documentation

- `README.md` - Usage instructions
- `VERIFY_WITHOUT_VERIFRAX.md` - Complete guide for offline verification
- `LEGAL_USAGE.md` - Legal usage guidelines

---

## Binding

This verifier binds:
- Logic (canonical stringify, hash computation)
- Output format (JSON status)
- Verification authority (deterministic algorithm)

