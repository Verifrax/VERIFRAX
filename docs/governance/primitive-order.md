# VERIFRAX Primitive Order

This document freezes the canonical primitive order for the Verifrax primitive layer.

The order is normative for:

- repository alignment
- README alignment
- package naming alignment
- npm publication order
- engine parity
- cross-references between primitives

Canonical primitive order:

1. originseal
2. archicustos
3. kairoclasp
4. limenward
5. validexor
6. attestorium
7. irrevocull
8. guillotine

Semantic order rationale:

1. `originseal` establishes first existence and genesis anchoring.
2. `archicustos` establishes custody after origin exists.
3. `kairoclasp` binds time after identity and custody surfaces are clear.
4. `limenward` enforces state-transition boundary discipline after origin, custody, and time exist.
5. `validexor` evaluates verifiability only after claims are bounded.
6. `attestorium` records witnessing and attestation only after verifiability and context exist.
7. `irrevocull` performs irreversible judgment only after verification and witnessing are possible.
8. `guillotine` performs terminal invalidation only after the rest of the primitive system exists.

Constraint:

No repository, package, README, engine copy, release note, or public surface may contradict this order.
