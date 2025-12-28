# Delivery v1 Golden Bundle

## Purpose

Canonical test bundle for delivery_v1 profile verification.

## Expected Output

Running the verifier on this bundle must produce:

```json
{
  "verdict_id": "VFXV1:sha256:<bundle_hash>:sha256:<verdict_hash>",
  "bundle_hash": "sha256:<bundle_hash>"
}
```

## Determinism Requirement

The `bundle_hash` must be identical across all verifier implementations and runs.

## Usage

```bash
verifrax delivery run --in public/conformance/golden/delivery_v1/input --out /tmp/output --profile delivery_v1@1.0.0
```

