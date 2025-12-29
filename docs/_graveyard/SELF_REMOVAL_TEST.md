# Self-Removal Test

**Simulate: verifrax.org offline, GitHub org deleted**

## Test Scenario

1. **verifrax.org goes offline**
2. **GitHub org deleted**
3. **All infrastructure removed**

## Verification Requirements

### 1. Verdicts Still Citable

**Test**: Can verdict ID be cited without infrastructure?

**Answer**: YES
- Verdict ID format: `VFXV1:<bundle_hash>:<verdict_hash>`
- Bundle hash is self-contained
- Verdict hash is self-contained
- No external lookup required

### 2. Bundles Still Adjudicable

**Test**: Can bundle be verified without infrastructure?

**Answer**: YES
- Bundle contains all evidence
- Verifier binary is standalone
- No network required
- No external dependencies

### 3. Finality Still Holds

**Test**: Does finality depend on infrastructure?

**Answer**: NO
- Finality is in the verdict
- Verdict is in the bundle
- Bundle is self-contained
- Infrastructure is optional

## Proof

### Court Packet

`court_packet.zip` contains:
- Evidence bundle (complete)
- Verdict JSON (self-contained)
- Verifier binary (standalone)
- Hash list (verification)
- Affidavit (human-readable)

**No VERIFRAX infrastructure required.**

### External Freeze

Artifacts published to:
- Static site (independent)
- Git mirror (read-only)
- Archive store (WORM-compatible)

**Infrastructure can be removed. Finality remains.**

## Conclusion

**VERIFRAX finality is EXTERNAL and IRREVERSIBLE.**

Infrastructure is convenience, not requirement.

---

**Self-removal test: PASSED**

