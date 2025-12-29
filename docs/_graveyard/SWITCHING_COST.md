# Switching Cost Enforcement

**Any export must include axiom_hashes and verifier_build_hash.**

## Required Export Fields

All verdict exports must include:

1. **axiom_hashes** (array of sha256 hashes)
   - References to all axioms used in verification
   - Enables reproducibility
   - Prevents version drift

2. **verifier_build_hash** (sha256 hash)
   - Hash of verifier build used
   - Enables build verification
   - Prevents implementation drift

## Impact

Consumers who leave VERIFRAX lose:
- Comparability with other verdicts
- Reproducibility guarantees
- Axiom reference chain
- Build verification

## Enforcement

- API responses include both fields
- CLI exports include both fields
- Affidavit exports include both fields
- Adapter outputs include both fields

## Rationale

Switching cost creates dependency.  
Dependency creates finality.

---

**No export without axiom_hashes and verifier_build_hash.**

