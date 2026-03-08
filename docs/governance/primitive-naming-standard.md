# VERIFRAX Primitive Naming Standard

This document freezes the canonical naming standard for the Verifrax primitive layer.

This naming standard is normative for:

- repository names
- npm package names
- binary names
- script filenames
- README titles
- documentation references
- release notes
- engine copies
- future public surfaces

## Canonical naming rule

For every Verifrax primitive, the canonical lowercase primitive name is the root naming token.

That same canonical lowercase primitive name must be reused consistently across all public and internal surfaces unless a surface requires a formally defined prefix or suffix.

## Canonical mappings

| Primitive ID | Canonical Name | Repository | npm Package | Binary | Script Filename | README Title |
| --- | --- | --- | --- | --- | --- | --- |
| PRIM-001 | originseal | originseal | @verifrax/originseal | originseal | originseal.sh | ORIGINSEAL |
| PRIM-002 | archicustos | archicustos | @verifrax/archicustos | archicustos | archicustos.sh | ARCHICUSTOS |
| PRIM-003 | kairoclasp | kairoclasp | @verifrax/kairoclasp | kairoclasp | kairoclasp.sh | KAIROCLASP |
| PRIM-004 | limenward | limenward | @verifrax/limenward | limenward | limenward.sh | LIMENWARD |
| PRIM-005 | validexor | validexor | @verifrax/validexor | validexor | validexor.sh | VALIDEXOR |
| PRIM-006 | attestorium | attestorium | @verifrax/attestorium | attestorium | attestorium.sh | ATTESTORIUM |
| PRIM-007 | irrevocull | irrevocull | @verifrax/irrevocull | irrevocull | irrevocull.sh | IRREVOCULL |
| PRIM-008 | guillotine | guillotine | @verifrax/guillotine | guillotine | guillotine.sh | GUILLOTINE |

## Naming rules

1. Repository names must equal the canonical lowercase primitive name.
2. npm package names must equal `@verifrax/<canonical-name>`.
3. Binary names must equal the canonical lowercase primitive name.
4. Shell script filenames must equal `<canonical-name>.sh`.
5. README primary titles must use the canonical uppercase primitive name.
6. Primitive IDs must stay attached to the same canonical name everywhere.
7. No aliases may replace the canonical name on public release surfaces.
8. Descriptive prose may expand the primitive role, but must not rename the primitive.
9. `VERIFRAX/engine` copies must use the same canonical name and script filename as the standalone primitive repository.
10. Cross-links, package metadata, and release notes must resolve to the same canonical name without variation.

## Constraint

No repository, package, binary, script file, README, engine copy, release note, tag, or public surface may contradict this naming standard.
