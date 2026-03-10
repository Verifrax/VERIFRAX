# VERIFRAX Primitive Verification Report

Phase: Protocol Verification  
Scope: Irreversible Primitive Layer  
Date: 2026-03-10

## Verification Coverage

The following primitives were verified:

- originseal
- archicustos
- kairoclasp
- limenward
- validexor
- attestorium
- irrevocull
- guillotine

Verification included the following validation domains:

1. Interpreter compatibility (POSIX sh, bash)
2. Syntax correctness
3. Runtime smoke execution
4. Rejection-path correctness
5. Deterministic output validation
6. Exit-code contract enforcement
7. Ledger schema validation
8. Engine ↔ standalone parity verification
9. CI reproducibility verification
10. Fuzz boundary verification

## Determinism Notes

The following environmental fields may vary but are explicitly allowed:

- attestorium: timestamp field
- attestorium: repository filesystem path

All semantic fields remain deterministic:

- commit
- tree
- digest
- primitive verdicts

## Engine Consistency

All primitives in:

VERIFRAX/engine

are byte-identical to their standalone reference implementations in:

Artifacts/

SHA256 parity verified.

## CI Verification

The following CI validations succeeded:

- Determinism checks
- Integrity checks
- Verifier reproducibility
- ClusterFuzzLite fuzz testing
- Finality guards
- Governance boundary checks

## Result

Primitive layer verification completed successfully.

The irreversible primitive layer is considered **protocol-stable**.

