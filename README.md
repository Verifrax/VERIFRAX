# VERIFRAX

## ⚠️ VERSION MODEL

**AUTHORITATIVE ENGINE:** v2.7.0 (FROZEN)

Authority is defined exclusively by:
- freeze/v2.6.0/
- verifrax-engine/execute_v2_6_0.js
- verifrax-reference-verifier/src/verify_v2_6_0.js
- SYSTEM_IDENTITY.*
- BUILD_HASH.txt

**RUNTIME / DISCOVERY LAYER:** v2.8.0

v2.8.0 introduces discovery, runtime, and payment-layer evolution.
Authority remains anchored to v2.7.0 frozen engine artifacts.

---

## System Identity

VERIFRAX is a deterministic verification system that produces final, reproducible verdicts for evidence bundles. The system operates without mutable state, accounts, or sessions, ensuring that verification artifacts remain independently verifiable regardless of infrastructure availability or operational status.

---

## AUTHORITY STATEMENT

**This repository (`Verifrax/VERIFRAX`) is the authoritative source for the VERIFRAX verification engine.**

### What Is Authoritative

- **Authoritative Engine Version:** v2.7.0 (FROZEN)
- **Frozen Release Artifacts:** `freeze/v2.6.0/` — Immutable v2.6.0 snapshot
- **Execution Engine:** `verifrax-engine/execute_v2_6_0.js` — Deterministic execution pipeline
- **Reference Verifier:** `verifrax-reference-verifier/src/verify_v2_6_0.js` — Offline verification implementation
- **Frozen Specifications:** Documents in `freeze/v2.6.0/` directory
- **System Identity:** `SYSTEM_IDENTITY.*` — Version and identity declarations
- **Build Hash:** `BUILD_HASH.txt` — Cryptographic build attestation

See `AUTHORITATIVE_SCOPE.md` for complete authority definition.

### Runtime / Discovery Layer

- **Runtime Version:** v2.8.0
- **Payment Integration:** Stripe checkout enabled
- **Discovery Endpoints:** Machine-routable certificate access
- **Tiered Pricing:** Public (€120), Pro (€650), Institutional (€1,500)

v2.8.0 does not change authority. Authority remains at v2.7.0.

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

