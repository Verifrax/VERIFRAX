# VERIFRAX Final Primitive Layer Snapshot

Freeze Phase: Protocol Freeze  
Date: 2026-03-10

This snapshot records the final verified state of the irreversible
primitive layer at freeze time.

## Included Primitive Set

Standalone sources-of-truth:

- Artifacts/originseal/originseal.sh
- Artifacts/archicustos/archicustos.sh
- Artifacts/kairoclasp/kairoclasp.sh
- Artifacts/limenward/limenward.sh
- Artifacts/validexor/validexor.sh
- Artifacts/attestorium/attestorium.sh
- Artifacts/irrevocull/irrevocull.sh
- Artifacts/guillotine/guillotine.sh

Engine mirrors:

- engine/originseal.sh
- engine/archicustos.sh
- engine/kairoclasp.sh
- engine/limenward.sh
- engine/validexor.sh
- engine/attestorium.sh
- engine/irrevocull.sh
- engine/guillotine.sh

## Verified Properties

The primitive layer satisfies:

- interpreter compatibility
- syntax correctness
- runtime contract correctness
- rejection-path correctness
- deterministic verdict behavior
- exit-code classification consistency
- ledger schema consistency
- engine ↔ standalone parity
- CI reproducibility
- fuzz boundary stability

## Freeze Result

The primitive layer is frozen as the canonical baseline for VERIFRAX.

Any modification to this layer after freeze constitutes protocol evolution
and must not be treated as routine maintenance.

