# VERIFRAX Specification v2.5.0 — Draft B (Hardened)

**Version:** 2.5.0  
**Status:** DRAFT B (Adversarially Hardened)  
**Authority:** NON-AUTHORITATIVE (Draft)  
**Date:** 2025-01-XX

---

## Core Invariant

> v2.5.0 adds *structure and clarity*, not *power or custody*.  
> All authority remains documentary + cryptographic.

---

## 0. Interpretation Boundaries (CRITICAL)

### 0.1 What v2.5.0 Features Do NOT Mean

**Classification:**
- Classification does **NOT** imply legal evidence
- Classification does **NOT** imply authoritative categorization
- Classification does **NOT** imply enforcement
- Classification is **metadata only**, informational, non-authoritative

**Failure Classes:**
- Failure classes do **NOT** imply mandatory remediation
- Failure classes do **NOT** imply enforcement
- Failure classes do **NOT** imply authoritative taxonomy
- Failure classes are **taxonomic only**, informational, non-authoritative
- "fatal" means "verification cannot proceed", **NOT** "action required"

**TCB Validation:**
- TCB validation does **NOT** imply VERIFRAX endorses TCB issuer
- TCB validation does **NOT** imply trust
- TCB validation does **NOT** imply authoritative trust
- TCB validation is **schema + signature only**, no interpretation

**Multi-Profile:**
- Multi-profile does **NOT** imply compliance verification
- Multi-profile does **NOT** imply dispute resolution
- Multi-profile does **NOT** imply authoritative compliance
- Multi-profile results are **parallel, non-collapsing, non-authoritative**

### 0.2 What Certificates Do NOT Assert

Certificates **do NOT** assert:
- Legal validity of claims
- Truth of claims
- Enforceability of claims
- Acceptance of claims
- Obligation to act on claims
- Compliance with regulations
- Endorsement by VERIFRAX
- Trust in claims or evidence

Certificates **ONLY** assert:
- Deterministic verification execution
- Cryptographic integrity
- Profile compliance
- Immutable record

### 0.3 Payment Semantics

**Payment = documentation fee only**

- Payment does **NOT** imply acceptance
- Payment does **NOT** imply obligation
- Payment does **NOT** imply custody
- Payment does **NOT** imply enforcement
- Payment does **NOT** block verification truth (verification is free, offline, reproducible)

---

## 1. Verification Classification

### 1.1 Classification Types

VERIFRAX v2.5.0 introduces explicit **verification classification** to categorize the nature and scope of verification results.

**CRITICAL DISCLAIMER:** Classification is **informational only, not authoritative**. Classification does not imply legal evidence, enforcement, or authoritative categorization.

#### Classification Values

- **`evidentiary_metadata`**: Verification establishes factual evidence metadata about claims (informational only)
- **`procedural_metadata`**: Verification confirms adherence to procedural requirements (informational only)
- **`archival_metadata`**: Verification creates an immutable archival record (informational only)

**Note:** Classification values are suffixed with `_metadata` to emphasize they are metadata only, not authoritative classifications.

#### Classification Semantics

- **Non-exclusive**: A verification may have multiple classifications
- **Declarative**: Classification does not change verification logic
- **Metadata-only**: Classification is informational, not authoritative
- **Non-authoritative**: Classification does not imply legal evidence or enforcement

#### Classification Structure

```json
{
  "classification": {
    "types": ["evidentiary_metadata", "procedural_metadata"],
    "primary": "evidentiary_metadata",
    "scope": "claims_validation"
  }
}
```

**Fields:**
- `types` (array, required): List of applicable classification types (all suffixed with `_metadata`)
- `primary` (string, optional): Primary classification type (informational only)
- `scope` (string, optional): Scope descriptor (informational)

#### Classification Rules

1. Classification is **deterministic** based on bundle contents and profile
2. Classification does **not** affect verdict computation
3. Classification is **optional** (may be omitted for v2.4.0 compatibility)
4. Classification is **additive** (does not replace existing verdict structure)
5. Classification is **non-authoritative** (informational only)

#### Classification Disclaimers

- Classification does **NOT** imply legal evidence
- Classification does **NOT** imply authoritative categorization
- Classification does **NOT** imply enforcement
- Classification is **metadata only**

---

## 2. Failure Classes

### 2.1 Failure Taxonomy

