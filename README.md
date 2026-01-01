# VERIFRAX

## ⚠️ TERMINAL NOTICE

VERIFRAX v2.5.0 is the terminal and final authoritative version.
No future version may alter or supersede its authority.
See the v2.5.0 GitHub Release for canonical artifacts.

**STATUS:** FROZEN — TERMINAL  
**ROLE:** AUTHORITATIVE ENGINE  
**VERSION:** v2.5.0

---

## System Identity

VERIFRAX is a deterministic verification system that produces final, reproducible verdicts for evidence bundles. The system operates without mutable state, accounts, or sessions, ensuring that verification artifacts remain independently verifiable regardless of infrastructure availability or operational status.

---

## AUTHORITY STATEMENT

**This repository (`Verifrax/VERIFRAX`) is the authoritative source for the VERIFRAX verification engine.**

### What Is Authoritative

- **Frozen Release Artifacts:** `freeze/v2.5.0/` — Immutable v2.5.0 terminal snapshot
- **Core Engine:** `core/engine/` — Deterministic verification logic
- **Reference Verifier:** `verifrax-reference-verifier/` — Offline verification implementation
- **Frozen Specifications:** Documents in `freeze/v2.5.0/` directory
- **Terminal Freeze Commit:** `faa62cfdd249e60cce9ceb18357f6b00caf6a707`
- **Signed Tag:** `v2.5.0` (annotated, cryptographically signed)

### What Is NOT Authoritative

- **Documentation in `docs/`:** Explanatory only, may be updated
- **Examples in `examples/`:** Educational only, not conformance tests
- **Archived content:** Historical reference only
- **Product documentation:** Non-executable explanations

### Version Policy

**v2.5.0 = TERMINAL — FROZEN — IRREVERSIBLE**

**v2.5.0 is the terminal and final authoritative version.**
**All verification outcomes issued under v2.5.0 are final, immutable, and non-revocable.**

- No retroactive changes to verification logic
- No changes to certificate format
- No changes to finality semantics
- No future version may alter or supersede v2.5.0 authority
- Authority derives solely from frozen specification and cryptographic determinism

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
- **Terminal Release:** `freeze/v2.5.0/` — Immutable v2.5.0 terminal snapshot
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
