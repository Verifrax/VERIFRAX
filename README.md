# VERIFRAX

## ⚠️ AUTHORITATIVE VERSION

VERIFRAX v2.8.0 is the sole authoritative version.

Authority is defined exclusively by:
- freeze/v2.6.0/
- verifrax-engine/execute_v2_6_0.js
- verifrax-reference-verifier/src/verify_v2_6_0.js
- SYSTEM_IDENTITY.*
- BUILD_HASH.txt

No other document, tag, or release defines authority.

---

## System Identity

VERIFRAX is a deterministic verification system that produces final, reproducible verdicts for evidence bundles. The system operates without mutable state, accounts, or sessions, ensuring that verification artifacts remain independently verifiable regardless of infrastructure availability or operational status.

---

## AUTHORITY STATEMENT

**This repository (`Verifrax/VERIFRAX`) is the authoritative source for the VERIFRAX verification engine.**

### What Is Authoritative

- **Frozen Release Artifacts:** `freeze/v2.6.0/` — Immutable v2.6.0 snapshot
- **Execution Engine:** `verifrax-engine/execute_v2_6_0.js` — Deterministic execution pipeline
- **Reference Verifier:** `verifrax-reference-verifier/src/verify_v2_6_0.js` — Offline verification implementation
- **Frozen Specifications:** Documents in `freeze/v2.6.0/` directory
- **System Identity:** `SYSTEM_IDENTITY.*` — Version and identity declarations
- **Build Hash:** `BUILD_HASH.txt` — Cryptographic build attestation

See `AUTHORITATIVE_SCOPE.md` for complete authority definition.

### What Is NOT Authoritative

- **Documentation in `docs/`:** Explanatory only, may be updated
- **Archived content:** Historical reference only
- **Product documentation:** Non-executable explanations

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
- **Frozen Release:** `freeze/v2.6.0/` — Immutable v2.6.0 snapshot
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

