# VERIFRAX Execution Pipeline — v2.6.0

**Version:** 2.6.0  
**Purpose:** Define the deterministic execution pipeline that produces certificates

---

## Pipeline Overview

The execution pipeline is a **pure function** that takes evidence bundle bytes and produces a certificate. It has:

- **No side effects**
- **No randomness**
- **No external dependencies**
- **No mutable state**
- **No retries**
- **No discretion**

Same inputs → same output, always.

---

## 1. Inputs

### Required Inputs

1. **Evidence Bundle** (`bundle.bin`)
   - Binary file containing evidence to be verified
   - Format: opaque binary (no structure assumed)
   - Size: arbitrary (subject to implementation limits)

2. **Profile Identifier** (`profile_id`)
   - String format: `^[a-z_]+@[0-9]+\.[0-9]+\.[0-9]+$`
   - Example: `public@1.0.0`
   - Defines the deterministic verification rules

3. **VERIFRAX Version** (`verifrax_version`)
   - String format: semantic version
   - Example: `2.6.0`
   - Defines the execution engine version

4. **Certificate Version** (`certificate_version`)
   - String format: semantic version
   - Example: `1.0.0`
   - Defines the certificate schema version

### Input Validation

- Bundle file must exist and be readable
- Profile identifier must match pattern
- Versions must be non-empty strings
- No other inputs are accepted

**If validation fails → execution terminates with error (no certificate produced).**

---

## 2. Hashing

### Bundle Hash Computation

1. Read bundle file as binary (no encoding, no interpretation)
2. Compute SHA-256 hash of raw bytes
3. Encode hash as 64-character lowercase hexadecimal string
4. No prefix (not `sha256:`, just hex)

**Formula:**
```
bundle_hash = SHA-256(bundle_bytes)
```

**Properties:**
- Deterministic: same bytes → same hash
- One-way: hash cannot reveal original bytes
- Collision-resistant: different bytes → different hash (with high probability)

### Hash Storage

The `bundle_hash` is stored in the certificate and used for:
- Certificate integrity verification
- Bundle authenticity verification
- Deterministic execution tracking

---

## 3. Deterministic Checks

### Profile-Based Verification

The profile identifier determines which verification rules to apply.

**For `public@1.0.0` (example):**

1. **Bundle Structure Check**
   - Verify bundle is non-empty
   - Verify bundle size is within limits (if specified by profile)
   - **If check fails → verdict: `not_verified`, reason_code: `BUNDLE_INVALID`**

2. **Content Verification**
   - Execute profile-specific verification logic
   - Apply deterministic rules defined by profile
   - **If check fails → verdict: `not_verified`, reason_code: `<profile_specific>`**

3. **No External Dependencies**
   - No network calls
   - No file system reads (beyond bundle)
   - No time-dependent logic
   - No random number generation

### Verification Rules

Each profile defines:
- What constitutes "verified"
- What constitutes "not_verified"
- What reason codes to emit

**Rules must be:**
- Deterministic (same inputs → same outputs)
- Pure (no side effects)
- Complete (all cases covered)

### Execution Order

1. Load profile rules (from profile identifier)
2. Execute checks in profile-defined order
3. Collect reason codes (if any)
4. Derive verdict

**No shortcuts. No caching. No early exits (except errors).**

---

## 4. Verdict Derivation

### Verdict Values

- `"verified"` — All checks passed
- `"not_verified"` — One or more checks failed

### Reason Codes

- Array of strings
- Empty array `[]` if verdict is `"verified"`
- Non-empty array if verdict is `"not_verified"`
- Order matters (codes appear in execution order)

### Verdict Logic

```
if (all_checks_passed) {
  verdict = "verified"
  reason_codes = []
} else {
  verdict = "not_verified"
  reason_codes = [collected_reason_codes]
}
```

**No ambiguity. No interpretation. No discretion.**

---

## 5. Certificate Construction

### Certificate Object (Without Hash)

Build certificate object with these fields in **exact order**:

1. `verifrax_version` — From input
2. `certificate_version` — From input
3. `bundle_hash` — Computed from bundle bytes
4. `profile_id` — From input
5. `verdict` — Derived from verification
6. `reason_codes` — Collected from verification
7. `executed_at` — Current timestamp (RFC3339, UTC, millisecond precision)

