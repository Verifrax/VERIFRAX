# Invariants

These properties are guaranteed by CICULLIS and must never be violated.

## Execution invariants

1. **Determinism**: Same input → same output, always
2. **Binary verdict**: PASS or FAIL only, no intermediate states
3. **No state mutation**: Execution does not modify inputs or environment
4. **Idempotence**: Running twice produces identical results

## Output invariants

1. **Exit code contract**: 0 = pass, non-zero = specific failure
2. **Stdout exactness**: Output format is frozen
3. **No side effects**: No files created, no network calls, no logs beyond stdout

## Policy invariants

1. **Profile immutability**: Loaded profile cannot change during execution
2. **Rule determinism**: Same rule + same input = same verdict
3. **Failure specificity**: Each failure has exactly one reason code

## Verification invariants

1. **Offline verifiable**: No network required to verify results
2. **Self-contained**: All information needed is in output
3. **Hash-addressable**: Output can be uniquely identified by hash

