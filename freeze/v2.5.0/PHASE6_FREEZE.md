# PHASE 6 — FREEZE (AUTHORITY LOCK)

**Date:** 2025-01-XX  
**Purpose:** Make v2.5.0 irreversible  
**Status:** ⚠️ **INCOMPLETE** — Freeze is a claim until tag and hashes exist

---

## Objective

Make v2.5.0 irreversible. Promote SPEC to FINAL, tag `v2.5.0`, and publish all artifacts.

---

## Actions

### 1. Promote SPEC to FINAL

**Action:** Rename `SPEC_v2.5.0_Draft_B.md` → `SPEC_v2.5.0_FINAL.md`

**Changes:**
- Update status from "DRAFT B" to "FINAL"
- Update authority from "NON-AUTHORITATIVE (Draft)" to "AUTHORITATIVE"
- Add freeze date
- Add freeze commit hash (to be filled when tag is created)

**Location:** `freeze/v2.5.0/SPEC_v2.5.0_FINAL.md`

---

### 2. Tag `v2.5.0`

**Action:** Create git tag `v2.5.0`

**Tag Message:**
```
VERIFRAX v2.5.0 — Institution-Grade Delivery

This release adds structure and clarity, not power or custody.
All authority remains documentary + cryptographic.

Features:
- Verification Classification (informational only)
- Failure Class Taxonomy (taxonomic only)
- Trust Context Bundles (TCB) support (optional, external)
- Multi-Profile Attestation (parallel, non-collapsing)

Core Invariant:
v2.5.0 adds structure and clarity, not power or custody.
All authority remains documentary + cryptographic.

Freeze Commit: <COMMIT_HASH>
Freeze Date: <DATE>
```

**Verification:**
- Tag exists: `git tag -l v2.5.0`
- Tag points to correct commit
- Tag is annotated (not lightweight)

---

### 3. Publish Artifacts

#### SPEC

- **File:** `freeze/v2.5.0/SPEC_v2.5.0_FINAL.md`
- **Hash:** Include in SHA256SUMS.txt
- **Authority:** AUTHORITATIVE

#### Reference Verifier

- **Files:**
  - `verifrax-reference-verifier/src/classification.js`
  - `verifrax-reference-verifier/src/failure_classes.js`
  - `verifrax-reference-verifier/src/tcb.js`
  - `verifrax-reference-verifier/src/multi_profile.js`
  - `verifrax-reference-verifier/src/verify_v2_5_0.js`
  - Updated `verifrax-reference-verifier/src/verify.js`
  - Updated `verifrax-reference-verifier/cli.js`
- **Hash:** Include in SHA256SUMS.txt
- **Authority:** AUTHORITATIVE

#### Test Vectors

- **File:** `freeze/v2.5.0/TEST_MATRIX.md`
- **Hash:** Include in SHA256SUMS.txt
- **Authority:** AUTHORITATIVE

#### Documentation

- **Files:**
  - `freeze/v2.5.0/PHASE0_BASELINE_REPORT.md`
  - `freeze/v2.5.0/THREAT_MODEL_v2.5.0.md`
  - `freeze/v2.5.0/PHASE3_REFERENCE_IMPLEMENTATION.md`
  - `freeze/v2.5.0/PHASE4_TESTING.md`
  - `freeze/v2.5.0/PHASE5_PLATFORM_ALIGNMENT.md`
  - `freeze/v2.5.0/STRIPE_PAYMENT_BOUNDARIES.md`
- **Hash:** Include in SHA256SUMS.txt
- **Authority:** DOCUMENTATION

---

### 4. Generate SHA256SUMS.txt (REQUIRED BEFORE FREEZE)

**Action:** Generate checksums for all v2.5.0 artifacts

**CRITICAL:** Until SHA256SUMS.txt exists and is committed, "FROZEN" is a claim, not a fact.

**Command:**
```bash
cd freeze/v2.5.0
find . -type f \( -name "*.md" -o -name "*.js" -o -name "*.json" -o -name "*.txt" \) | sort | xargs sha256sum > SHA256SUMS.txt
```

**Verification:**
- All artifacts have checksums
- Checksums are deterministic
- Checksums are verifiable
- SHA256SUMS.txt is committed to git

---

### 5. Create VERSION.md

**Action:** Create version declaration

**File:** `freeze/v2.5.0/VERSION.md`

**Content:**
```markdown
# VERIFRAX Version

Current Version: v2.5.0

Status: FROZEN

This version is final and immutable.
All future changes require a new version.

## Freeze Commit

**Freeze Commit Hash:** <COMMIT_HASH>

This commit represents the immutable state of v2.5.0. All authoritative content is pinned to this commit.
```

---

### 6. Create RELEASE_v2.5.0.md