**Do not include `certificate_hash` yet.**

### Timestamp Generation

- Format: RFC3339 with millisecond precision
- Timezone: UTC (always `Z` suffix)
- Pattern: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Example: `2025-01-01T12:00:00.000Z`

**Note:** Timestamp is the **only** non-deterministic field. It records when execution occurred, but does not affect verification determinism.

### Canonical Serialization

1. Serialize certificate object (without `certificate_hash`) to canonical JSON
2. Follow `CANONICALIZATION.md` rules:
   - UTF-8 encoding
   - No pretty-printing
   - No trailing whitespace
   - Fields in exact order
   - No spaces after colons or commas

**Formula:**
```
canonical_json = canonical_stringify(certificate_object_without_hash)
```

### Certificate Hash Computation

1. Compute SHA-256 hash of canonical JSON string (UTF-8 encoded)
2. Encode as 64-character lowercase hexadecimal string
3. No prefix

**Formula:**
```
certificate_hash = SHA-256(UTF-8(canonical_json))
```

### Final Certificate

Add `certificate_hash` as the **final field**:

```
certificate = {
  ...certificate_object_without_hash,
  certificate_hash: computed_hash
}
```

### Final Serialization

Serialize final certificate to canonical JSON (following same rules).

**This is the certificate that is emitted.**

---

## 6. Finality Rules

### One Execution, One Certificate

- Each execution produces **exactly one** certificate
- No retries
- No revisions
- No amendments
- No supersession

### Immutability

- Certificate cannot be modified after emission
- Certificate hash is cryptographically bound to contents
- Any modification invalidates the certificate

### Irreversibility

- Execution cannot be undone
- Certificate cannot be revoked
- Verdict cannot be changed

### Independence

- Certificate validity does not depend on:
  - Infrastructure availability
  - Operator status
  - Payment status
  - External services
  - Network connectivity

### Survivability

- Certificate remains valid even if:
  - VERIFRAX infrastructure is destroyed
  - VERIFRAX operator disappears
  - Domain expires
  - Service shuts down

---

## Execution Guarantees

### Determinism

For identical:
- Bundle bytes
- Profile identifier
- VERIFRAX version

The execution **must** produce:
- Identical `bundle_hash`
- Identical `verdict`
- Identical `reason_codes`
- Identical `certificate_hash`

**Only `executed_at` may differ (timestamp).**

### Completeness

- Every execution produces a certificate
- Every certificate is complete (all 8 fields)
- Every certificate is valid (hash matches)

### Finality

- Execution is final upon certificate emission
- No post-execution modifications
- No dispute resolution
- No appeals

---

## Error Handling

### Input Errors

- Invalid bundle → execution terminates (no certificate)
- Invalid profile → execution terminates (no certificate)
- Missing inputs → execution terminates (no certificate)

### Execution Errors

- Profile load failure → execution terminates (no certificate)
- Verification logic error → execution terminates (no certificate)
- Serialization error → execution terminates (no certificate)

### No Partial Certificates

- Either a complete certificate is produced, or no certificate is produced
- No "pending" state
- No "incomplete" certificates
- No retry mechanisms

---

## Pipeline Summary

```
Inputs (bundle, profile, versions)
  ↓
Bundle Hash Computation
  ↓
Profile-Based Verification
  ↓
Verdict Derivation
  ↓
Certificate Construction (without hash)
  ↓
Canonical Serialization
  ↓
Certificate Hash Computation
  ↓
Final Certificate (with hash)
  ↓
Certificate Emission
```

**One path. No branches (except errors). No loops. No retries.**

---

## Implementation Requirements

### Pure Function

The execution pipeline must be implementable as a pure function:

```typescript
function execute(
  bundle: Uint8Array,
  profileId: string,
  verifraxVersion: string,
  certificateVersion: string
): Certificate {
  // Deterministic execution
  // No side effects
  // No external calls
  // Returns complete certificate
}
```

### Local Execution

The pipeline must be executable:
- Locally (no network)
- Offline (no external services)
- Independently (no VERIFRAX infrastructure)

### Reproducibility

The pipeline must be reproducible:
- Same inputs → same outputs
- Different machines → same results
- Different times → same results (except timestamp)

---

**END OF EXECUTION PIPELINE SPECIFICATION**

