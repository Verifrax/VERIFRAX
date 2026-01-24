# VERIFRAX Authority Declaration

## Repository Authority

**This repository (`Verifrax/VERIFRAX`) is the authoritative source for the VERIFRAX verification engine.**

---

## Authoritative Content

### Core Engine
- **Location:** `core/engine/`
- **Status:** FROZEN at v2.4.0
- **Authority:** Deterministic verification logic
- **Freeze Commit:** `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

### Frozen Release Artifacts
- **Location:** `freeze/v2.4.0/`
- **Status:** IMMUTABLE
- **Authority:** Official v2.4.0 release snapshot
- **Contents:**
  - `REFERENCE_VERIFIER.md` — Reference verifier specification
  - `RELEASE_v2.4.0.md` — Release notes
  - `SYSTEM_SURFACE_MANIFEST.md` — System surface definition
  - `VERSION.md` — Version declaration
  - `SHA256SUMS.txt` — Canonical hashes

### Reference Verifier
- **Location:** `verifrax-reference-verifier/`
- **Status:** FROZEN at v2.4.0
- **Authority:** Offline, deterministic verification implementation
- **Binding:** Verifier wins over infrastructure

### Core Schemas and Contracts
- **Location:** `core/schemas/`, `core/contracts/`, `core/axioms/`
- **Status:** FROZEN at v2.4.0
- **Authority:** Canonical data structures and rules

---

## Non-Authoritative Content

### Documentation
- **Location:** `docs/`
- **Status:** NON-AUTHORITATIVE — EXPLANATION ONLY
- **Purpose:** Educational and explanatory material
- **Authority:** None. May be updated without versioning.

### Examples
- **Location:** `examples/`
- **Status:** NON-AUTHORITATIVE — EDUCATIONAL ONLY
- **Purpose:** Demonstration and learning
- **Authority:** None. Not conformance tests.

### Product Documentation
- **Location:** `product/`
- **Status:** NON-AUTHORITATIVE — EXPLANATION ONLY
- **Purpose:** Product context and explanations
- **Authority:** None.

### Archived Content
- **Location:** `archive/`
- **Status:** HISTORICAL REFERENCE ONLY
- **Purpose:** Historical preservation
- **Authority:** None. Not part of trusted computing base.

---

## Version Policy

**v2.4.0 = FROZEN**

- No retroactive changes to verification logic
- No changes to certificate format
- No changes to finality semantics
- No changes to reference verifier behavior
- All future changes require explicit version increments

---

## Freeze Commit

**Freeze Commit Hash:** `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

This commit represents the immutable state of v2.4.0. All authoritative content is pinned to this commit.

---

## Production Worker Authority (v2.8.0)

**Deployed:** 2026-01-24

### Source of Truth

- **Location:** `verifrax-freeze/v2.8.0/source/VERIFRAX/freeze/v2.8.0/worker.js`
- **Status:** IMMUTABLE
- **Worker Name:** `verifrax-edge`
- **Version ID:** `a8d0be87-7e81-4fa3-bc2d-659ed00df7c8`

### Binding

- Production Worker is bound to `api.verifrax.net/*`
- `wrangler.toml` references the frozen source path
- Changes require a new freeze + new version + new deployment

### Immutability Constraint

The `verifrax-freeze/v2.8.0` directory is immutable. No modifications permitted.

Any change to execution logic requires:
1. New version number (v2.8.1, v2.9.0, etc.)
2. New freeze directory
3. New wrangler deployment
4. New authority attestation

**This is not negotiable.**

---

## Authority Boundaries

### What VERIFRAX Provides

- Deterministic verification execution
- Reproducible certificate generation
- Immutable frozen artifacts
- Reference verifier correctness

### What VERIFRAX Does NOT Provide

- Profile semantics (profiles are externally interpretable)
- Documentation accuracy (docs are explanatory only)
- Example correctness (examples are educational only)
- Infrastructure availability (verification is infrastructure-independent)

---

## Related Repositories

- **VERIFRAX-SPEC:** Authoritative specifications (tagged releases only)
- **VERIFRAX-PROFILES:** Declarative profiles (non-interpreted by VERIFRAX)
- **VERIFRAX-verify:** Reference verifier (offline, deterministic)
- **VERIFRAX-DOCS:** Non-authoritative documentation
- **VERIFRAX-SAMPLES:** Non-authoritative educational examples

---

## Verification

To verify authority:
1. Check freeze commit hash matches: `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`
2. Verify frozen artifacts in `freeze/v2.4.0/`
3. Compare hashes in `SHA256SUMS.txt`
4. Use reference verifier for independent verification