**Action:** Create release notes

**File:** `freeze/v2.5.0/RELEASE_v2.5.0.md`

**Content:**
```markdown
# VERIFRAX v2.5.0 — Institution-Grade Delivery

This release adds structure and clarity to VERIFRAX verification, without adding power or custody.

## Core Invariant

> v2.5.0 adds *structure and clarity*, not *power or custody*.  
> All authority remains documentary + cryptographic.

## Included

- Verification Classification (informational only)
- Failure Class Taxonomy (taxonomic only)
- Trust Context Bundles (TCB) support (optional, external, revocable)
- Multi-Profile Attestation (parallel, non-collapsing)
- Reference verifier extensions (offline-only)
- Comprehensive test matrix
- Adversarial threat model
- Platform alignment documentation

## Guarantees

- Deterministic execution
- Reproducible verification
- Stateless operation
- Offline verification (reference verifier)
- v2.4.0 backward compatibility
- Zero semantic authority leakage

## Status

This release is considered stable.
All future changes require explicit version increments.

## Authority

This release is FROZEN and IMMUTABLE.
All authoritative content is in `freeze/v2.5.0/`.
```

---

## Rules

### No Force Pushes

- **Rule:** No force pushes to main branch after freeze
- **Enforcement:** Branch protection (if available)
- **Rationale:** Preserve freeze commit integrity

### No Mutable Infrastructure

- **Rule:** No mutable infrastructure changes after freeze
- **Enforcement:** Documentation only
- **Rationale:** Preserve freeze state

### No Silent Fixes

- **Rule:** No silent fixes after freeze
- **Enforcement:** All changes require new version
- **Rationale:** Preserve freeze integrity

---

## CRITICAL: Freeze Completion Checklist

**Until these are complete, "FROZEN" is a claim, not a fact:**

- ⚠️ **Tag `v2.5.0` must exist** (run: `git tag -l v2.5.0`)
- ⚠️ **SHA256SUMS.txt must exist and be committed**
- ⚠️ **Freeze commit hash must be filled in** (SPEC_v2.5.0_FINAL.md, VERSION.md)
- ⚠️ **Freeze date must be filled in** (SPEC_v2.5.0_FINAL.md)

### Required Execution Order

```bash
# 1. Ensure clean tree
git status

# 2. Generate SHA256SUMS.txt
cd freeze/v2.5.0
find . -type f \( -name "*.md" -o -name "*.js" -o -name "*.json" -o -name "*.txt" \) | sort | xargs sha256sum > SHA256SUMS.txt

# 3. Fill in freeze commit hash (will be created in step 5)
# Edit SPEC_v2.5.0_FINAL.md: replace <TO_BE_FILLED> with actual commit hash
# Edit VERSION.md: replace <TO_BE_FILLED> with actual commit hash

# 4. Commit all freeze artifacts
git add freeze/v2.5.0/
git commit -m "Freeze v2.5.0: hashes and final artifacts"

# 5. Create annotated tag (use commit hash from step 4)
git tag -a v2.5.0 -m "VERIFRAX v2.5.0 — Institution-Grade Delivery

This release adds structure and clarity, not power or custody.
All authority remains documentary + cryptographic.

Features:
- Verification Classification (informational only)
- Failure Class Taxonomy (taxonomic only)
- Trust Context Bundles (TCB) support (optional, external)
- Multi-Profile Attestation (parallel, non-collapsing)

Core Invariant:
v2.5.0 adds structure and clarity, not power or custody.
All authority remains documentary + cryptographic.

Freeze Commit: $(git rev-parse HEAD)
Freeze Date: $(date -u +%Y-%m-%d)"

# 6. Verify tag exists
git tag -l v2.5.0

# 7. Verify SHA256SUMS.txt exists
ls -la freeze/v2.5.0/SHA256SUMS.txt
```

## Exit Gate

**v2.5.0 can outlive VERIFRAX (ONLY AFTER COMPLETION):**

- ⚠️ SPEC promoted to FINAL (status updated, but freeze hash must be filled)
- ⚠️ Tag `v2.5.0` created (REQUIRED - run git tag command above)
- ⚠️ All artifacts published (REQUIRED - commit all files)
- ⚠️ SHA256SUMS.txt generated and committed (REQUIRED - run sha256sum command above)
- ⚠️ VERSION.md created (freeze hash must be filled)
- ⚠️ RELEASE_v2.5.0.md created
- ✅ No force pushes allowed (documented)
- ✅ No mutable infrastructure (documented)
- ✅ No silent fixes (documented)

**Status:** ⚠️ **INCOMPLETE** — Freeze completion required before release

---

## Next Phase

Proceed to **PHASE 7 — RELEASE** to release without obligation.