VERIFRAX v2.5.0 introduces a **deterministic failure taxonomy** to categorize verification failures systematically.

**CRITICAL DISCLAIMER:** Failure classes are **taxonomic only, not enforcement**. Failure classes do not imply mandatory remediation, enforcement, or authoritative taxonomy.

#### Failure Class Structure

```json
{
  "failure_class": {
    "category": "evidence",
    "severity": "verification_blocking",
    "code": "VFX-EVIDENCE-0100",
    "description": "Bundle hash mismatch"
  }
}
```

**Note:** Severity level `fatal` is renamed to `verification_blocking` to emphasize it means "verification cannot proceed", not "action required".

#### Failure Categories

- **`evidence`**: Failures related to evidence bundle structure or integrity
- **`claims`**: Failures related to claim validation or structure
- **`contradiction`**: Failures related to logical contradictions
- **`profile`**: Failures related to profile requirements
- **`signature`**: Failures related to cryptographic signatures
- **`schema`**: Failures related to schema validation
- **`invalidation`**: Failures related to invalidation index matches

#### Severity Levels

- **`verification_blocking`**: Verification cannot proceed (verdict = INVALID) — **does NOT mean "action required"**
- **`error`**: Verification completes but with errors (verdict may be INVALID) — **does NOT mean "must fix"**
- **`warning`**: Verification completes but with warnings (verdict may be VALID) — **does NOT mean "should fix"**
- **`info`**: Informational only (does not affect verdict) — **does NOT mean "note"**

#### Failure Class Rules

1. Failure classes are **deterministic** (same failure → same class)
2. Failure classes are **taxonomic** (hierarchical categorization)
3. Failure classes are **non-authoritative** (informational only)
4. Failure classes **do not** change existing reason_code semantics
5. Failure classes **do not** imply enforcement or remediation

#### Failure Class Mapping

Existing `reason_codes` map to failure classes deterministically:

```json
{
  "reason_code": "VFX-EVIDENCE-0100",
  "failure_class": {
    "category": "evidence",
    "severity": "verification_blocking",
    "code": "VFX-EVIDENCE-0100"
  }
}
```

#### Failure Class Disclaimers

- Failure classes do **NOT** imply mandatory remediation
- Failure classes do **NOT** imply enforcement
- Failure classes do **NOT** imply authoritative taxonomy
- Severity levels are **informational only**
- "verification_blocking" means "verification cannot proceed", **NOT** "action required"

---

## 3. Trust Context Bundles (TCB)

### 3.1 TCB Definition

**Trust Context Bundles (TCB)** are optional, external, revocable context that may be attached to verification results.

**CRITICAL DISCLAIMER:** TCB validation is **schema + signature only, no interpretation**. TCB validation does not imply VERIFRAX endorses TCB issuer, trust, or authoritative trust.

#### TCB Properties

- **Optional**: TCBs are not required for verification
- **External**: TCBs are provided by external parties (not VERIFRAX)
- **Revocable**: TCBs may be revoked by their issuers
- **Non-authoritative**: TCBs do not affect verification truth
- **Non-endorsement**: TCB validation does not imply VERIFRAX endorsement

#### TCB Structure

```json
{
  "tcb": {
    "tcb_id": "tcb-uuid-v4",
    "issuer": "external-party-id",
    "context_type": "attestation",
    "schema_version": "1.0.0",
    "signature": {
      "algorithm": "ECDSA",
      "public_key": "base64-encoded-public-key",
      "signature": "base64-encoded-signature"
    },
    "payload": {
      "attestation": "base64-encoded-json"
    },
    "revocation_status": "active"
  }
}
```

#### TCB Validation

TCB validation is **schema + signature only**:

1. Validate TCB schema structure
2. Verify cryptographic signature
3. Check revocation status (if revocation registry available)
4. **Do not** interpret TCB payload semantics
5. **Do not** imply endorsement or trust

#### TCB Rules

1. TCBs are **optional** (verification proceeds without TCB)
2. TCB validation is **deterministic** (same TCB → same validation result)
3. TCB validation is **offline** (no network calls required)
4. TCB validation **does not** affect verdict computation
5. TCB revocation **does not** invalidate certificates (certificates are immutable)
6. TCB validation **does not** imply VERIFRAX endorsement

#### TCB in Certificate

TCBs may be included in certificate metadata:

