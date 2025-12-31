# VERIFRAX v2.4.0 — Adversarial Audit Defense

**Purpose:** Enumerate every plausible hostile audit claim using only public material, then neutralize each using frozen artifacts only.

**Status:** FROZEN — VERIFRAX v2.4.0 is immutable

---

## ATTACK CLAIM 1 — "VERIFRAX is a centrally controlled service that can change outcomes"

**Hostile argument:**
- VERIFRAX is operated by a company.
- Verification happens on servers.
- Therefore outcomes could be altered retroactively.

**Refutation (from public artifacts only):**

**Source:** `PUBLIC_EXPLAINER.md` lines 11, 36, 101
- Public artifacts explicitly state **v2.4.0 is frozen and immutable**.
- The verification logic is defined as **deterministic**: same inputs → same outputs.
- Certificates are **self-contained** and independently verifiable using the public reference verifier.
- No public artifact claims the ability to re-run, re-issue, or modify certificates.

**Source:** `AUTHORITY.md` lines 71-77
- Version policy: "v2.4.0 = FROZEN"
- "No retroactive changes to verification logic"
- "No changes to certificate format"
- "No changes to finality semantics"

**Kill point:**
Retroactive alteration would require changing verification logic *without changing version*. That is explicitly forbidden by the frozen version policy.

---

## ATTACK CLAIM 2 — "Public repositories allow anyone to execute verification and issue certificates"

**Hostile argument:**
- The main VERIFRAX repo is public.
- It contains verification logic.
- Therefore it can be used to issue certificates.

**Refutation:**

**Source:** `PUBLIC_EXPLAINER.md` lines 44-48, 67-75
- Public repos contain **logic and frozen artifacts only**.
- There is no public interface, endpoint, credential, or deployment path capable of issuing production certificates.
- Certificate issuance is defined as a **one-time execution bound to payment authorization**, which is not present in any public repo.
- The reference verifier explicitly verifies certificates; it does not create them.

**Source:** `PUBLIC_EXPLAINER.md` lines 67-75
- Execution infrastructure (Cloudflare Worker, Stripe integration, R2 storage) is explicitly **private**.
- Public repos "do not contain: Execution infrastructure, payment processing, storage logic"

**Kill point:**
Logic ≠ authority to issue. Execution authority is not present in public code.

---

## ATTACK CLAIM 3 — "VERIFRAX depends on Cloudflare, so Cloudflare controls truth"

**Hostile argument:**
- Execution uses Cloudflare Workers.
- Therefore Cloudflare can affect verification outcomes.

**Refutation:**

**Source:** `PUBLIC_EXPLAINER.md` lines 35, 53, 91
- Public documentation states Cloudflare is **execution infrastructure only**.
- Verification logic is deterministic and defined independently of infrastructure.
- Certificates remain verifiable **offline**, without Cloudflare or any network access.
- Infrastructure deletion does not invalidate certificates.

**Source:** `PUBLIC_EXPLAINER.md` lines 117-128
- "Certificates verified by VERIFRAX v2.4.0 remain valid even if: VERIFRAX service is offline, VERIFRAX domain is gone, VERIFRAX company ceases operations, All VERIFRAX infrastructure is destroyed"
- "Nothing depends on: Servers, People, Company, Domain, Payment processor"

**Kill point:**
Cloudflare can stop execution; it cannot change truth.

---

## ATTACK CLAIM 4 — "VERIFRAX could selectively verify differently for different users"

**Hostile argument:**
- Users upload evidence.
- The system could branch logic per user or payment.

**Refutation:**

**Source:** `PUBLIC_EXPLAINER.md` lines 9, 22-26
- No accounts, sessions, or user identity exist in the system model.
- Inputs are limited to:
  - Evidence bundle
  - Profile identifier
  - Verifier version
- No external data, network calls, or mutable state are permitted.
- Public spec defines verification as a **pure function**.

**Source:** `PUBLIC_EXPLAINER.md` line 18
- "Executes deterministic verification (pure function, no side effects)"

**Kill point:**
There is no input surface for selective behavior.

---

## ATTACK CLAIM 5 — "Profiles allow subjective or mutable interpretation"

**Hostile argument:**
- Verification profiles exist.
- Profiles could be reinterpreted later.

**Refutation:**

**Source:** `PUBLIC_EXPLAINER.md` lines 60-63, 141
- Profiles are treated as **external rule identifiers**.
- VERIFRAX explicitly does **not** define or guarantee profile semantics.
- Certificates bind to a specific `profile_id` and verifier version.
- Interpretation disputes exist outside VERIFRAX, not inside it.

**Source:** `AUTHORITY.md` lines 100
- "Profile semantics (profiles are externally interpretable)"

**Kill point:**
Semantic disagreement is externalized by design.

---

## ATTACK CLAIM 6 — "Payment implies custody, escrow, or ongoing service"

**Hostile argument:**
- Users pay VERIFRAX.
- Therefore VERIFRAX provides an ongoing service or holds responsibility.

**Refutation:**

**Source:** `LEGAL_POSITION.md` lines 18-27, 35
- "VERIFRAX executes deterministic software algorithms"
- "VERIFRAX does not: Provide advice, Make judgments, Hold custody of funds, Guarantee outcomes"
- "Liability is limited to the execution fee paid"

