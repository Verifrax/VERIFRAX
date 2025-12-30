# Why VERIFRAX Cannot Cheat

**Version:** 2.4.0  
**Status:** CANDIDATE  
**Purpose:** Demonstrate that VERIFRAX certificates remain valid even if VERIFRAX is malicious, compromised, or ceases operations.

---

## Core Principle

**VERIFRAX certificates are cryptographically self-sufficient. VERIFRAX cannot alter, revoke, or invalidate issued certificates.**

---

## No Revocation

### What This Means

Once a certificate is issued:
- It cannot be revoked by VERIFRAX
- It cannot be marked as invalid by VERIFRAX
- It cannot be withdrawn by VERIFRAX
- It remains valid regardless of VERIFRAX's wishes

### Why This Works

1. **Certificate Hash is Deterministic**
   - The certificate hash is computed from certificate contents
   - Same contents → same hash
   - VERIFRAX cannot change the hash without changing contents
   - Changing contents breaks the hash → certificate becomes invalid

2. **Certificate is Persisted**
   - Certificate is written to storage at issuance time
   - Certificate is immutable (never modified)
   - Certificate can be copied and distributed
   - VERIFRAX cannot delete all copies

3. **Reference Verifier is Independent**
   - Reference verifier is published and hashed
   - Reference verifier can be downloaded and verified
   - Reference verifier does not depend on VERIFRAX
   - Anyone can verify certificates without VERIFRAX

### Attack Scenario: VERIFRAX Tries to Revoke

**What VERIFRAX could do:**
- Delete certificate from R2 storage
- Refuse to serve certificate via API
- Claim certificate is invalid

**What VERIFRAX cannot do:**
- Change the certificate hash (breaks cryptographic integrity)
- Invalidate a valid certificate (reference verifier still confirms VALID)
- Prevent third-party verification (reference verifier is independent)

**Result:** Certificate remains valid. Third parties can verify independently.

---

## No Override

### What This Means

VERIFRAX cannot:
- Override a verdict after issuance
- Change a certificate's contents
- Modify a certificate's hash
- Issue a "corrected" certificate that invalidates the original

### Why This Works

1. **Certificate Hash is Cryptographic Proof**
   - Hash proves certificate integrity
   - Changing any field changes the hash
   - New hash ≠ original hash → certificate is invalid
   - Original certificate remains valid

2. **Deterministic Verification**
   - Same bundle + same profile → same verdict
   - VERIFRAX cannot change the verdict for the same bundle
   - New verdict would require different inputs
   - Original certificate remains valid

3. **Public Algorithm**
   - Verification algorithm is public
   - Reference verifier is public
   - Anyone can verify independently
   - VERIFRAX cannot claim different results

### Attack Scenario: VERIFRAX Tries to Override

**What VERIFRAX could do:**
- Issue a new certificate with different verdict
- Claim the original certificate was in error
- Refuse to acknowledge the original certificate

**What VERIFRAX cannot do:**
- Change the original certificate (hash breaks)
- Invalidate the original certificate (reference verifier confirms VALID)
- Prevent third-party verification (reference verifier is independent)

**Result:** Original certificate remains valid. New certificate (if issued) is a separate artifact.

---

## No Admin Backdoor

### What This Means

VERIFRAX has no:
- Secret keys to invalidate certificates
- Admin override mechanisms
- Backdoor access to modify certificates
- Special privileges to alter finality

### Why This Works

1. **No Secret Keys**
   - Certificate hash is computed from public contents
   - No secret keys are used
   - No cryptographic backdoor exists
   - VERIFRAX cannot forge valid certificates

2. **Public Algorithm**
   - Verification algorithm is public
   - Hash computation is public
   - Canonical stringify is public
   - No hidden mechanisms

3. **Deterministic Process**
   - Same inputs → same outputs
   - No randomness
   - No secret state
   - No privileged execution path

4. **Reference Verifier Independence**
   - Reference verifier is independent code
   - Reference verifier does not call VERIFRAX
   - Reference verifier does not trust VERIFRAX
   - Reference verifier verifies cryptographically

### Attack Scenario: VERIFRAX Has Admin Access

**What VERIFRAX could do:**
- Access R2 storage directly
- Modify stored certificates
- Delete certificates

**What VERIFRAX cannot do:**
- Create valid certificates with different hashes (hash breaks)
- Invalidate valid certificates (reference verifier confirms VALID)
- Prevent certificate distribution (certificates can be copied)
- Prevent independent verification (reference verifier is independent)

**Result:** Even with full admin access, VERIFRAX cannot invalidate issued certificates.

---

## Malicious VERIFRAX Scenario

### Scenario: VERIFRAX is Compromised or Malicious

**What a malicious VERIFRAX could do:**
- Issue fraudulent certificates
- Refuse to issue certificates
- Delete certificates from storage
- Claim certificates are invalid

**What a malicious VERIFRAX cannot do:**
- Invalidate valid certificates (reference verifier confirms VALID)
- Prevent independent verification (reference verifier is independent)
- Alter issued certificates (hash breaks)
- Revoke issued certificates (no revocation mechanism)

**Result:** Valid certificates remain valid. Third parties can verify independently.

---

## Company Failure Scenario

### Scenario: VERIFRAX Ceases Operations

**What happens:**
- VERIFRAX service goes offline
- VERIFRAX domain expires
- VERIFRAX company dissolves
- VERIFRAX infrastructure is destroyed

**What does NOT happen:**
- Certificates do not become invalid
- Certificates do not expire
- Certificates do not lose validity
- Certificates do not require VERIFRAX

**Result:** Certificates remain valid. Third parties can verify independently.

---

## Cryptographic Guarantees

### Certificate Hash

- Computed from certificate contents (deterministic)
- Cannot be changed without changing contents
- Changing contents breaks hash → certificate invalid
- Original certificate remains valid

### Bundle Hash

- Computed from bundle contents (deterministic)
- Cannot be changed without changing bundle
- Certificate binds to bundle hash
- Changing bundle breaks certificate

### Reference Verifier

- Independent code (no VERIFRAX dependency)
- Public algorithm (no secrets)
- Deterministic (same inputs → same outputs)
- Verifies cryptographically (no trust required)

---

## Trust Minimization

**VERIFRAX certificates require zero trust in VERIFRAX.**

Trust is placed in:
- Cryptography (SHA-256)
- Public algorithms (deterministic verification)
- Independent verifier (reference implementation)

Trust is NOT placed in:
- VERIFRAX's honesty
- VERIFRAX's availability
- VERIFRAX's infrastructure
- VERIFRAX's future existence

---

## Conclusion

**Even if VERIFRAX is malicious, certificates remain valid.**

This is the strongest trust posture possible:
- No revocation
- No override
- No admin backdoor
- No dependency on VERIFRAX

Certificates are **cryptographically self-sufficient** and **independently verifiable**.

---

## Version

**v2.4.0** (candidate, pending freeze)

This document applies to certificates issued by VERIFRAX Worker v2.4.0.