```json
{
  "certificate": {
    "upload_id": "uuid-v4",
    "bundle_hash": "sha256:...",
    "verdict": "verified",
    "tcb_refs": [
      {
        "tcb_id": "tcb-uuid-v4",
        "validation_status": "schema_valid",
        "validation_hash": "sha256:..."
      }
    ]
  }
}
```

**Note:** TCB references are **metadata only**. They do not affect certificate hash computation. `validation_status: "schema_valid"` means schema and signature validation passed, **NOT** that VERIFRAX endorses the TCB.

#### TCB Disclaimers

- TCB validation does **NOT** imply VERIFRAX endorses TCB issuer
- TCB validation does **NOT** imply trust
- TCB validation does **NOT** imply authoritative trust
- TCB validation is **schema + signature only**, no interpretation
- TCB validation status means "schema and signature valid", **NOT** "endorsed"

---

## 4. Multi-Profile Attestation

### 4.1 Parallel Profile Execution

VERIFRAX v2.5.0 supports **parallel, non-collapsing** execution across multiple profiles.

**CRITICAL DISCLAIMER:** Multi-profile results are **parallel, non-collapsing, non-authoritative**. Multi-profile does not imply compliance verification, dispute resolution, or authoritative compliance.

#### Multi-Profile Structure

```json
{
  "multi_profile": {
    "profiles": ["public@1.0.0", "enterprise@1.0.0", "forensics@1.0.0"],
    "execution_mode": "parallel",
    "results": [
      {
        "profile_id": "public@1.0.0",
        "verdict": "verified",
        "reason_codes": []
      },
      {
        "profile_id": "enterprise@1.0.0",
        "verdict": "verified",
        "reason_codes": []
      },
      {
        "profile_id": "forensics@1.0.0",
        "verdict": "verified",
        "reason_codes": []
      }
    ]
  }
}
```

#### Execution Rules

1. **Parallel**: All profiles execute independently (no sequential dependencies)
2. **Non-collapsing**: Results from different profiles do not merge or override each other
3. **Deterministic**: Same bundle + same profiles → same results
4. **Independent**: Each profile result is computed independently
5. **Non-authoritative**: Multi-profile results do not imply compliance or dispute resolution

#### Multi-Profile Certificate

Multi-profile execution produces a certificate with multiple profile results:

```json
{
  "certificate": {
    "upload_id": "uuid-v4",
    "bundle_hash": "sha256:...",
    "multi_profile": {
      "profiles": ["public@1.0.0", "enterprise@1.0.0"],
      "results": [...]
    },
    "certificate_hash": "sha256:..."
  }
}
```

#### Multi-Profile Hash Computation

Certificate hash includes all profile results:

1. Build certificate object with all profile results
2. Canonical-stringify (preserving array order)
3. Compute SHA-256 hash
4. Add `certificate_hash` field

**Critical:** Profile result order is **deterministic** (sorted by profile_id).

#### Multi-Profile Disclaimers

- Multi-profile does **NOT** imply compliance verification
- Multi-profile does **NOT** imply dispute resolution
- Multi-profile does **NOT** imply authoritative compliance
- Multi-profile results are **parallel, non-collapsing, non-authoritative**
- Each profile result is **independent**, does not override others

---

## 5. Non-Goals Register

### 5.1 Explicitly Banned

The following are **explicitly banned** from v2.5.0:

- **Custody**: VERIFRAX does not take custody of evidence or certificates
- **Enforcement**: VERIFRAX does not enforce verification results
- **Dispute Resolution**: VERIFRAX does not resolve disputes
- **Payment Implication**: Payment does not imply acceptance or obligation
- **Endorsement**: VERIFRAX does not endorse claims, evidence, or TCB issuers
- **Compliance Verification**: VERIFRAX does not verify compliance
- **Trust Authority**: VERIFRAX does not provide trust authority

### 5.2 Interpretation Boundaries

Certificates **do not** assert:

- Legal validity of claims
- Truth of claims
- Enforceability of claims
- Acceptance of claims
- Obligation to act on claims
- Compliance with regulations
- Endorsement by VERIFRAX
- Trust in claims or evidence

Certificates **only** assert:

- Deterministic verification execution
- Cryptographic integrity
- Profile compliance
- Immutable record

---

## 6. v2.4.0 Compatibility

### 6.1 Backward Compatibility

v2.5.0 is **fully backward compatible** with v2.4.0:

