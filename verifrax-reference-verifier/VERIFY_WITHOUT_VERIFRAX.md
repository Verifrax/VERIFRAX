# How to Verify a VERIFRAX Certificate Without VERIFRAX

**This document describes how to independently verify a VERIFRAX certificate when VERIFRAX infrastructure is unavailable, offline, or no longer exists.**

## Scenario

You have:
- A VERIFRAX certificate (`certificate.json`)
- The original evidence bundle (`bundle.bin`)
- This reference verifier

VERIFRAX is:
- Offline
- Domain is gone
- Company has ceased operations
- Service is unavailable

**Your certificate is still valid.**

## Why This Works

VERIFRAX certificates are **cryptographically self-sufficient**. They contain:
- The bundle hash
- The verdict
- The certificate hash (cryptographic proof)

The certificate hash is computed from the certificate contents using SHA-256. Anyone can recompute this hash and verify it matches the certificate.

## Step-by-Step Verification

### 1. Download the Reference Verifier

Obtain the VERIFRAX Reference Verifier v2.4.0:
- Source code: `verifrax-reference-verifier/`
- Binary (if available): `verifrax-verify-v2.4.0`
- Hashes: `SHA256SUMS`

**Verify the verifier itself:**
```bash
# Check hash matches published hash
sha256sum verifrax-reference-verifier.tar.gz
# Compare with published SHA256SUMS
```

### 2. Prepare Your Files

You need:
- `bundle.bin` - The original evidence bundle
- `certificate.json` - The VERIFRAX certificate
- Profile ID (usually `public@1.0.0`)

### 3. Run Verification

```bash
node cli.js \
  --bundle bundle.bin \
  --certificate certificate.json \
  --profile public@1.0.0
```

### 4. Interpret Results

**If status is "VALID":**
- The certificate is cryptographically valid
- The bundle hash matches the certificate
- The certificate hash is correct
- **The certificate stands on its own authority**

**If status is "INVALID":**
- The certificate may be corrupted
- The bundle may have been modified
- The certificate may be fraudulent

## What This Proves

A **VALID** result proves:

1. **Integrity**: The certificate has not been tampered with
2. **Authenticity**: The certificate was issued by VERIFRAX (hash matches)
3. **Completeness**: The bundle matches what was verified
4. **Finality**: The verdict is cryptographically bound to the evidence

## What This Does NOT Prove

This verification does NOT prove:
- The evidence is true
- The evidence is complete
- The evidence is legal
- The evidence is accurate

It only proves that **VERIFRAX issued this certificate for this bundle**.

## Legal Implications

**VERIFRAX cannot alter or invalidate issued certificates.**

Once a certificate is issued:
- It is cryptographically final
- It cannot be revoked by VERIFRAX
- It cannot be modified by VERIFRAX
- It survives VERIFRAX service failure

This is by design. Certificates are **dispute collapse artifacts** that exist independently of the issuer.

## Independent Verification

You can also:
- Re-implement the verifier in any language
- Use the published algorithm specification
- Verify the canonical stringify function
- Verify the hash computation

The algorithm is deterministic and public.

## Support

If VERIFRAX is unavailable:
- Use this reference verifier
- Check published hashes in `freeze/v2.4.0/`
- Review `OPERATIONAL_TRUTH.md` for authoritative hashes
- Contact certificate holders for bundle files

## Version Compatibility

This verifier (v2.4.0) verifies certificates issued by VERIFRAX Worker v2.4.0.

For other versions:
- Check `freeze/v2/releases/` for version-specific verifiers
- Each version has its own reference verifier

## Conclusion

**VERIFRAX certificates are designed to survive VERIFRAX.**

If you have:
- The certificate
- The bundle
- The reference verifier

You can verify the certificate **forever**, regardless of VERIFRAX's status.

This is not a bug. This is the feature.

