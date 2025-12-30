# Delivery Verification Operating Procedure

## Intake Checklist

1. Client sends delivery package (ZIP or directory)
2. Verify package structure matches evidence bundle schema
3. Confirm payment received
4. Assign tracking ID

## Run Command

```bash
verifrax delivery run \
  --in <delivery-package-path> \
  --out <output-directory> \
  --profile delivery_v1@1.0.0
```

## Return Artifacts

1. **Evidence Bundle**: Copy of input bundle in `output/evidence/`
2. **Verdict JSON**: `output/verdict.json` with binary-only output
3. **Bundle Hash**: SHA-256 hash of evidence bundle

## Invoice Template

**Invoice #**: [INV-YYYYMMDD-XXX]
**Date**: [Date]
**Client**: [Client Name]
**Service**: Delivery Acceptance Verification
**Bundle Hash**: [bundle_hash from verdict]
**Verdict ID**: [verdict_id from verdict]
**Amount**: [Amount]
**Status**: Paid / Pending

## Delivery Method

- Email: Send verdict.json + evidence bundle link
- Secure transfer: [Method]
- Public record: [If applicable, publish to public/transactions/]

## Record Keeping

- Store evidence bundle in archive
- Record transaction in `public/transactions/`
- Maintain invoice records