- v2.4.0 certificates remain valid
- v2.4.0 bundles verify correctly
- v2.4.0 profiles are supported
- v2.4.0 reason_codes are preserved

### 6.2 Forward Compatibility

v2.5.0 certificates may include v2.5.0 features:

- Classification (optional)
- Failure classes (optional)
- TCB references (optional)
- Multi-profile results (optional)

v2.4.0 verifiers **ignore** v2.5.0 features (graceful degradation).

### 6.3 Version Isolation

- v2.4.0 and v2.5.0 are **isolated** (no shared code paths)
- v2.4.0 behavior is **immutable** (no retroactive changes)
- v2.5.0 does **not** affect v2.4.0 certificates

---

## 7. Reference Implementation Requirements

### 7.1 Offline-Only

v2.5.0 reference verifier must be **offline-only**:

- No network calls
- No environment variables (except file paths)
- No secrets
- No external dependencies (beyond standard libraries)

### 7.2 Determinism

v2.5.0 reference verifier must be **deterministic**:

- Same inputs → identical outputs
- No randomness
- No time-dependent logic (except metadata timestamps)
- No external state

### 7.3 Feature Support

v2.5.0 reference verifier must support:

- Classification output
- Failure class taxonomy
- TCB validation (schema + signature only)
- Multi-profile parallel execution

---

## 8. Authority and Semantics

### 8.1 Documentary Authority

v2.5.0 maintains **documentary authority**:

- Certificates are documents
- Verification is documentary process
- Results are documentary records

### 8.2 Cryptographic Authority

v2.5.0 maintains **cryptographic authority**:

- Hashes are cryptographic proofs
- Signatures are cryptographic proofs
- Integrity is cryptographically verifiable

### 8.3 No Custody

v2.5.0 maintains **no custody**:

- VERIFRAX does not hold evidence
- VERIFRAX does not hold certificates
- VERIFRAX does not hold authority

### 8.4 No Endorsement

v2.5.0 maintains **no endorsement**:

- VERIFRAX does not endorse claims
- VERIFRAX does not endorse evidence
- VERIFRAX does not endorse TCB issuers
- VERIFRAX does not endorse profiles

---

## 9. Exit Gate

This specification is **readable by regulator without questions**:

- Clear classification system (with explicit disclaimers)
- Deterministic failure taxonomy (with explicit disclaimers)
- Optional TCB support (with explicit disclaimers)
- Parallel multi-profile execution (with explicit disclaimers)
- Explicit non-goals
- Clear interpretation boundaries
- Zero semantic authority leakage

**Status:** DRAFT B — Ready for reference implementation (PHASE 3)

---

## Appendix A: Schema Extensions

### A.1 Classification Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "classification": {
      "type": "object",
      "properties": {
        "types": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["evidentiary_metadata", "procedural_metadata", "archival_metadata"]
          }
        },
        "primary": {
          "type": "string",
          "enum": ["evidentiary_metadata", "procedural_metadata", "archival_metadata"]
        },
        "scope": {
          "type": "string"
        }
      },
      "required": ["types"]
    }
  }
}
```

### A.2 Failure Class Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "failure_class": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "enum": ["evidence", "claims", "contradiction", "profile", "signature", "schema", "invalidation"]
        },
        "severity": {
          "type": "string",
          "enum": ["verification_blocking", "error", "warning", "info"]
        },
        "code": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "required": ["category", "severity", "code"]
    }
  }
}
```

### A.3 TCB Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "tcb": {
      "type": "object",
      "properties": {
        "tcb_id": {
          "type": "string",
          "format": "uuid"
        },
        "issuer": {
          "type": "string"
        },
        "context_type": {
          "type": "string"
        },
        "schema_version": {
          "type": "string"
        },
        "signature": {
          "type": "object",
          "properties": {
            "algorithm": {
              "type": "string"
            },
            "public_key": {
              "type": "string"
            },
            "signature": {
              "type": "string"
            }
          },
          "required": ["algorithm", "public_key", "signature"]
        },
        "payload": {
          "type": "object"
        },
        "revocation_status": {
          "type": "string",
          "enum": ["active", "revoked", "unknown"]
        }
      },
      "required": ["tcb_id", "issuer", "signature"]
    }
  }
}
```

---

**END OF SPEC v2.5.0 DRAFT B (HARDENED)**

