# VERIFRAX-SPEC Authority Declaration

## Repository Authority

**This repository (`Verifrax/VERIFRAX-SPEC`) contains authoritative specifications for VERIFRAX.**

---

## What Is Authoritative

- **Tagged Releases:** Only tagged releases (e.g., `v2.4.0`) are authoritative
- **Frozen Specifications:** Specifications in tagged releases are immutable
- **Freeze Commit:** `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

---

## What Is NOT Authoritative

- **Unreleased specifications:** Work in progress, not authoritative
- **Documentation:** Explanatory material only
- **Examples:** Educational only

---

## Specification Structure

Specifications define:
- Data structures (schemas, contracts)
- Algorithms (verification, hashing)
- Interfaces (APIs, formats)
- Rules (axioms, constraints)

**Specifications do NOT contain:**
- Implementation code
- Execution logic
- Narrative explanations
- Examples

---

## Version Policy

**v2.4.0 = FROZEN**

- No retroactive changes
- All future changes require new version
- Only tagged releases matter

---

## Related Repositories

- `Verifrax/VERIFRAX` — Engine implementation (authoritative)
- `Verifrax/VERIFRAX-verify` — Reference verifier (authoritative)
- `Verifrax/VERIFRAX-PROFILES` — Profile definitions (declarative)

