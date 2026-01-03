# VERIFRAX SYSTEM DEFINITION STATEMENT — v2.7.0

**Version:** v2.7.0  
**Date:** 2026-01-03  
**Status:** FINAL  
**Authority:** VERIFRAX_AUTHORITY.lock

---

## 1. WHAT VERIFRAX IS

VERIFRAX is a deterministic software verification service that:

1. **Accepts payment** via Stripe Checkout Session (one-time payment, EUR)
2. **Mints execution tokens** upon successful payment confirmation (cryptographically signed, single-use)
3. **Accepts evidence bundles** (binary files) with a verification profile identifier
4. **Executes deterministic verification** using a specified verifier version
5. **Generates certificates** (canonical JSON documents) containing:
   - Evidence bundle hash (SHA-256)
   - Verification profile identifier
   - Verifier version
   - Execution timestamp
   - Verdict (verified/not_verified)
   - Reason codes (if any)
   - Certificate hash (SHA-256 of canonical certificate content)
6. **Stores certificates** in immutable storage (Cloudflare R2) at content-addressed paths
7. **Serves certificates** via public HTTP endpoint using certificate hash

---

## 2. WHAT VERIFRAX IS NOT

VERIFRAX is not:

1. **A truth verification service** — VERIFRAX does not verify the truth, accuracy, or legal validity of evidence
2. **An advisory service** — VERIFRAX provides no interpretation, guidance, or recommendations
3. **A custody service** — VERIFRAX does not hold, manage, or control user funds beyond payment processing
4. **A general-purpose storage or custody service** — Evidence bundles are retained solely as a by-product of execution finality and certificate reproducibility, not as a custodial or access service.
5. **A dispute resolution service** — VERIFRAX does not resolve disputes, mediate, or arbitrate
6. **A certification authority** — VERIFRAX does not issue certificates of authenticity, compliance, or legal standing
7. **A guarantee service** — VERIFRAX makes no guarantees about outcomes, acceptance, or third-party reliance

---

## 3. MECHANICAL BEHAVIOR (NO INTERPRETATION)

### Payment Processing

- Payment is processed by Stripe, not VERIFRAX
- Payment success is determined by Stripe webhook events
- VERIFRAX verifies webhook signatures using HMAC-SHA256
- Payment failure results in no execution token

### Token Generation

- Execution tokens are generated only upon successful payment confirmation
- Tokens are cryptographically signed using HMAC-SHA256
- Tokens contain: unique identifier (jti), tier, payment intent ID, amount, currency, issuance time, expiration time
- Tokens are single-use and cannot be recovered if lost
- Token expiration is enforced (default: 3600 seconds from issuance)

### Execution Process

- Execution requires a valid, unexpired, unused execution token
- Evidence bundle is accepted via multipart form upload
- Bundle hash is computed using SHA-256
- Verification profile identifier is required
- Execution is deterministic: same inputs produce same outputs
- Execution cannot be retried, modified, or reversed

### Certificate Generation

- Certificate content is determined solely by:
  - Evidence bundle hash
  - Verification profile identifier
  - Verifier version
  - Execution timestamp
  - Verdict (derived from verification)
  - Reason codes (derived from verification)
- Execution timestamps reflect system clock time at execution and are not representations of external event timing
- Certificate hash is computed from canonical JSON serialization (excluding certificate_hash field)
- Certificate is stored at path: `cert/<certificate_hash>.json`
- Certificate storage is write-once (no overwrite, no delete)

### Certificate Retrieval

- Certificates are retrievable via HTTP GET at `/certificate/<certificate_hash>`
- Certificate hash must be exactly 64 hexadecimal characters
- Invalid hash format returns HTTP 404
- Non-existent certificate returns HTTP 404
- Certificate content is returned as canonical JSON

---

## 4. NO CLAIMS

VERIFRAX makes no claims about:

- The truth, accuracy, or validity of evidence
- The legal effect or admissibility of certificates
- The acceptance of certificates by third parties (courts, regulators, etc.)
- The interpretation or meaning of verdicts
- The suitability of certificates for any purpose
- The continued availability of the service
- The accuracy or completeness of verification results

No party may rely on a VERIFRAX certificate as a substitute for independent verification, legal judgment, or regulatory determination.

---

## 5. SYSTEM BOUNDARIES

### VERIFRAX Controls

- Payment acceptance (via Stripe integration)
- Token generation and validation
- Execution scheduling and processing
- Certificate generation and storage
- Certificate retrieval

### VERIFRAX Does Not Control

- Payment processing (Stripe)
- Evidence bundle content or validity
- Third-party acceptance of certificates
- Certificate interpretation or legal effect
- Service availability (infrastructure provider: Cloudflare)
- Certificate validity after issuance (certificates are independently verifiable)

---

## 6. TECHNICAL SPECIFICATIONS

- **Payment Processing:** Stripe Checkout Sessions (one-time payment)
- **Token Signing:** HMAC-SHA256 with base64url encoding
- **Hash Algorithm:** SHA-256
- **Storage:** Cloudflare R2 (immutable, content-addressed)
- **Execution Platform:** Cloudflare Workers
- **Certificate Format:** Canonical JSON (deterministic field ordering)
- **API Surface:** Closed, enumerable endpoints only

---

## 7. VERSION IDENTIFICATION

This statement applies to VERIFRAX v2.7.0 only.

System version is identified by:
- `VERIFIER_VERSION` environment variable: `v2.7.0`
- Certificate field: `verifier_version: "v2.7.0"`
- Authority lock file: `VERIFRAX_AUTHORITY.lock`

Future versions are separate systems, not updates to v2.7.0.

---

**END OF SYSTEM DEFINITION STATEMENT**

