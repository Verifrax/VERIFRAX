# Delivery Acceptance Certificate - Offer

## What is Verified

**Acceptance Decision**: This media delivery matches the declared specification and is accepted.

## What is Delivered

1. **Evidence Bundle**: Complete evidence bundle (ZIP or directory) containing:
   - Bundle manifest (`bundle.json`)
   - Claims (JSON files)
   - Evidence files
   - Attestations (if applicable)

2. **Verifier Output**: Binary verdict in format:
   ```json
   {
     "verdict_id": "VFXV1:sha256:<bundle_hash>:sha256:<verdict_hash>",
     "bundle_hash": "sha256:<bundle_hash>"
   }
   ```

## What is Excluded

- No warranties beyond verification
- No interpretation of verdict meaning
- No dispute resolution services
- No ongoing support or maintenance
- No guarantees of future compatibility

## Price

**Per-delivery verification fee**: [Amount to be determined]

Payment required before verification execution.

## Terms

- Verification is deterministic and reproducible
- Verdict is immutable once issued
- No refunds for completed verifications
- Client retains all rights to evidence bundle

