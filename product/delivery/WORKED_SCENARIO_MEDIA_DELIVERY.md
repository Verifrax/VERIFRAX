# VERIFRAX Worked Scenario: Media Delivery

**Version:** 2.4.0  
**Status:** FROZEN  
**Purpose:** Demonstrate real-world use of VERIFRAX Delivery Certificate to eliminate dispute costs.

---

## Scenario

**Parties:**
- **Content Creator** (Producer)
- **Media Distributor** (Distributor)

**Context:**
Producer delivers final cut of feature film to Distributor. Distributor must accept delivery before payment is released.

**Problem:**
Traditional delivery acceptance involves weeks of back-and-forth about file integrity, completeness, and quality. Disputes can delay payment by months.

---

## Traditional Process (Without VERIFRAX)

### Timeline

**Week 1:**
- Producer delivers files via FTP/cloud
- Distributor downloads files
- Distributor begins review

**Week 2-3:**
- Distributor questions file integrity
- Producer disputes Distributor's assessment
- Back-and-forth emails
- Technical support involved

**Week 4-6:**
- Dispute escalates
- Legal teams involved
- Arbitration considered
- Payment blocked

**Week 7-12:**
- Arbitration or legal action
- Costs: EUR 5,000 - 50,000+
- Time: 2-3 months
- Opportunity cost: Delayed projects

**Total Cost:** EUR 5,000 - 50,000+  
**Total Time:** 2-3 months  
**Outcome:** Uncertain, potentially adversarial

---

## VERIFRAX Process

### Timeline

**Day 1:**
- Producer creates payment intent (EUR 650.00)
- Producer confirms payment
- Producer uploads evidence bundle (`/api/upload`)
- Producer executes verification (`/api/verify`)
- Producer receives Delivery Certificate

**Day 1 (same day):**
- Producer sends certificate to Distributor
- Distributor downloads Evidence Package
- Distributor verifies certificate independently
- Distributor confirms `VALID` status
- Payment released

**Total Cost:** EUR 650.00  
**Total Time:** 1 day  
**Outcome:** Cryptographic finality, dispute space closed

---

## Evidence Bundle Contents

### bundle.bin Structure

```
bundle/
├── bundle.json                    # Bundle manifest
├── evidence/
│   ├── final_cut.mov             # Final cut video file
│   ├── audio_mix.wav              # Audio mix
│   ├── subtitles.srt              # Subtitles
│   └── metadata.json              # Technical metadata
├── claims/
│   └── delivery_claim.json        # Delivery claim
└── signatures/
    └── producer_signature.pem     # Producer signature
```

### Delivery Claim

```json
{
  "claim_id": "uuid",
  "claim_type": "media-delivery",
  "subject": {
    "identifier": "feature-film-2024",
    "type": "media-asset"
  },
  "assertions": [
    "Final cut delivered",
    "Audio mix included",
    "Subtitles included",
    "Technical specifications met"
  ],
  "issued_at": "2024-01-01T00:00:00.000Z"
}
```

---

## Verification Execution

### Step 1: Upload

```bash
curl -X POST https://verifrax.net/api/upload \
  -H "Content-Type: application/octet-stream" \
  -H "x-payment-intent-id: pi_xxx" \
  --data-binary @bundle.bin
```

**Response:**
```json
{
  "upload_id": "550e8400-e29b-41d4-a716-446655440000",
  "bundle_hash": "sha256:abc123..."
}
```

### Step 2: Verify

```bash
curl -X POST https://verifrax.net/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "upload_id": "550e8400-e29b-41d4-a716-446655440000",
    "profile_id": "public@1.0.0",
    "verifier_version": "2.4.0"
  }'
```

**Response:**
```json
{
  "upload_id": "550e8400-e29b-41d4-a716-446655440000",
  "bundle_hash": "sha256:abc123...",
  "verdict": "verified",
  "delivery_certificate": {
    "certificate_hash": "sha256:jkl012...",
    "finality_statement": "Execution of this verification constitutes delivery acceptance. Upon issuance, the associated dispute space is closed."
  }
}
```

### Step 3: Retrieve Certificate

```bash
curl "https://verifrax.net/api/certificate?upload_id=550e8400-e29b-41d4-a716-446655440000"
```

**Response:** Full certificate JSON

---

## Distributor Verification

### Step 1: Download Evidence Package

Distributor receives:
- `bundle.bin` (evidence bundle)
- `certificate.json` (VERIFRAX certificate)
- Reference verifier (from `verifrax-reference-verifier/`)

### Step 2: Verify Independently

```bash
cd verifrax-reference-verifier
node cli.js \
  --bundle ../bundle.bin \
  --certificate ../certificate.json \
  --profile public@1.0.0
```

**Output:**
```json
{
  "status": "VALID",
  "certificate_hash": "sha256:jkl012...",
  "verifier_version": "2.4.0",
  "bundle_hash": "sha256:abc123..."
}
```

### Step 3: Accept Delivery

Distributor confirms:
- Certificate is cryptographically valid
- Bundle hash matches certificate
- Certificate is independently verifiable
- Dispute space is closed

**Payment released immediately.**

---

## Cost Comparison

### Traditional Process

- **Legal fees:** EUR 5,000 - 50,000+
- **Arbitration fees:** EUR 2,000 - 20,000+
- **Time cost:** 2-3 months
- **Opportunity cost:** Delayed projects
- **Total:** EUR 7,000 - 70,000+

### VERIFRAX Process

- **Certificate cost:** EUR 650.00
- **Time cost:** 1 day
- **Dispute cost:** EUR 0.00
- **Arbitration cost:** EUR 0.00
- **Total:** EUR 650.00

**Savings:** EUR 6,350 - 69,350+  
**ROI:** 10x - 100x+

---

## Legal Submission

If dispute arises later, Producer can submit Evidence Package to court:

1. **Package Contents:**
   - `bundle.bin` (evidence)
   - `certificate.json` (VERIFRAX certificate)
   - Reference verifier
   - `SHA256SUMS` (integrity hashes)

2. **Court Verification:**
   - Court verifies file hashes
   - Court runs reference verifier
   - Court confirms `VALID` status
   - Certificate accepted as evidence

**No VERIFRAX involvement required.**

---

## Key Benefits

### For Producer

- **Immediate finality:** Dispute space closed upon issuance
- **Payment release:** No waiting for acceptance
- **Legal protection:** Court-grade evidence package
- **Cost savings:** EUR 6,350 - 69,350+

### For Distributor

- **Independent verification:** No trust in VERIFRAX required
- **Cryptographic proof:** File integrity proven
- **Fast acceptance:** 1 day vs. 2-3 months
- **Legal certainty:** Certificate is court-grade evidence

### For Both Parties

- **Dispute elimination:** Cryptographic finality
- **Cost reduction:** 10x - 100x savings
- **Time savings:** 1 day vs. 2-3 months
- **Legal certainty:** Court-grade evidence package

---

## Result

> VERIFRAX becomes a one-time purchase that replaces weeks of argument.

**One certificate. One payment. Finality forever.**

---

## Version

**v2.4.0** (frozen, immutable)

This scenario applies to certificates issued by VERIFRAX Worker v2.4.0.

---

## See Also

- `product/delivery/DELIVERY_CERTIFICATE_SKU.md` - Product SKU
- `product/pricing/OUTCOME_PRICING.md` - Pricing model
- `verifrax-reference-verifier/LEGAL_USAGE.md` - Legal usage guide

