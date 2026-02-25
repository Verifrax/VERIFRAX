# VERIFRAX Profile Authority & Immutability — v2.7.0

**Version:** 2.6.0  
**Purpose:** Define profile authority, versioning, immutability, and dispute-prevention

---

## 1. What a Profile Is

### Definition

A **profile** is a **frozen, versioned, immutable specification** that defines:

- What constitutes "verified" for a given evidence bundle
- What constitutes "not_verified" for a given evidence bundle
- What reason codes to emit for each failure mode
- What verification checks to execute (in order)
- What bundle constraints apply (size, structure, content)

### Profile Identity

A profile is identified by a **profile identifier**:

- Format: `^[a-z_]+@[0-9]+\.[0-9]+\.[0-9]+$`
- Example: `public@1.0.0`
- Components:
  - Profile name: `public` (semantic identifier)
  - Version: `1.0.0` (semantic version)

### Profile Structure

A profile is a **JSON object** with the following required fields:

- `profile_id` — The profile identifier (must match filename pattern)
- `profile_name` — The profile name component
- `version` — The version component
- `verification_rules` — Deterministic rules that define verification logic
- `reason_code_mappings` — Mapping from failure modes to reason codes
- `bundle_constraints` — Constraints on bundle structure and size

**No optional fields. No interpretation. No ambiguity.**

---

## 2. How Profiles Are Versioned

### Semantic Versioning

Profiles use **semantic versioning** (MAJOR.MINOR.PATCH):

- **MAJOR** — Breaking changes (incompatible verification logic)
- **MINOR** — New features (backward compatible)
- **PATCH** — Bug fixes (backward compatible)

### Version Immutability

Once a profile version is published:

- It **cannot** be modified
- It **cannot** be superseded retroactively
- It **cannot** be deleted
- It **cannot** be reinterpreted

**Version immutability is absolute and permanent.**

### Version Authority

The profile identifier (`profile_id`) is the **sole authority** for profile semantics.

- No aliases
- No redirects
- No "latest" references
- No default fallbacks

**If a profile version does not exist, execution terminates with error.**

---

## 3. How Profiles Are Made Immutable

### Cryptographic Binding

Each profile must have a **cryptographic hash**:

- Algorithm: SHA-256
- Encoding: 64-character lowercase hexadecimal (no prefix)
- Computed from: canonical JSON serialization of profile object

**Formula:**
```
profile_hash = SHA-256(UTF-8(canonical_json(profile)))
```

### Canonical Serialization

Profile JSON must be serialized canonically:

- UTF-8 encoding
- No pretty-printing
- No trailing whitespace
- Fields in deterministic order (alphabetical by key)
- Arrays in order

**Same profile → same hash, always.**

### Hash Publication

Profile hashes must be published in:

- `freeze/v2.7.0/PROFILE_HASHES.txt`
- Format: `<hash>  <profile_id>.json`
- One hash per profile version

**Hash publication is the proof of immutability.**

### Profile Storage

Profiles are stored as:

- Files: `verifrax-reference-verifier/profiles/<profile_id>.json`
- Immutable: Once published, file contents never change
- Versioned: Each version is a separate file

**File system is for distribution only. Hash is the authority.**

---

## 4. How Engines and Verifiers Agree on Profile Meaning

### Profile Loading Contract

Both engines and verifiers must:

1. **Load profile by identifier**
   - Resolve `profile_id` to profile file
   - Read profile JSON
   - Parse JSON (no interpretation)

2. **Verify profile hash**
   - Compute hash of loaded profile
   - Compare with published hash
   - **If mismatch → error (profile is corrupted or tampered)**

3. **Execute against profile rules**
   - Apply verification rules deterministically
   - Emit reason codes according to mappings
   - No interpretation, no discretion

### Deterministic Execution

Profile rules must be **executable deterministically**:

- Same profile + same bundle → same verdict
- Same profile + same bundle → same reason codes
- No randomness
- No external dependencies
- No time-dependent logic

### Profile Rule Format

Profile rules are defined as **declarative JSON**, not executable code:

```json
{
  "verification_rules": [
    {
      "check": "bundle_non_empty",
      "failure_reason": "BUNDLE_EMPTY"
    },
    {
      "check": "bundle_size_limit",
      "max_size_bytes": 1048576,
      "failure_reason": "BUNDLE_TOO_LARGE"
    }
  ],
  "reason_code_mappings": {
    "BUNDLE_EMPTY": "Bundle file is empty",
    "BUNDLE_TOO_LARGE": "Bundle exceeds size limit"
  }
}
```

**Rules are data, not code. Interpretation is fixed by engine implementation.**

### Engine-Profile Binding

The execution engine must:

- Implement profile rule interpretation **once**
- Apply rules deterministically
- Never reinterpret rules
- Never add discretionary logic

**Profile rules define "what to check." Engine defines "how to check."**

### Verifier-Profile Binding

The reference verifier must:

- Use the **same profile** as the engine
- Apply the **same rules** as the engine
- Produce the **same verdict** as the engine (for same inputs)

**If engine and verifier disagree, the verifier is authoritative.**

---

## 5. How Disputes About Profile Meaning Are Structurally Impossible

### Profile Semantics Are Fixed

Profile meaning is **fixed at publication time**:

