# VERIFRAX v2.4.0 — Public Explainer

**Status:** FROZEN — VERIFRAX v2.4.0 is immutable

---

## What VERIFRAX Is

VERIFRAX is a **deterministic verification system** that produces final, reproducible verdicts for evidence bundles. The system operates without mutable state, accounts, or sessions, ensuring that verification artifacts remain independently verifiable regardless of infrastructure availability or operational status.

**VERIFRAX v2.4.0 is frozen.** All verification outcomes issued under v2.4.0 are final and immutable.

---

## What VERIFRAX Does

1. **Accepts evidence bundles** (binary format)
2. **Executes deterministic verification** (pure function, no side effects)
3. **Produces certificates** (self-contained, independently verifiable)
4. **Delivers final verdicts** (verified or not_verified)

**VERIFRAX does not:**
- Store mutable state
- Require accounts or sessions
- Depend on infrastructure availability
- Produce non-deterministic outcomes

---

## What VERIFRAX Guarantees

- **Deterministic execution:** Same inputs → same outputs, always
- **Reproducible verification:** Certificates can be verified offline
- **Stateless operation:** No server-side state required
- **Infrastructure independence:** Certificates survive infrastructure deletion
- **Finality:** v2.4.0 outcomes are immutable

---

## What Is Public

These repositories exist to **prove determinism**, not to operate the system:

1. **VERIFRAX** (`Verifrax/VERIFRAX`)
   - Authoritative verification engine
   - Frozen release artifacts
   - Reference verifier source
   - **Does not contain:** Execution infrastructure, payment processing, storage logic

2. **VERIFRAX-verify** (`Verifrax/VERIFRAX-verify`)
   - Offline reference verifier
   - Enables independent certificate verification
   - **Does not require:** VERIFRAX infrastructure, Cloudflare, Stripe, or network access

3. **VERIFRAX-SPEC** (`Verifrax/VERIFRAX-SPEC`)
   - Frozen specification documents
   - Certificate format definitions
   - **Does not contain:** Runtime code, private keys, infrastructure references

4. **VERIFRAX-PROFILES** (`Verifrax/VERIFRAX-PROFILES`)
   - Declarative profile definitions
   - Verification rule schemas
   - **Does not contain:** Interpretation logic, execution code

---

## What Is Private

These repositories contain execution infrastructure and must remain private:

1. **verifrax-edge** (`Verifrax/verifrax-edge`)
   - Cloudflare Worker execution code
   - Stripe payment integration
   - R2 storage logic
   - **Never public:** Exposes attack surface and violates finality

2. **verifrax-infra** (`Verifrax/verifrax-infra`, if exists)
   - Infrastructure configuration
   - Deployment scripts
   - **Never public:** Exposes operational details

---

## How Verification Works

1. **Upload evidence bundle** → VERIFRAX computes hash
2. **Execute verification** → Deterministic algorithm produces verdict
3. **Generate certificate** → Self-contained artifact with hash chain
4. **Verify certificate** → Use reference verifier offline (no VERIFRAX required)

**Certificates are independently verifiable.** They do not require VERIFRAX infrastructure, Cloudflare, Stripe, or network access to verify.

---

## Authority and Finality

**This repository (`Verifrax/VERIFRAX`) is the authoritative source for the VERIFRAX verification engine.**

**Freeze commit:** `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

**Version policy:** v2.4.0 is frozen. No retroactive changes to verification logic, certificate format, or finality semantics. All future changes require explicit version increments.

---

## Legal Position

VERIFRAX operates as a deterministic verification system. Certificates are self-contained artifacts that can be verified independently. VERIFRAX does not provide legal advice, warranties, or guarantees beyond the deterministic execution of its verification algorithm.

See `LEGAL_POSITION.md` for detailed legal framework.

---

## Independence

**VERIFRAX may disappear.** Verification artifacts do not.

Certificates verified by VERIFRAX v2.4.0 remain valid even if:
- VERIFRAX service is offline
- VERIFRAX domain is gone
- VERIFRAX company ceases operations
- All VERIFRAX infrastructure is destroyed

**Nothing depends on:**
- Servers
- People
- Company
- Domain
- Payment processor

---

## For Auditors, Lawyers, and Regulators

**What VERIFRAX provides:**
- Deterministic verification execution
- Reproducible certificate generation
- Immutable frozen artifacts
- Reference verifier correctness

**What VERIFRAX does not provide:**
- Profile semantics (profiles are externally interpretable)
- Documentation accuracy (docs are explanatory only)
- Example correctness (examples are educational only)
- Infrastructure availability (verification is infrastructure-independent)

**How to verify:**
1. Check freeze commit hash: `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`
2. Verify frozen artifacts in `freeze/v2.4.0/`
3. Compare hashes in `SHA256SUMS.txt`
4. Use reference verifier for independent verification

---

## Canonical Links

- **Specification:** `verifrax.net/spec` (or `Verifrax/VERIFRAX-SPEC`)
- **Profiles:** `Verifrax/VERIFRAX-PROFILES`
- **Reference Verifier:** `Verifrax/VERIFRAX-verify`
- **Documentation:** `Verifrax/VERIFRAX-DOCS` (non-authoritative)

---

**This document is frozen as of VERIFRAX v2.4.0. No updates without explicit version increment.**

