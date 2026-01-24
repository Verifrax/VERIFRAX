# VERIFRAX

## 🔒 PUBLIC AUTHORITY & FREEZE STATEMENT

**STATUS:** LIVE · PUBLIC · FORWARD-ONLY

**PUBLIC EXECUTION ENDPOINT:** [https://api.verifrax.net](https://api.verifrax.net)

VERIFRAX is a deterministic verification system producing **one execution, one certificate, final**. The system is operational, billable, and publicly frozen under an explicit authority model.

---

## VERSION & AUTHORITY MODEL (NON-NEGOTIABLE)

### AUTHORITATIVE ENGINE — **v2.7.0 (FROZEN)**

The verification *authority* of VERIFRAX is permanently anchored to the following immutable artifacts:

* `freeze/v2.6.0/` — Immutable frozen release snapshot
* `verifrax-engine/execute_v2_6_0.js` — Deterministic execution pipeline
* `verifrax-reference-verifier/src/verify_v2_6_0.js` — Offline reference verifier
* `SYSTEM_IDENTITY.*` — System identity declarations
* `BUILD_HASH.txt` — Cryptographic build attestation

These artifacts define **all authoritative behavior**. No runtime, UI, or infrastructure change can alter verification outcomes without a new explicit freeze.

See `AUTHORITATIVE_SCOPE.md` for the complete authority boundary.

---

### RUNTIME / DISCOVERY LAYER — **v2.8.0 (LIVE)**

v2.8.0 introduces **runtime, discovery, and payment-layer evolution only**. It does **not** modify verification authority.

* Runtime Version: **v2.8.0**
* Execution Surface: `api.verifrax.net`
* Payment Integration: Stripe enabled
* Tiered Pricing:

  * Public: €120
  * Pro / Legal: €650
  * Institutional: €1,500

Authority remains **anchored to v2.7.0**.

---

## EXECUTION GUARANTEE

* Each request to `api.verifrax.net` produces **exactly one final certificate**.
* Re-execution of the same evidence bundle is **not permitted**.
* Certificates are independently verifiable without reliance on VERIFRAX infrastructure.

VERIFRAX has issued live certificates relied upon externally.

---

## Genesis Certificate

The first paid production verification was executed on **2026-01-24**.

Certificate Hash:
d7c23b65887c0ef554555b231c59935f6e2717586b54a68da8dc49b0bc61731b

See: public/genesis/certificate.json

---

## PUBLIC FREEZE & GOVERNANCE

### Production Freeze

* **Freeze Version:** v2.8.0 (runtime)
* **Authority Version:** v2.7.0 (engine)
* **Freeze Tag:** `freeze-v2.8.0`
* **Deployment Date:** 2026-01-24

This repository records a **public, auditable, immutable production state**.

All future changes require:

1. A new frozen engine snapshot
2. A new authority declaration
3. A new public freeze

There is no silent mutation path.

See:

* `AUTHORITY.md`
* `BUILD_ATTESTATION.md`

---

## WHAT THIS REPOSITORY IS

* An authoritative verification engine
* A public audit surface
* A reproducible, deterministic system

## WHAT THIS REPOSITORY IS NOT

* Not a blockchain
* Not a storage service
* Not a prediction or scoring system
* Not a human review platform
* Not mutable documentation

---

## CANONICAL REFERENCES

* Specification: `verifrax.net/spec`
* Authority Scope: `AUTHORITATIVE_SCOPE.md`
* Legal Position: `LEGAL_POSITION.md`

---

## FINALITY

This repository now represents a **final, publicly frozen production system**.

**State:** Immutable

**Direction:** Forward-only

**Any deviation without a new freeze is invalid.**
