# VERIFRAX Worked Example

Complete execution path: Evidence → Payment → Verdict → Certificate

---

## Step 1: Create Payment Intent

```bash
curl -X POST https://verifrax.net/api/create-payment-intent \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "client_secret": "pi_xxx_secret_xxx"
}
```

---

## Step 2: Upload Evidence Bundle

```bash
curl -X POST https://verifrax.net/api/upload \
  -H "Content-Type: application/octet-stream" \
  -H "x-payment-intent-id: pi_xxx" \
  -H "Content-Length: 1024" \
  --data-binary @bundle.bin
```

Response:
```json
{
  "upload_id": "550e8400-e29b-41d4-a716-446655440000",
  "bundle_hash": "sha256:abc123..."
}
```

---

## Step 3: Execute Verification

```bash
curl -X POST https://verifrax.net/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "upload_id": "550e8400-e29b-41d4-a716-446655440000",
    "profile_id": "public@1.0.0",
    "verifier_version": "2.3.0"
  }'
```

Response:
```json
{
  "upload_id": "550e8400-e29b-41d4-a716-446655440000",
  "bundle_hash": "sha256:abc123...",
  "profile_id": "public@1.0.0",
  "verifier_version": "2.3.0",
  "version_hash": "sha256:def456...",
  "verdict": "verified",
  "reason_codes": [],
  "verdict_hash": "sha256:ghi789...",
  "executed_at": "2024-01-01T00:00:00.000Z",
  "delivery_certificate": {
    "certificate_hash": "sha256:jkl012...",
    "finality_statement": "Execution of this verification constitutes delivery acceptance. Upon issuance, the associated dispute space is closed."
  }
}
```

---

## Step 4: Verify Certificate

```bash
curl "https://verifrax.net/api/certificate?upload_id=550e8400-e29b-41d4-a716-446655440000"
```

---

## Reproducibility

Any third party can reproduce this result using:
- The evidence bundle (hash: `sha256:abc123...`)
- The verification profile (`public@1.0.0`)
- The reference verifier (version `2.3.0`)

The certificate hash (`sha256:jkl012...`) cryptographically binds all inputs and outputs.

---

## Finality

This certificate represents irreversible delivery acceptance.
The dispute space for this evidence bundle is closed.

