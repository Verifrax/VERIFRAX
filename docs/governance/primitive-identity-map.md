# VERIFRAX Primitive Identity Map

This document freezes the canonical primitive identity map for the Verifrax primitive layer.

This mapping is normative for:

- repository identity
- README identity
- package identity
- binary identity
- engine identity
- ordering identity
- cross-reference identity
- future release identity

Canonical identity map:

| Primitive ID | Canonical Name | Repository | npm Package | Binary |
| --- | --- | --- | --- | --- |
| PRIM-001 | originseal | originseal | @verifrax/originseal | originseal |
| PRIM-002 | archicustos | archicustos | @verifrax/archicustos | archicustos |
| PRIM-003 | kairoclasp | kairoclasp | @verifrax/kairoclasp | kairoclasp |
| PRIM-004 | limenward | limenward | @verifrax/limenward | limenward |
| PRIM-005 | validexor | validexor | @verifrax/validexor | validexor |
| PRIM-006 | attestorium | attestorium | @verifrax/attestorium | attestorium |
| PRIM-007 | irrevocull | irrevocull | @verifrax/irrevocull | irrevocull |
| PRIM-008 | guillotine | guillotine | @verifrax/guillotine | guillotine |

Identity rules:

1. Primitive IDs are permanent and must not be renumbered.
2. Canonical names are lowercase and must not drift across public surfaces.
3. Repository names, package names, and binary names must map to the canonical primitive named above.
4. README titles, badges, headers, and descriptive surfaces must use the same primitive identity.
5. VERIFRAX engine copies must preserve the same primitive ID and name as the standalone primitive repositories.
6. No duplicate primitive ID may exist anywhere in the Verifrax primitive layer.
7. No primitive may claim another primitive ID, name, or package slot.
8. If a primitive evolves internally, its identity remains fixed unless a new primitive is intentionally created.
9. Future cross-links and release notes must reference both canonical name and canonical primitive ID when identity precision matters.

Constraint:

No repository, package, README, engine copy, release note, tag, or public surface may contradict this identity map.
