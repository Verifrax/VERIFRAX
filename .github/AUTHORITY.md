# VERIFRAX Organization Authority Policy

## Purpose

This document defines what is authoritative and non-authoritative across the Verifrax organization.

---

## Authoritative Repositories

### `Verifrax/VERIFRAX`
- **Role:** Authoritative engine implementation
- **Status:** TERMINAL — FROZEN at v2.5.0
- **Authority:** Core verification logic, terminal release artifacts
- **Terminal Freeze Commit:** `faa62cfdd249e60cce9ceb18357f6b00caf6a707`
- **Signed Tag:** `v2.5.0` (annotated, cryptographically signed)

### `Verifrax/VERIFRAX-SPEC`
- **Role:** Authoritative specification
- **Authority:** Only tagged releases matter
- **Status:** Specs are immutable once tagged

### `Verifrax/VERIFRAX-PROFILES`
- **Role:** Declarative profile definitions
- **Authority:** Profiles are declarative, non-interpreted by VERIFRAX
- **Status:** Compatible profile set tagged for v2.5.0

### `Verifrax/VERIFRAX-verify`
- **Role:** Reference verifier implementation
- **Authority:** Offline, deterministic verifier wins over infrastructure
- **Status:** Tagged v2.5.0 (compatible ONLY with VERIFRAX v2.5.0)

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

1. **Terminal release artifacts** in `freeze/v2.5.0/`
2. **Signed tagged release** (v2.5.0 — terminal, final, irreversible)
3. **Core engine code** at terminal freeze commit hash
4. **Reference verifier** at v2.5.0 tagged version
5. **Specifications** in v2.5.0 tagged releases
6. **Cryptographic signatures** on all terminal artifacts

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

**v2.5.0 = TERMINAL — FROZEN — IRREVERSIBLE**

- No changes to terminal artifacts
- No changes to verification logic
- No changes to certificate format
- No future version may alter or supersede v2.5.0 authority
- Authority derives solely from frozen specification and cryptographic determinism

