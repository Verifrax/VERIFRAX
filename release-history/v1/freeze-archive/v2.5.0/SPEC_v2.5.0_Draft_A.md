# VERIFRAX Specification v2.5.0 — Draft A

**Version:** 2.5.0  
**Status:** DRAFT A  
**Authority:** NON-AUTHORITATIVE (Draft)  
**Date:** 2025-01-XX

---

## Core Invariant

> v2.5.0 adds *structure and clarity*, not *power or custody*.  
> All authority remains documentary + cryptographic.

---

## 1. Verification Classification

### 1.1 Classification Types

VERIFRAX v2.5.0 introduces explicit **verification classification** to categorize the nature and scope of verification results.

#### Classification Values

- **`evidentiary`**: Verification establishes factual evidence about claims
- **`procedural`**: Verification confirms adherence to procedural requirements
- **`archival`**: Verification creates an immutable archival record

#### Classification Semantics

- **Non-exclusive**: A verification may have multiple classifications
- **Declarative**: Classification does not change verification logic
- **Metadata-only**: Classification is informational, not authoritative

#### Classification Structure

```json
{
  "classification": {
    "types": ["evidentiary", "procedural"],
    "primary": "evidentiary",
    "scope": "claims_validation"
  }
}
```

**Fields:**
- `types` (array, required): List of applicable classification types
- `primary` (string, optional): Primary classification type
- `scope` (string, optional): Scope descriptor (informational)

#### Classification Rules

1. Classification is **deterministic** based on bundle contents and profile
2. Classification does **not** affect verdict computation
3. Classification is **optional** (may be omitted for v2.4.0 compatibility)
4. Classification is **additive** (does not replace existing verdict structure)

---

## 2. Failure Classes

### 2.1 Failure Taxonomy

VERIFRAX v2.5.0 introduces a **deterministic failure taxonomy** to categorize verification failures systematically.

#### Failure Class Structure

```json
{
  "failure_class": {
    "category": "evidence",
    "severity": "fatal",
    "code": "VFX-EVIDENCE-0100",
    "description": "Bundle hash mismatch"
  }
}
```

#### Failure Categories

- **`evidence`**: Failures related to evidence bundle structure or integrity
- **`claims`**: Failures related to claim validation or structure
- **`contradiction`**: Failures related to logical contradictions
- **`profile`**: Failures related to profile requirements
- **`signature`**: Failures related to cryptographic signatures
- **`schema`**: Failures related to schema validation
- **`invalidation`**: Failures related to invalidation index matches

#### Severity Levels

- **`fatal`**: Verification cannot proceed (verdict = INVALID)
- **`error`**: Verification completes but with errors (verdict may be INVALID)
- **`warning`**: Verification completes but with warnings (verdict may be VALID)
- **`info`**: Informational only (does not affect verdict)

#### Failure Class Rules

1. Failure classes are **deterministic** (same failure → same class)
2. Failure classes are **taxonomic** (hierarchical categorization)
3. Failure classes are **non-authoritative** (informational only)
4. Failure classes **do not** change existing reason_code semantics

#### Failure Class Mapping

Existing `reason_codes` map to failure classes deterministically:

```json
{
  "reason_code": "VFX-EVIDENCE-0100",
  "failure_class": {
    "category": "evidence",
    "severity": "fatal",
    "code": "VFX-EVIDENCE-0100"
  }
}
```

---

## 3. Trust Context Bundles (TCB)

### 3.1 TCB Definition

**Trust Context Bundles (TCB)** are optional, external, revocable context that may be attached to verification results.

#### TCB Properties

- **Optional**: TCBs are not required for verification
- **External**: TCBs are provided by external parties (not VERIFRAX)
- **Revocable**: TCBs may be revoked by their issuers
- **Non-authoritative**: TCBs do not affect verification truth

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

#### TCB Rules

1. TCBs are **optional** (verification proceeds without TCB)
2. TCB validation is **deterministic** (same TCB → same validation result)
3. TCB validation is **offline** (no network calls required)
4. TCB validation **does not** affect verdict computation
5. TCB revocation **does not** invalidate certificates (certificates are immutable)

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
        "validation_status": "valid",
        "validation_hash": "sha256:..."
      }
    ]
  }
}
```

**Note:** TCB references are **metadata only**. They do not affect certificate hash computation.

---

## 4. Multi-Profile Attestation

### 4.1 Parallel Profile Execution

VERIFRAX v2.5.0 supports **parallel, non-collapsing** execution across multiple profiles.

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

---

## 5. Non-Goals Register

### 5.1 Explicitly Banned

The following are **explicitly banned** from v2.5.0:

- **Custody**: VERIFRAX does not take custody of evidence or certificates
- **Enforcement**: VERIFRAX does not enforce verification results
- **Dispute Resolution**: VERIFRAX does not resolve disputes
- **Payment Implication**: Payment does not imply acceptance or obligation

### 5.2 Interpretation Boundaries

Certificates **do not** assert:

- Legal validity of claims
- Truth of claims
- Enforceability of claims
- Acceptance of claims
- Obligation to act on claims

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

---

## 9. Exit Gate

This specification is **readable by regulator without questions**:

- Clear classification system
- Deterministic failure taxonomy
- Optional TCB support
- Parallel multi-profile execution
- Explicit non-goals
- Clear interpretation boundaries

**Status:** DRAFT A — Ready for adversarial review (PHASE 2)

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
            "enum": ["evidentiary", "procedural", "archival"]
          }
        },
        "primary": {
          "type": "string",
          "enum": ["evidentiary", "procedural", "archival"]
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
          "enum": ["fatal", "error", "warning", "info"]
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

**END OF SPEC v2.5.0 DRAFT A**

