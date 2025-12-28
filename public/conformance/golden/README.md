# External Conformance Hosting

**Golden bundles published publicly for third-party verification.**

## Rule

Any third-party verifier must match byte-for-byte or be invalid.

## Golden Bundles

### Valid Bundles

- `valid/full-evidence/` - Complete evidence bundle
- Expected verdict: `VALID`
- Expected verdict.json hash: `sha256:...`

### Invalid Bundles

- `invalid/missing-sig/` - Missing signature
- `invalid/hash-mismatch/` - Hash mismatch
- Expected verdict: `INVALID`
- Expected verdict.json hash: `sha256:...`

### Inconclusive Bundles

- `inconclusive/missing-attestation-public/` - Missing attestation
- Expected verdict: `INCONCLUSIVE`
- Expected verdict.json hash: `sha256:...`

### Contradicted Bundles

- `contradicted/same-subject-opposite-assertions/` - Conflicting claims
- Expected verdict: `CONTRADICTED`
- Expected verdict.json hash: `sha256:...`

## Verification

1. Download golden bundle
2. Run your verifier
3. Compare output `verdict.json` byte-for-byte with expected
4. Any difference = invalid verifier

## Expected Verdict Files

Each golden bundle includes `verdict.json.expected` with the exact expected output.

## Status

**TODO**: Copy golden bundles from `tests/bundles/` to `public/conformance/golden/`

---

**Conformance is PUBLIC and EXTERNAL.**

