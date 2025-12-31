> **NON-AUTHORITATIVE — EDUCATIONAL ONLY**  
> This example is for educational purposes only. Contains fake data only. Not a conformance test.

# VERIFRAX Certificate Example (Educational)

> **NON-AUTHORITATIVE — EDUCATIONAL ONLY**  
> This example is for educational purposes only. Contains fake data only. Not a conformance test.

**Version:** 2.3.0  
**Status:** EDUCATIONAL  
**Purpose:** Example VERIFRAX certificate with complete evidence package and independent verification transcript.

---

## Package Contents

This directory contains an example VERIFRAX certificate (educational only):

- `bundle.bin` - Evidence bundle (43 bytes, minimal valid example)
- `certificate.json` - VERIFRAX-issued certificate
- `manifest.json` - Bundle manifest
- `VERIFICATION_TRANSCRIPT.md` - Complete independent verification transcript
- `SHA256SUMS` - Package integrity hashes

---

## Certificate Details (Example)

**Upload ID:** `00000000-0000-0000-0000-000000000000` (example only)  
**Bundle Hash:** `sha256:ba18a51f06af90c110924fc4e87a64dba5127bc092a582b33a2f1b844835413b` (example only)  
**Profile:** `public@1.0.0`  
**Verifier Version:** `2.3.0`  
**Verdict:** `verified`  
**Certificate Hash:** `sha256:0bb6c5af433595b665d57e4120975713a6d41db7d0f7e9d04d1438c0a29c3f8e` (example only)

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

This example demonstrates (educational only):

1. **Example Evidence Package** - Example files for learning (not real evidence)
2. **Example Certificate** - Example VERIFRAX certificate format (not real certificate)
3. **Independent Verification** - Can be verified without VERIFRAX infrastructure
4. **Educational Purpose** - For learning only, not real evidence

## Independent Verifiability

This example demonstrates independent verifiability. Certificate can be verified without VERIFRAX infrastructure.

---

## Independent Verifiability

This package is independently verifiable when:

1. All file hashes match `SHA256SUMS`
2. Reference verifier confirms `VALID` status
3. All required files are present

**No VERIFRAX involvement required.**

**Note:** VERIFRAX provides deterministic computation only. Legal admissibility is external to VERIFRAX.

---

## Version

**v2.3.0** (frozen, immutable)

This example applies to certificates issued by VERIFRAX Worker v2.3.0.

---

## See Also

- `HOW_TO_REIMPLEMENT_VERIFRAX.md` - Complete reimplementation guide
- `verifrax-reference-verifier/LEGAL_USAGE.md` - Legal usage guide
- `freeze/v2.3.0/LEGAL_PACKAGE.md` - Legal package documentation

