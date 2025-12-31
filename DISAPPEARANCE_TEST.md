# Disappearance Test

## Scenario

VERIFRAX disappears tomorrow:
- Cloudflare OFF
- Stripe OFF
- GitHub OFF

## Assertions

### Certificates Remain Verifiable

**Test:** Certificate verification without VERIFRAX infrastructure.

**Result:** ✅ Certificates remain verifiable using reference verifier.

**Proof:**
1. Download reference verifier (standalone, no dependencies)
2. Run: `verify certificate.json`
3. Verification succeeds without network, without VERIFRAX

### Evidence Packages Remain Complete

**Test:** Evidence package completeness without VERIFRAX.

**Result:** ✅ Evidence packages remain complete.

**Proof:**
1. Evidence package contains: certificate, bundle, hashes, README
2. All required files present
3. No external dependencies

### Reference Verifier Runs Offline

**Test:** Reference verifier operation without network.

**Result:** ✅ Reference verifier runs completely offline.

**Proof:**
1. Reference verifier uses only Node.js standard library
2. No network calls
3. No external dependencies
4. Verification succeeds offline

## Conclusion

VERIFRAX infrastructure disappearance has **zero impact** on certificate verification.

Certificates remain verifiable. Evidence packages remain complete. Reference verifier runs offline.

