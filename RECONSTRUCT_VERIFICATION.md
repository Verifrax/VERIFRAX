# Reconstruct Verification

## Steps to Verify Certificate (No VERIFRAX Required)

### Prerequisites

- Evidence package (contains certificate, bundle, hashes)
- Reference verifier (standalone, no dependencies)

### Steps

1. **Obtain Evidence Package**
   - `certificate.v2.4.0.json`
   - `bundle.bin`
   - `SHA256SUMS.txt`

2. **Download Reference Verifier**
   - From `Verifrax/VERIFRAX-verify` (or any mirror)
   - Standalone, no dependencies
   - Node.js 14+ only

3. **Run Verification**
   ```bash
   verify certificate.v2.4.0.json
   ```

4. **Verify Hashes**
   - Compare certificate hash with computed hash
   - Compare bundle hash with computed hash
   - Verify SHA256SUMS

## No VERIFRAX URLs Required

- No verifrax.net access needed
- No API calls
- No network required

## No Live Dependencies

- No Cloudflare
- No Stripe
- No GitHub (after download)
- No VERIFRAX infrastructure

## Result

Certificate verification succeeds completely independently.

VERIFRAX infrastructure is not required.

