# VERIFRAX Primitive Contract Baseline

Freeze Phase: Protocol Freeze  
Date: 2026-03-10

This document records the canonical execution contract baseline
for all irreversible primitives.

## Execution Contract Guarantees

All primitives conform to the VERIFRAX Primitive Execution Contract.

Contract guarantees include:

- explicit argument validation
- deterministic evaluation
- explicit rejection semantics
- explicit environment precondition enforcement
- stable stdout verdict contracts
- deterministic ledger append behavior
- explicit exit-code classification

Exit code classes:

0 — successful primitive execution  
1 — contract rejection or denied state  
2 — environment or precondition failure

## Verified Primitive Set

The following primitives are included in the baseline:

- originseal
- archicustos
- kairoclasp
- limenward
- validexor
- attestorium
- irrevocull
- guillotine

## Engine Parity

All primitives under:

VERIFRAX/engine

are byte-identical to their standalone sources in:

Artifacts/

Parity verified via SHA256 comparison.

## Freeze Statement

The primitive execution contract is now considered **protocol-stable**.

Future changes to primitive behavior require formal protocol evolution
procedures.

