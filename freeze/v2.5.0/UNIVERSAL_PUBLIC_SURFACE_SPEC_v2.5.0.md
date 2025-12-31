# VERIFRAX v2.5.0 — UNIVERSAL PUBLIC SURFACE, AUTHORITY & INSTITUTIONAL‑GRADE FINAL SPECIFICATION

**Status:** FROZEN — INSTITUTIONALLY COMPLETE (LEVEL‑UP EDITION)  
**Audience:** Any member of the public, courts, regulators, auditors, financial institutions, media, counterparties  
**Purpose:** Define a system where **any person** who visits `www.verifrax.net` can **see**, **create**, and **verify** a VERIFRAX execution, with all legal, technical, cryptographic, governance, adversarial, and operational gaps explicitly closed — including executable, forward‑action technical commands for every phase.

---

## 1. SYSTEM IDENTITY (NON‑NEGOTIABLE)

VERIFRAX is a deterministic digital verification system.

It executes a **single, one‑time computational verification** over a submitted digital evidence bundle and issues a **final, immutable, reproducible certificate**.

VERIFRAX is not a platform, marketplace, workflow tool, expert system, advisory service, oracle, arbiter, or decision‑making authority.

---

## 2. CORE PROMISE (DETERMINISM)

For identical:
- evidence bundle
- verification profile identifier
- verifier version

VERIFRAX will always produce **identical output, byte‑for‑byte**.

There is no randomness, no interpretation logic, no external data dependency, and no mutable state.

---

## 3. UNIVERSAL ACCESS MODEL

### 3.1 Visibility

Any person accessing `www.verifrax.net` MUST be able to:
- understand what VERIFRAX is and is not
- access the frozen specification
- access the reference verifier and its cryptographic fingerprints

No login. No permission. No identity.

### 3.2 Creation

Any person may create a verification by:
- submitting a digital evidence bundle
- selecting a verification profile identifier
- completing a one‑time payment

The submitting party is defined **only** by submission + payment. VERIFRAX does not identify, track, authenticate, or remember users.

### 3.3 Verification

Any person may verify any VERIFRAX certificate:
- without payment
- without permission
- without contacting the operator
- without relying on VERIFRAX infrastructure

Verification authority is universal and perpetual.

---

## 4. PUBLIC SURFACES (MANDATORY)

- `GET /` — authoritative statement surface
- `POST /api/verify` — public creation surface (payment‑gated)
- `GET /certificate/{hash}` — certificate retrieval
- `GET /reference‑verifier` — offline verification tools
- `GET /spec` — this frozen specification
- `GET /glossary` — fixed terminology
- `GET /status` — survivability, version, and governance state

Absence of any surface invalidates institutional usability.

---

## 5. FINALITY MODEL

- One execution produces exactly one certificate
- Certificates cannot be re‑executed, revised, amended, or superseded
- Financial disputes, refunds, chargebacks, or operator failure do not affect validity

Finality is **procedural, absolute, and irreversible**.

---

## 6. LEGAL BOUNDARIES (CLOSED)

### 6.1 Terms of Use (Binding)

VERIFRAX:
- provides no advice
- provides no opinions
- provides no legal, financial, technical, or factual conclusions
- makes no warranties regarding outcomes, correctness of evidence, or suitability

Users are solely responsible for:
- evidence selection
- profile selection
- downstream interpretation and reliance

### 6.2 Jurisdiction & Forum

Unless otherwise required by mandatory law, VERIFRAX operates under a single declared governing law and exclusive forum, published at `/status`.

### 6.3 Liability Boundary

The operator's liability is limited strictly to faithful execution of the deterministic process as specified. There is **no liability** for interpretation, reliance, consequential damage, or third‑party use.

### 6.4 Data Processing Role

VERIFRAX acts as a **pure technical processor**. Submitted evidence is not analyzed, enriched, correlated, sold, or reused.

---

## 7. EVIDENTIARY & CRYPTOGRAPHIC SPECIFICATION (CLOSED)

### 7.1 Certificate Canonicalization

Certificates are serialized using a canonical, deterministic encoding with:
- fixed field order
- fixed encoding (UTF‑8)
- explicit null handling
- no optional or inferred fields

The canonical byte representation is the **sole** input to cryptographic hashing and signing.

### 7.2 Cryptographic Primitives

- Evidence hash: SHA‑256
- Certificate hash: SHA‑256 over canonical certificate bytes
- Optional signature: Ed25519 over certificate hash (verifier‑version‑specific)

All algorithms are version‑pinned and immutable.

### 7.3 Time Semantics

`executed_at` represents **system execution time only**. It does not assert evidence creation time, truth time, event time, or legal relevance time.

---

## 8. VERIFICATION COMPLETENESS (CLOSED)

- A reference verifier implementation is publicly available
- Each release is hashed and cryptographically signed
- Verification can be executed fully offline

Any third party can independently confirm certificate validity without VERIFRAX infrastructure or operator trust.

