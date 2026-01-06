This document governs scope, not outcomes.

# AUTHORITATIVE SCOPE — VERIFRAX

## 1. PURPOSE

This document defines the **authoritative boundaries** of the VERIFRAX system.
It exists to eliminate ambiguity about what **does** and **does not** carry authority, determinism, legal meaning, or cryptographic weight.

Anything outside this scope is **non-authoritative by definition**.

---

## 2. CANONICAL AUTHORITY LAYER (HARD)

The following elements are **authoritative**. They define the system.

### 2.1 Computation

* Verification execution logic
* Deterministic algorithm behavior
* Profile resolution and validation
* Evidence bundle hashing
* Certificate generation

Identical inputs **must** produce identical outputs.

---

### 2.2 Cryptographic Artifacts

Authoritative artifacts include:

* `certificate.json` (canonical form)
* `certificate_hash`
* Hash-of-hash immutability proof (`.proof`)
* LLM descriptor (`.llm`)

These artifacts:

* Are language-independent
* Are presentation-independent
* Are final and immutable

---

### 2.3 Canonical Serialization

* Canonical JSON serialization
* Sorted keys
* No nulls
* No extensions
* No localization

Any deviation invalidates authority.

---

### 2.4 Versioning

* VERIFRAX version (e.g. `v2.8.0`)
* Certificate version (e.g. `1.1.0`)

Version numbers are authoritative identifiers.

---

## 3. NON-AUTHORITATIVE LAYERS (SOFT)

The following are **explicitly non-authoritative** and carry **no legal, cryptographic, or semantic weight**.

---

### 3.1 Presentation Layer

Includes:

* HTML pages
* CSS styles
* UI layout
* Typography
* Icons
* Visual branding

Presentation may change without affecting authority.

---

### 3.2 Language & Localization

* UI translations
* Language selection
* `Accept-Language` handling
* Geo-hinted language defaults

Rules:

* Language affects **text only**
* Language never affects computation
* Language never affects certificates
* English is the canonical language

Assistive translations are provided for accessibility only.

---

### 3.3 Pricing & Marketing Copy

* Price display formatting
* Descriptive text
* Landing page messaging

Pricing **authorizes execution only**, not outcomes or interpretations.

---

## 4. EXECUTION SURFACES (RESTRICTED)

Execution-related surfaces are **intentionally English-only**:

* `/verify`
* `/api/verify`
* `/certificate/*`

This prevents semantic ambiguity during execution and dispute contexts.

---

## 5. PAYMENTS & FINALITY

* One payment authorizes one execution
* Execution is irreversible
* Certificate issuance is final
* Refunds or disputes do not affect certificate validity

Payment systems have **zero authority** over certificates.

---

## 6. OPERATOR & INFRASTRUCTURE

* VERIFRAX infrastructure has no authority after issuance
* Operator failure does not invalidate certificates
* Domain loss does not invalidate certificates
* Third-party services (e.g. payment processors) are non-authoritative

---

## 7. WHAT IS EXPLICITLY NOT PROVIDED

VERIFRAX does **not** provide:

* Legal advice
* Financial advice
* Interpretation of results
* Judgments or opinions
* Outcome guarantees

Any such interpretation is external and non-authoritative.

---

## 8. CONFLICT RESOLUTION RULE

If any conflict exists between:

* UI vs certificate
* Translation vs canonical English
* Marketing text vs certificate data
* Operator statements vs cryptographic artifacts

**The cryptographic certificate always prevails.**

---

## 9. IMMUTABILITY OF THIS DOCUMENT

This document describes scope, not behavior.

* It may be revised for clarity
* Revisions do not retroactively affect certificates
* Authority remains bound to cryptographic artifacts

---

## 10. SUMMARY

VERIFRAX authority exists **only** where determinism and cryptography exist.

Everything else is a convenience layer.

This boundary is intentional, permanent, and non-negotiable.
