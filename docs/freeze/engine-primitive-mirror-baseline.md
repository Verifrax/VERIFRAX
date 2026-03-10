# VERIFRAX Engine Primitive Mirror Baseline

Freeze Phase: Protocol Freeze  
Date: 2026-03-10

This document freezes the engine primitive mirror baseline.

## Scope

The following engine primitives are included:

- engine/originseal.sh
- engine/archicustos.sh
- engine/kairoclasp.sh
- engine/limenward.sh
- engine/validexor.sh
- engine/attestorium.sh
- engine/irrevocull.sh
- engine/guillotine.sh

## Mirror Guarantee

Each engine primitive is an exact mirror of its standalone source-of-truth
under the corresponding primitive repository.

Mirror guarantee properties:

- identical logic
- identical stdout contract
- identical rejection behavior
- identical exit-code semantics
- identical ledger behavior where applicable

## Verification Basis

Mirror parity was verified by:

- byte-for-byte comparison
- SHA256 equality
- syntax validation
- runtime contract verification

## Freeze Statement

The VERIFRAX engine primitive mirror is now considered **baseline-frozen**.

Any future divergence between engine and standalone primitives is prohibited
unless introduced through formal protocol evolution procedures.

