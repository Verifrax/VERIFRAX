# VERIFRAX Primitive Tag and Package Version Alignment

This document freezes the canonical alignment rule between git tags and npm package versions for the Verifrax primitive layer.

This rule is normative for:

- standalone primitive repositories
- npm package publication
- git tags
- release notes
- README release references
- VERIFRAX engine parity references where version identity is shown

## Canonical alignment rule

For every public primitive release, the canonical git tag and the canonical npm package version must match exactly.

## Rules

1. The public release tag must represent the exact published package version.
2. The package version in package.json must equal the release tag version exactly.
3. README release references must not contradict the canonical released version.
4. Release notes must reference the same exact version identity.
5. Engine parity references must not advertise a conflicting version for the same primitive release line.
6. A package must not be published from a state that does not correspond to the intended release tag identity.
7. A tag must not be created for a version that is not the exact package version being released.
8. Mistyped tags, malformed tags, or drifted historical tags do not define canonical release identity.
9. For the initial unified primitive release line, the exact canonical public identity is:
   - tag: v0.1.0
   - package version: 0.1.0
10. Future releases must preserve the same exact alignment rule.

## Constraint

No primitive repository, package manifest, git tag, release note, README, or public surface may contradict this tag and package version alignment rule.