- Rules are declarative (not interpretive)
- Reason codes are explicit (not inferred)
- Constraints are numeric (not qualitative)

**There is no room for "what did the profile mean?"**

### Profile Versioning Prevents Ambiguity

Each profile version is **immutable and distinct**:

- `public@1.0.0` is not `public@1.0.1`
- `public@1.0.0` is not `public@2.0.0`
- No "current" or "latest" version exists

**Version ambiguity is impossible.**

### Hash Verification Prevents Tampering

Profile integrity is verified cryptographically:

- Loaded profile must match published hash
- Any modification invalidates the hash
- Tampered profiles are rejected

**Profile tampering is detectable and rejected.**

### Execution Determinism Prevents Interpretation

Profile rules are applied deterministically:

- Same profile + same bundle → same result
- No operator discretion
- No "case-by-case" evaluation
- No interpretation logic

**Interpretation disputes are impossible because interpretation is fixed.**

### Profile Authority Is External

Profile authority does not depend on:

- VERIFRAX operator
- VERIFRAX infrastructure
- VERIFRAX documentation
- VERIFRAX interpretation

**Profiles are self-contained and independently verifiable.**

---

## Profile Lifecycle

### Publication

1. Profile JSON is created
2. Profile is canonicalized
3. Profile hash is computed
4. Profile hash is published
5. Profile file is stored
6. Profile version is frozen

**After publication, profile is immutable.**

### Execution

1. Engine loads profile by `profile_id`
2. Engine verifies profile hash
3. Engine applies profile rules
4. Engine emits verdict and reason codes

**Execution is deterministic and reproducible.**

### Verification

1. Verifier loads profile by `profile_id`
2. Verifier verifies profile hash
3. Verifier applies profile rules
4. Verifier validates certificate verdict

**Verification is independent and authoritative.**

---

## Profile Dispute Prevention

### Structural Guarantees

Disputes about profile meaning are prevented by:

1. **Immutability** — Profile cannot change after publication
2. **Versioning** — Each version is distinct and frozen
3. **Hashing** — Profile integrity is cryptographically verifiable
4. **Determinism** — Profile rules are applied deterministically
5. **Explicitness** — Profile rules are declarative, not interpretive

### No Interpretation Disputes

Profile rules are:

- Declarative (not interpretive)
- Explicit (not implicit)
- Numeric (not qualitative)
- Complete (not partial)

**There is nothing to interpret.**

### No Version Disputes

Profile versions are:

- Immutable (cannot change)
- Distinct (cannot overlap)
- Explicit (no "latest" or "current")
- Published (hashes are public)

**Version ambiguity is impossible.**

### No Authority Disputes

Profile authority is:

- Cryptographic (hash-based)
- Independent (not operator-dependent)
- Verifiable (anyone can verify)
- Permanent (survives operator disappearance)

**Authority disputes are impossible because authority is structural.**

---

## Profile Implementation Requirements

### For Execution Engines

Engines must:

- Load profiles by identifier only
- Verify profile hash before execution
- Apply profile rules deterministically
- Emit verdicts and reason codes according to profile
- Never reinterpret or modify profile rules

### For Reference Verifiers

Verifiers must:

- Load profiles by identifier only
- Verify profile hash before verification
- Apply profile rules deterministically
- Validate certificates against profile rules
- Never reinterpret or modify profile rules

### For Profile Publishers

Publishers must:

- Version profiles explicitly
- Compute and publish profile hashes
- Freeze profiles after publication
- Never modify published profiles
- Never delete published profiles

---

## Profile Examples

### Example: `public@1.0.0`

```json
{
  "profile_id": "public@1.0.0",
  "profile_name": "public",
  "version": "1.0.0",
  "verification_rules": [
    {
      "check": "bundle_non_empty",
      "failure_reason": "BUNDLE_EMPTY"
    },
    {
      "check": "bundle_size_limit",
      "max_size_bytes": 1048576,
      "failure_reason": "BUNDLE_TOO_LARGE"
    }
  ],
  "reason_code_mappings": {
    "BUNDLE_EMPTY": "Bundle file is empty",
    "BUNDLE_TOO_LARGE": "Bundle exceeds maximum size of 1MB"
  },
  "bundle_constraints": {
    "min_size_bytes": 1,
    "max_size_bytes": 1048576
  }
}
```

**Hash:** `723cb1daea3aab307d641c8521eb85792a971c60220ddfed7de0268057122280`

---

## Profile Authority Summary

### What Profiles Guarantee

- **Immutability** — Profile rules never change after publication
- **Determinism** — Same profile + same bundle → same result
- **Independence** — Profile authority does not depend on operator
- **Verifiability** — Profile integrity is cryptographically verifiable
- **Explicitness** — Profile rules are declarative and unambiguous

### What Profiles Do Not Guarantee

- Profile semantics correctness (profiles define rules, not truth)
- Profile completeness (profiles may be incomplete)
- Profile interpretation (interpretation is fixed by engine)
- Profile applicability (profiles may not apply to all bundles)

### Profile Authority Is Absolute

Once a profile is published:

- Its rules are fixed
- Its meaning is unambiguous
- Its authority is independent
- Its immutability is permanent

**No disputes are possible because there is nothing to dispute.**

---

**END OF PROFILE AUTHORITY SPECIFICATION**

