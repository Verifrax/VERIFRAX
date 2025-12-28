# Conformance Tests

Conformance tests ensure that any verifier implementation produces byte-identical `verdict.json` output for golden bundles.

## Golden Bundles

Golden bundles are reference bundles with known, expected verdicts:

- `tests/bundles/valid/` - Bundles that must produce VALID verdict
- `tests/bundles/invalid/` - Bundles that must produce INVALID verdict
- `tests/bundles/inconclusive/` - Bundles that must produce INCONCLUSIVE verdict
- `tests/bundles/contradicted/` - Bundles that must produce CONTRADICTED verdict

## Test Runner

The test runner (`runner/run.mjs`) verifies that:

1. All golden bundles produce expected verdicts
2. Verdict output is byte-identical across verifier implementations
3. Reason codes match expected codes
4. Bundle hashes are correctly computed

## Adding Golden Bundles

1. Create bundle in appropriate directory
2. Run verifier to generate `verdict.json`
3. Commit both bundle and expected `verdict.json`
4. Add test case to runner

## Rule

Any verifier implementation must output byte-identical `verdict.json` for golden bundles.

