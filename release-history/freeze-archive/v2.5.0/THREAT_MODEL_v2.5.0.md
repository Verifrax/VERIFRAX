# VERIFRAX v2.5.0 Threat Model

**Version:** 2.5.0  
**Status:** DRAFT  
**Purpose:** Identify and mitigate semantic authority leakage

---

## Threat Categories

### 1. Enforcement Interpretation

**Threat:** v2.5.0 features could be interpreted as enforcement mechanisms.

**Vectors:**
- Classification could imply legal enforcement
- Failure classes could imply mandatory remediation
- Multi-profile results could imply compliance requirements

**Mitigation:**
- Explicit disclaimers: "Classification is informational only"
- Explicit disclaimers: "Failure classes do not imply enforcement"
- Explicit disclaimers: "Multi-profile results are parallel, non-authoritative"

---

### 2. Payment Obligation Interpretation

**Threat:** Payment could be interpreted as acceptance or obligation.

**Vectors:**
- Payment for verification could imply acceptance of results
- Payment for multi-profile could imply compliance obligation
- Payment for TCB validation could imply trust obligation

**Mitigation:**
- Explicit statement: "Payment = documentation fee only"
- Explicit statement: "Payment ≠ acceptance"
- Explicit statement: "Payment ≠ obligation"
- Explicit statement: "Payment ≠ custody"

---

### 3. Custody Interpretation

**Threat:** v2.5.0 features could imply VERIFRAX takes custody.

**Vectors:**
- TCB storage could imply custody
- Multi-profile execution could imply custody
- Classification storage could imply custody

**Mitigation:**
- Explicit statement: "TCBs are external, revocable"
- Explicit statement: "VERIFRAX does not hold TCBs"
- Explicit statement: "VERIFRAX does not take custody"
- Explicit statement: "All data is user-provided"

---

### 4. Authority Escalation

**Threat:** v2.5.0 features could escalate VERIFRAX authority.

**Vectors:**
- Classification could imply authoritative categorization
- Failure classes could imply authoritative taxonomy
- TCB validation could imply authoritative trust

**Mitigation:**
- Explicit statement: "Classification is declarative, not authoritative"
- Explicit statement: "Failure classes are taxonomic, not authoritative"
- Explicit statement: "TCB validation is schema + signature only, no interpretation"

---

### 5. Dispute Resolution Interpretation

**Threat:** v2.5.0 features could be interpreted as dispute resolution.

**Vectors:**
- Multi-profile results could imply dispute resolution
- Failure classes could imply dispute categorization
- Classification could imply dispute classification

**Mitigation:**
- Explicit statement: "VERIFRAX does not resolve disputes"
- Explicit statement: "Multi-profile results are parallel, non-collapsing"
- Explicit statement: "Failure classes are informational only"

---

## Semantic Leakage Points

### Leakage Point 1: Classification

**Risk:** "evidentiary" classification could imply legal evidence.

**Mitigation:**
- Rename to "evidentiary_metadata" or "classification_evidentiary"
- Add explicit disclaimer: "Classification does not imply legal evidence"
- Add explicit disclaimer: "Classification is metadata only"

### Leakage Point 2: Failure Classes

**Risk:** "fatal" severity could imply mandatory action.

**Mitigation:**
- Add explicit disclaimer: "Severity levels are informational only"
- Add explicit disclaimer: "Severity does not imply enforcement"
- Clarify: "fatal" means "verification cannot proceed", not "action required"

### Leakage Point 3: TCB Validation

**Risk:** TCB validation could imply VERIFRAX endorses TCB issuer or performs cryptographic verification.

**Mitigation:**
- Explicit statement: "TCB validation is schema + signature structure validation only"
- Explicit statement: "Cryptographic signature verification is out of scope by design"
- Explicit statement: "TCB validation does not imply endorsement"
- Explicit statement: "TCB validation does not imply trust"

### Leakage Point 4: Multi-Profile

**Risk:** Multi-profile results could imply compliance verification.

**Mitigation:**
- Explicit statement: "Multi-profile results are parallel, non-collapsing"
- Explicit statement: "Multi-profile does not imply compliance"
- Explicit statement: "Each profile result is independent"

---

## Hardening Actions

### Action 1: Add Explicit Disclaimers

Add to SPEC v2.5.0:
- "Classification is informational only, not authoritative"
- "Failure classes are taxonomic only, not enforcement"
- "TCB validation is schema + signature structure validation only, no interpretation"
- "Cryptographic signature verification is out of scope by design"
- "Multi-profile results are parallel, non-collapsing, non-authoritative"

### Action 2: Rename Ambiguous Terms

Consider renaming:
- "evidentiary" → "evidentiary_metadata"
- "fatal" → "verification_blocking"
- "validation" → "schema_validation" (for TCB)

### Action 3: Add Interpretation Boundaries

Add explicit section:
- "What certificates do NOT assert"
- "What classification does NOT mean"
- "What failure classes do NOT imply"
- "What TCB validation does NOT mean"

---

## Exit Gate

**Zero semantic authority leakage.**

All threats identified and mitigated with explicit disclaimers and interpretation boundaries.

**Status:** READY FOR DRAFT B