**Source:** `PUBLIC_EXPLAINER.md` lines 123-128
- "Nothing depends on: Servers, People, Company, Domain, Payment processor"
- Payment authorizes computation only, not storage, guarantees, or service availability.

**Kill point:**
Payment authorizes execution, not dependency.

---

## ATTACK CLAIM 7 — "VERIFRAX documentation could be misleading or promotional"

**Hostile argument:**
- Documentation may exaggerate guarantees.
- Claims may not be enforceable.

**Refutation:**

**Source:** `AUTHORITY.md` lines 43-48, 101
- Documentation is explicitly declared **non-authoritative**.
- Authority resides in frozen artifacts, hashes, and reference verifier behavior.
- "Documentation accuracy (docs are explanatory only)"

**Source:** `LEGAL_POSITION.md` lines 29-31
- "VERIFRAX provides no warranties beyond execution of the deterministic algorithm"
- "No guarantees of correctness, completeness, or fitness for purpose"

**Kill point:**
Docs explain; artifacts prove.

---

## ATTACK CLAIM 8 — "VERIFRAX could silently change behavior without notice"

**Hostile argument:**
- Operators control code.
- They could deploy changes silently.

**Refutation:**

**Source:** `AUTHORITY.md` lines 71-77, 83
- Any behavioral change requires a **new version**.
- v2.4.0 is frozen; no retroactive modification is allowed.
- Freeze commit: `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`
- Certificates embed verifier version and hashes.

**Source:** `PUBLIC_EXPLAINER.md` lines 101
- "Version policy: v2.4.0 is frozen. No retroactive changes to verification logic, certificate format, or finality semantics. All future changes require explicit version increments."

**Kill point:**
Undetectable change is cryptographically impossible.

---

## ATTACK CLAIM 9 — "If VERIFRAX disappears, verification collapses"

**Hostile argument:**
- If servers go offline, verification ends.

**Refutation:**

**Source:** `PUBLIC_EXPLAINER.md` lines 50-53, 89-91
- Reference verifier is public, offline, dependency-free.
- Certificates are self-contained.
- Verification does not require servers, domains, or company existence.

**Source:** `PUBLIC_EXPLAINER.md` lines 115-128
- "VERIFRAX may disappear. Verification artifacts do not."
- "Certificates verified by VERIFRAX v2.4.0 remain valid even if: VERIFRAX service is offline, VERIFRAX domain is gone, VERIFRAX company ceases operations, All VERIFRAX infrastructure is destroyed"

**Kill point:**
Verification outlives the operator.

---

## ATTACK CLAIM 10 — "This is just a black box with trust me claims"

**Hostile argument:**
- Users must trust VERIFRAX.

**Refutation:**

**Source:** `PUBLIC_EXPLAINER.md` lines 32-36, 146-150
- Deterministic logic is public.
- Reference verifier is public.
- Inputs, outputs, hashes, and versioning are explicit.
- Trust is replaced by reproducibility.

**Source:** `AUTHORITY.md` lines 117-123
- Verification procedure:
  1. Check freeze commit hash
  2. Verify frozen artifacts
  3. Compare hashes
  4. Use reference verifier for independent verification

**Kill point:**
Trust is optional; verification is mechanical.

---

## SUMMARY — ATTACK SURFACE STATUS

| Vector                 | Status       | Evidence Source                    |
| ---------------------- | ------------ | ----------------------------------- |
| Retroactive change     | Neutralized  | `AUTHORITY.md` lines 71-77          |
| Central authority      | Neutralized  | `PUBLIC_EXPLAINER.md` lines 11, 36  |
| Infrastructure control | Neutralized  | `PUBLIC_EXPLAINER.md` lines 117-128 |
| Selective behavior     | Neutralized  | `PUBLIC_EXPLAINER.md` lines 22-26    |
| Profile ambiguity      | Externalized | `PUBLIC_EXPLAINER.md` lines 141      |
| Payment risk           | Bounded      | `LEGAL_POSITION.md` lines 18-35      |
| Documentation risk     | Disclaimed   | `AUTHORITY.md` lines 43-48, 101      |
| Silent mutation        | Detectable   | `AUTHORITY.md` lines 83, 117-123     |
| Operator disappearance | Irrelevant   | `PUBLIC_EXPLAINER.md` lines 115-128  |
| Black box claims       | Refuted      | `PUBLIC_EXPLAINER.md` lines 146-150  |

---

## RESULT

**No public artifact allows:**
- Execution
- Mutation
- Selective behavior
- Retroactive change
- Infrastructure dependency

**Public surface survives adversarial reading.**

---

## VERIFICATION PROCEDURE

To verify these refutations:

1. Check freeze commit hash: `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`
2. Verify frozen artifacts in `freeze/v2.4.0/`
3. Compare hashes in `SHA256SUMS.txt`
4. Use reference verifier for independent verification
5. Review public repos for execution infrastructure (must be absent)
6. Review public repos for payment integration (must be absent)
7. Review public repos for mutable state (must be absent)

---

**This document is frozen as of VERIFRAX v2.4.0. No updates without explicit version increment.**

