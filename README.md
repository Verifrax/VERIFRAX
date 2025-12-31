# VERIFRAX

**STATUS:** FROZEN  
**ROLE:** AUTHORITATIVE ENGINE  
**VERSION:** v2.4.0

---

## System Identity

VERIFRAX is a deterministic verification system that produces final, reproducible verdicts for evidence bundles. The system operates without mutable state, accounts, or sessions, ensuring that verification artifacts remain independently verifiable regardless of infrastructure availability or operational status.

---

## AUTHORITY STATEMENT

**This repository (`Verifrax/VERIFRAX`) is the authoritative source for the VERIFRAX verification engine.**

### What Is Authoritative

- **Frozen Release Artifacts:** `freeze/v2.4.0/` — Immutable v2.4.0 snapshot
- **Core Engine:** `core/engine/` — Deterministic verification logic
- **Reference Verifier:** `verifrax-reference-verifier/` — Offline verification implementation
- **Frozen Specifications:** Documents in `freeze/v2.4.0/` directory
- **Freeze Commit:** `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

### What Is NOT Authoritative

- **Documentation in `docs/`:** Explanatory only, may be updated
- **Examples in `examples/`:** Educational only, not conformance tests
- **Archived content:** Historical reference only
- **Product documentation:** Non-executable explanations

### Version Policy

**v2.4.0 = FROZEN**

**v2.4.0 is frozen.**
**All verification outcomes issued under v2.4.0 are final and immutable.**

- No retroactive changes to verification logic
- No changes to certificate format
- No changes to finality semantics
- All future changes require explicit version increments

---

## Canonical Links

- **Specification:** `verifrax.net/spec` (or `Verifrax/VERIFRAX-SPEC`)
- **Profiles:** `Verifrax/VERIFRAX-PROFILES`
- **Reference Verifier:** `Verifrax/VERIFRAX-verify`
- **Documentation:** `Verifrax/VERIFRAX-DOCS` (non-authoritative)
- **Samples:** `Verifrax/VERIFRAX-SAMPLES` (non-authoritative)

See `verifrax.net/spec` for authoritative specifications.

**Legal Position:** See `LEGAL_POSITION.md`

---

## Architecture

- **Worker:** `workers/verifrax-edge/` — Cloudflare Worker (R2 upload rail)
- **Core Engine:** `core/engine/` — Deterministic verification engine
- **Frozen Release:** `freeze/v2.4.0/` — Immutable v2.4.0 snapshot
- **Reference Verifier:** `verifrax-reference-verifier/` — Offline verification CLI

---

## What This Repo Is NOT

- Not a blockchain
- Not a storage service
- Not a prediction system
- Not a human review platform
- Not executable documentation (docs are explanatory only)

---

## Archived

- `archive/engines/` — Historical engines (not part of v2 trusted computing base)
- `docs/_graveyard/` — Non-authoritative documentation
