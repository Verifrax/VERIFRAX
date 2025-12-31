# VERIFRAX-PROFILES

**STATUS:** FROZEN  
**ROLE:** DECLARATIVE PROFILES  
**VERSION:** v2.4.0

---

## Authority

This repository contains declarative profile definitions for VERIFRAX v2.4.0.

**Profiles are declarative, non-interpreted by VERIFRAX.**

---

## Profile Compatibility

Profiles tagged for `v2.4.0` are compatible with VERIFRAX v2.4.0.

---

## Profile Structure

Profiles contain:
- Profile ID (versioned, e.g., `public@1.0.0`)
- Declarative rules
- Verdict mappings
- Evidence requirements

**Profiles do NOT contain:**
- Logic
- Interpretation
- Defaults
- Execution code

---

## Freeze Commit

**Freeze Commit Hash:** `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

---

## Version Policy

**v2.4.0 = FROZEN**

- No retroactive changes to profile definitions
- All future changes require explicit version increments
- Profile IDs must be versioned

---

## See Also

- `verifrax.net/spec` — Canonical specification location
- `Verifrax/VERIFRAX` — Engine implementation
- `Verifrax/VERIFRAX-verify` — Reference verifier

