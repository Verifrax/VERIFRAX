# Delivery Pipeline v1

## Input Class

One canonical "delivery package" format:

- **Format**: ZIP archive or directory structure
- **Required files**:
  - `bundle.json` - Bundle manifest
  - `claims/` - Claim files (JSON)
  - `evidence/` - Evidence files (any format)
  - `attestations/` - Attestation files (JSON)

## Output Class

One canonical "delivery report" artifact:

- **Format**: JSON
- **File**: `verdict.json`
- **Content**: Binary-only output `{ "verdict_id": "...", "bundle_hash": "..." }`
- **Additional**: `evidence.zip` or evidence directory

## Failure Mode

One canonical "reject" reason code set:

- `VFX-EVIDENCE-*` - Evidence-related failures
- `VFX-SIG-*` - Signature failures
- `VFX-PROFILE-*` - Profile requirement failures
- `VFX-CONTRACT-*` - Contract violations

## Profile

**Profile**: `delivery_v1@1.0.0`

See `core/profiles/delivery_v1.json` for complete profile definition.

## Pipeline Steps

1. **Intake**: Accept delivery package (ZIP or directory)
2. **Validate**: Check bundle structure against schema
3. **Verify**: Run verifier with `delivery_v1` profile
4. **Output**: Generate binary verdict `{ "verdict_id": "...", "bundle_hash": "..." }`
5. **Report**: Return evidence bundle + verdict

## Determinism

All outputs must be:
- Hash-stable across machines
- Deterministic given identical inputs
- Canonical JSON serialization
- Stable file ordering

