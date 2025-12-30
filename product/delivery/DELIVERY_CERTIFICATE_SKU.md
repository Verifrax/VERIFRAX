# VERIFRAX Delivery Certificate SKU

**Version:** 2.4.0  
**Status:** FROZEN  
**SKU:** VFX-DC-2.4.0

---

## Product Definition

**VERIFRAX Delivery Certificate** is a one-time purchase that replaces weeks of argument with cryptographic finality.

### What You Buy

- One deterministic verification execution
- One Delivery Certificate (immutable, portable)
- Finality statement (dispute space closure)
- Independent verifiability (no ongoing dependency)

### What You Get

1. **Evidence Bundle Verification**
   - Deterministic verification against declared profile
   - Cryptographic bundle hash
   - Verdict (verified | not_verified)

2. **Delivery Certificate**
   - Immutable certificate artifact
   - Finality statement
   - Certificate hash (cryptographic proof)
   - Portable (survives VERIFRAX)

3. **Independent Verifiability**
   - Reference verifier included
   - No VERIFRAX dependency
   - Court-grade evidence package
   - Legal usage boundaries documented

---

## Pricing

**Price:** EUR 650.00 per certificate

**Payment Model:** One-time payment, before verification execution

**What This Eliminates:**
- Weeks of dispute negotiation
- Ongoing argument about delivery acceptance
- Need for third-party arbitration
- Uncertainty about finality

**What This Does NOT Include:**
- Ongoing support
- Certificate updates
- Dispute resolution services
- Legal representation

---

## Economic Value Proposition

### Dispute Cost Elimination

**Typical Dispute Costs:**
- Legal fees: EUR 5,000 - 50,000+
- Arbitration fees: EUR 2,000 - 20,000+
- Time cost: 2-12 weeks
- Opportunity cost: Delayed projects, blocked payments

**VERIFRAX Certificate Cost:**
- One-time: EUR 650.00
- No ongoing costs
- No dispute costs
- No arbitration costs

**ROI:** 10x - 100x+ cost savings

### Reusability

**One Certificate:**
- Used in court (legal submission)
- Used in arbitration (technical finality)
- Used in audits (verification proof)
- Used in contracts (delivery acceptance)

**One Purchase, Multiple Uses:**
- No per-use fees
- No expiration
- No revocation
- No dependency on VERIFRAX

---

## Use Cases

### Media Delivery

**Scenario:** Content creator delivers media asset to distributor.

**Without VERIFRAX:**
- Weeks of back-and-forth about delivery acceptance
- Disputes about file integrity
- Arguments about delivery completeness
- Potential arbitration or legal action

**With VERIFRAX:**
- Upload evidence bundle
- Pay EUR 650.00
- Receive Delivery Certificate
- Dispute space closed immediately

**Result:** Weeks of argument replaced by one certificate.

### Contract Milestone

**Scenario:** Contractor delivers milestone work to client.

**Without VERIFRAX:**
- Client questions delivery completeness
- Contractor disputes client's assessment
- Weeks of negotiation
- Potential contract dispute

**With VERIFRAX:**
- Upload milestone evidence
- Pay EUR 650.00
- Receive Delivery Certificate
- Milestone acceptance cryptographically final

**Result:** Contract dispute replaced by cryptographic finality.

### Compliance Handoff

**Scenario:** Organization submits compliance evidence to regulator.

**Without VERIFRAX:**
- Regulator questions evidence integrity
- Organization disputes regulator's assessment
- Extended review process
- Potential compliance dispute

**With VERIFRAX:**
- Upload compliance evidence
- Pay EUR 650.00
- Receive Delivery Certificate
- Evidence integrity cryptographically proven

**Result:** Compliance dispute replaced by cryptographic proof.

---

## Product Lifecycle

### Purchase

1. Create payment intent (`/api/create-payment-intent`)
2. Confirm payment (Stripe)
3. Upload evidence bundle (`/api/upload`)
4. Execute verification (`/api/verify`)

### Delivery

1. Certificate issued (immutable)
2. Certificate persisted (`uploads/<upload_id>/certificate.json`)
3. Certificate accessible (`/api/certificate`)
4. Certificate downloadable (Evidence Package)

### Usage

1. Download Evidence Package
2. Submit to court/arbitration/audit
3. Third party verifies independently
4. Certificate accepted as evidence

**No ongoing VERIFRAX dependency.**

---

## Guarantees

### What is Guaranteed

- Certificate is cryptographically valid
- Certificate is immutable (cannot be altered)
- Certificate is independently verifiable
- Certificate survives VERIFRAX failure

### What is NOT Guaranteed

- Evidence is true or accurate
- Evidence is legally compliant
- Evidence is complete
- Evidence is of acceptable quality

---

## Version

**v2.4.0** (frozen, immutable)

This SKU applies to certificates issued by VERIFRAX Worker v2.4.0.

---

## See Also

- `product/delivery/DELIVERY_CERTIFICATE_SPEC.md` - Certificate specification
- `product/pricing/OUTCOME_PRICING.md` - Pricing model
- `verifrax-reference-verifier/LEGAL_USAGE.md` - Legal usage guide

