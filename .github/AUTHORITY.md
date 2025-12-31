# VERIFRAX Organization Authority Policy

## Purpose

This document defines what is authoritative and non-authoritative across the Verifrax organization.

---

## Authoritative Repositories

### `Verifrax/VERIFRAX`
- **Role:** Authoritative engine implementation
- **Status:** FROZEN at v2.4.0
- **Authority:** Core verification logic, frozen release artifacts
- **Freeze Commit:** `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

### `Verifrax/VERIFRAX-SPEC`
- **Role:** Authoritative specification
- **Authority:** Only tagged releases matter
- **Status:** Specs are immutable once tagged

### `Verifrax/VERIFRAX-PROFILES`
- **Role:** Declarative profile definitions
- **Authority:** Profiles are declarative, non-interpreted by VERIFRAX
- **Status:** Compatible profile set tagged for v2.4.0

### `Verifrax/VERIFRAX-verify`
- **Role:** Reference verifier implementation
- **Authority:** Offline, deterministic verifier wins over infrastructure
- **Status:** Tagged v2.4.0

---

## Non-Authoritative Repositories

### `Verifrax/VERIFRAX-DOCS`
- **Role:** Explanatory documentation
- **Status:** NON-AUTHORITATIVE — EXPLANATION ONLY
- **Authority:** None. All files marked as non-authoritative.

### `Verifrax/VERIFRAX-SAMPLES`
- **Role:** Educational examples
- **Status:** NON-AUTHORITATIVE — EDUCATIONAL ONLY
- **Authority:** None. Fake data only, no conformance language.

---

## What Is Authoritative

1. **Frozen release artifacts** in `freeze/v2.4.0/`
2. **Tagged releases** (v2.4.0 and earlier)
3. **Core engine code** at freeze commit hash
4. **Reference verifier** at tagged version
5. **Specifications** in tagged releases

---

## What Is NOT Authoritative

1. **Documentation** (explanatory only)
2. **Examples** (educational only)
3. **Unfrozen code** (may change)
4. **Latest tags** (removed, use version tags only)
5. **Mutable branches** (only freeze commits matter)

---

## Freeze Approval

Only authorized maintainers can approve freezes. Freeze approval requires:
- Technical validation
- Hash computation
- Tag creation
- Immutability declaration

---

## Default Branch Protection

Default branches are locked:
- No direct pushes
- Require pull request reviews
- Require status checks
- Require signed commits for freezes

---

## Version Policy

**v2.4.0 = FROZEN**

- No changes to frozen artifacts
- No changes to verification logic
- No changes to certificate format
- All future changes require new version

