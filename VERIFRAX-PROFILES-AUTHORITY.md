# VERIFRAX-PROFILES Authority Declaration

## Repository Authority

**This repository (`Verifrax/VERIFRAX-PROFILES`) contains declarative profile definitions.**

---

## What Profiles Are

- **Declarative:** Profiles declare rules, not logic
- **Non-interpreted:** VERIFRAX does not interpret profile semantics
- **Versioned:** Profile IDs include version (e.g., `public@1.0.0`)

---

## What Profiles Are NOT

- **Not logic:** Profiles contain no executable code
- **Not interpreted:** VERIFRAX executes against profile ID, not profile meaning
- **Not defaults:** Profiles declare requirements, not defaults

---

## Profile Authority

VERIFRAX guarantees:
- Execution against specified profile ID
- Deterministic results for same bundle and profile ID
- Profile ID inclusion in certificate

VERIFRAX does NOT guarantee:
- Profile semantics correctness
- Profile completeness
- Profile interpretation

---

## Profile Structure Requirements

Profiles must:
- Have versioned profile ID (`name@version`)
- Contain only declarative data (JSON)
- Have no executable code
- Have no interpretation logic

---

## Version Policy

**v2.4.0 = FROZEN**

- No retroactive changes to profile definitions
- All future changes require explicit version increments
- Profile IDs must be versioned

---

## Related Repositories

- `Verifrax/VERIFRAX` — Engine implementation (authoritative)
- `Verifrax/VERIFRAX-SPEC` — Specifications (authoritative)
- `Verifrax/VERIFRAX-verify` — Reference verifier (authoritative)