---

## 9. GOVERNANCE, VERSIONING & KEY ROTATION (CLOSED)

### 9.1 Version Lifecycle

- Versions are proposed, reviewed, and frozen
- Frozen versions are immutable forever

### 9.2 Deprecation Policy

- New versions do not invalidate prior certificates
- Verification logic is strictly version‑scoped

### 9.3 Cryptographic Key Policy

- Signing keys are version‑scoped
- Key rotation occurs only via new verifier versions
- Old keys remain published for historical verification

### 9.4 Verification Profiles

Verification profiles are **external identifiers**. VERIFRAX does not define, endorse, validate, or interpret their semantics.

---

## 10. OPERATIONAL DISCIPLINE (CLOSED)

- Rate limiting is enforced solely via pricing and payment success
- Malformed or adversarial submissions fail deterministically
- Maximum evidence size and formats are fixed and published

There is no discretionary acceptance, prioritization, or suppression.

---

## 11. DOMAIN, IDENTITY & CANONICAL HOST (CLOSED)

- `www.verifrax.net` is the sole canonical public entry point
- All traffic is HTTPS
- Any alternative hostname must redirect or intentionally not exist

---

## 12. INFRASTRUCTURE AUTHORITY RULE

Infrastructure providers (Cloudflare, Stripe, AWS, or successors) have **zero authority over truth**.

Infrastructure failure, vendor outage, or company dissolution cannot invalidate certificates.

---

## 13. CERTIFICATE EXPORT, QR & PHYSICAL WORLD COMPATIBILITY

### 13.1 Certificate Export

Each completed verification MUST support export as:
- canonical JSON (authoritative)
- human‑readable PDF/text (non‑authoritative rendering)

### 13.2 QR Code Inclusion

Every exported certificate MUST include a QR code encoding:
- `https://www.verifrax.net/certificate/{certificate_hash}`

The QR code is a **pointer only** and introduces no new authority.

### 13.3 Offline & Physical Use

QR inclusion enables printed exhibits, court filings, regulatory submissions, and physical audit trails. Damage or removal of the QR does not affect validity.

---

## 14. THREAT MODEL (EXPLICIT)

VERIFRAX is explicitly designed to resist:
- operator tampering after execution
- selective re‑execution
- expert shopping
- retroactive reinterpretation
- infrastructure coercion
- vendor disappearance

VERIFRAX does not attempt to solve:
- truthfulness of evidence
- semantic interpretation
- legal admissibility

---

## 15. EXECUTABLE FORWARD‑ACTION TECHNICAL COMMANDS (NEW)

This section defines **concrete, professional‑grade commands** to operate VERIFRAX across all phases. These commands are illustrative, deterministic, and auditable.

### 15.1 Phase A — Evidence Preparation (Client‑Side)

```bash
# Freeze evidence bundle
zip -r evidence_bundle.zip ./evidence/

# Compute local hash for pre‑submission record
shasum -a 256 evidence_bundle.zip
```

### 15.2 Phase B — Verification Creation (Public Execution)

```bash
# Create payment intent (server‑side)
curl -X POST https://www.verifrax.net/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"price_tier":"standard"}'

# Submit evidence for verification
curl -X POST https://www.verifrax.net/api/verify \
  -H "Authorization: Bearer <payment_intent_token>" \
  -F "bundle=@evidence_bundle.zip" \
  -F "profile_id=public@1.0.0"
```

### 15.3 Phase C — Certificate Retrieval

```bash
# Retrieve certificate by hash
curl https://www.verifrax.net/certificate/<certificate_hash> \
  -o certificate.json
```

### 15.4 Phase D — Offline Verification (Third Party)

```bash
# Verify certificate offline
verifrax-verify \
  --certificate certificate.json \
  --bundle evidence_bundle.zip \
  --profile public@1.0.0
```

### 15.5 Phase E — Export & Physical Use

```bash
# Generate PDF with embedded QR
verifrax-export \
  --certificate certificate.json \
  --format pdf \
  --output certificate.pdf
```

### 15.6 Phase F — Independent Re‑Verification (Adversarial)

```bash
# Verify certificate hash manually
shasum -a 256 certificate.json

# Validate QR target URL
curl -I https://www.verifrax.net/certificate/<certificate_hash>
```

---

## 16. REGULATORY & ADVERSARIAL RELIANCE TEST (PASS)

Any hostile reviewer must be able to answer YES:
- Can I inspect the system without permission?
- Can I reproduce verification without trust?
- Can outcomes be changed later? (NO)
- Can this survive operator death? (YES)

---

## 17. ONE‑LINE FINAL STATEMENT

**VERIFRAX v2.5.0 is a publicly accessible, single‑execution, deterministic verification system whose certificates are cryptographically sealed, final, immutable, independently verifiable forever, and operationally executable through transparent, auditable commands across digital and physical domains without introducing trust, discretion, or interpretive authority.**

