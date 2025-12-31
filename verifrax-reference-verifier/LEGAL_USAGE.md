# VERIFRAX Certificate: Legal Usage Guide

**Version:** 2.4.0  
**Status:** CANDIDATE  
**Purpose:** Define what a VERIFRAX certificate proves and does not prove in legal, audit, and arbitration contexts.

---

## What a VERIFRAX Certificate Proves

A VERIFRAX certificate with status `VALID` proves the following **technical facts**:

### 1. Cryptographic Integrity

- The certificate hash matches the certificate contents
- The bundle hash matches the evidence bundle
- The certificate was issued by VERIFRAX v2.4.0
- The certificate has not been tampered with since issuance

### 2. Verification Execution

- VERIFRAX executed deterministic verification on the evidence bundle
- The verification used the specified profile (`public@1.0.0` or other)
- The verification produced the verdict stated in the certificate
- The verdict is cryptographically bound to the evidence

### 3. Finality Declaration

- The certificate contains a finality statement
- The certificate represents delivery acceptance
- The associated dispute space is closed upon issuance

### 4. Independent Verifiability

- The certificate can be verified without VERIFRAX infrastructure
- The certificate can be verified using the reference verifier
- The certificate remains valid even if VERIFRAX is unavailable

---

## What a VERIFRAX Certificate Does NOT Prove

A VERIFRAX certificate does **not** prove:

### 1. Truth or Accuracy

- The evidence is true
- The evidence is accurate
- The evidence is complete
- The evidence is correct

### 2. Intent or Authorship

- The evidence was created with specific intent
- The evidence was created by a specific party
- The evidence represents a specific party's position

### 3. Legal Compliance

- The evidence complies with laws or regulations
- The evidence satisfies legal requirements
- The evidence is legally sufficient

**Note:** VERIFRAX does not determine legal admissibility. Legal admissibility is external to VERIFRAX.

### 4. Quality or Suitability

- The evidence is of acceptable quality
- The evidence is suitable for its intended purpose
- The evidence meets any quality standards

### 5. Completeness

- The evidence contains all relevant information
- The evidence is comprehensive
- No relevant evidence was omitted

---

## Third-Party Verification

Any third party (judge, auditor, regulator) can verify a VERIFRAX certificate independently:

1. **Obtain the Evidence Package:**
   - `bundle.bin` (evidence bundle)
   - `certificate.json` (VERIFRAX certificate)
   - Reference verifier (from `verifrax-reference-verifier/`)

2. **Run the Reference Verifier:**
   ```bash
   node cli.js \
     --bundle bundle.bin \
     --certificate certificate.json \
     --profile public@1.0.0
   ```

3. **Interpret the Result:**
   - `VALID` → Certificate is cryptographically valid
   - `INVALID` → Certificate is invalid or tampered with

**No VERIFRAX involvement required.**

---

## Legal Authority

A VERIFRAX certificate is a **technical verification artifact**, not a legal judgment.

### In Legal Proceedings

- A certificate may be submitted as evidence of verification execution
- A certificate does not replace judicial determination
- A certificate does not establish legal facts
- A certificate does not prove legal compliance

### In Arbitration

- A certificate may be used to establish technical finality
- A certificate may reduce disputes about verification execution
- A certificate does not replace arbitrator judgment
- A certificate does not establish contractual compliance

### In Audits

- A certificate may demonstrate verification was performed
- A certificate may establish cryptographic integrity
- A certificate does not replace auditor judgment
- A certificate does not establish regulatory compliance

---

## Version

**v2.4.0** (candidate, pending freeze)

This document applies to certificates issued by VERIFRAX Worker v2.4.0.

