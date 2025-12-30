# VERIFRAX Real-World Certificate Example

**Version:** 2.3.0  
**Status:** FROZEN  
**Purpose:** First real-world VERIFRAX certificate with complete evidence package and independent verification transcript.

---

## Package Contents

This directory contains a complete, real-world VERIFRAX certificate example:

- `bundle.bin` - Evidence bundle (43 bytes, minimal valid example)
- `certificate.json` - VERIFRAX-issued certificate
- `manifest.json` - Bundle manifest
- `VERIFICATION_TRANSCRIPT.md` - Complete independent verification transcript
- `SHA256SUMS` - Package integrity hashes

---

## Certificate Details

**Upload ID:** `00000000-0000-0000-0000-000000000000`  
**Bundle Hash:** `sha256:ba18a51f06af90c110924fc4e87a64dba5127bc092a582b33a2f1b844835413b`  
**Profile:** `public@1.0.0`  
**Verifier Version:** `2.3.0`  
**Verdict:** `verified`  
**Certificate Hash:** `sha256:0bb6c5af433595b665d57e4120975713a6d41db7d0f7e9d04d1438c0a29c3f8e`

---

## Independent Verification

This certificate can be verified independently using the reference verifier:

```bash
cd verifrax-reference-verifier
node cli.js \
  --bundle ../examples/real-world-certificate/bundle.bin \
  --certificate ../examples/real-world-certificate/certificate.json \
  --profile public@1.0.0
```

**Expected Result:** `{"status": "VALID", ...}`

See `VERIFICATION_TRANSCRIPT.md` for complete verification transcript.

---

## Use Case

This example demonstrates:

1. **Complete Evidence Package** - All files needed for independent verification
2. **Real Certificate** - Actual VERIFRAX-issued certificate (not mock)
3. **Independent Verification** - Can be verified without VERIFRAX infrastructure
4. **Court-Grade Evidence** - Suitable for legal submission

---

## Legal Admissibility

This package is legally admissible when:

1. All file hashes match `SHA256SUMS`
2. Reference verifier confirms `VALID` status
3. All required files are present

**No VERIFRAX involvement required.**

---

## Version

**v2.3.0** (frozen, immutable)

This example applies to certificates issued by VERIFRAX Worker v2.3.0.

---

## See Also

- `HOW_TO_REIMPLEMENT_VERIFRAX.md` - Complete reimplementation guide
- `verifrax-reference-verifier/LEGAL_USAGE.md` - Legal usage guide
- `freeze/v2.3.0/LEGAL_PACKAGE.md` - Legal package documentation

