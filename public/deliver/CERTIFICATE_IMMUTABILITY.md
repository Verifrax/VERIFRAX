# Certificate Immutability

VERIFRAX Delivery Certificates are **self-sufficient legal artifacts**.

## Persistence

Certificates are persisted at issuance time:
- Path: `uploads/<upload_id>/certificate.json`
- Written atomically with verdict
- Never recomputed
- Never modified

## Lookup

Certificates are retrieved directly:
- No re-execution required
- No verifier dependency
- No payment verification
- No runtime dependency

## Survivability

A persisted certificate remains valid even if:
- VERIFRAX service is unavailable
- Verifier code is unavailable
- Payment systems are unavailable
- Company ceases operations

## Verification

Third parties can verify certificates using:
- The certificate hash
- The evidence bundle (by hash)
- The verification profile
- Independent verifier implementation

The certificate itself contains all necessary information for independent verification.

