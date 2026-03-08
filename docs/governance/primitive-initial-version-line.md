# VERIFRAX Primitive Initial Version Line

This document freezes the canonical initial version line for the Verifrax primitive packaging program.

This rule is normative for:

- standalone primitive repositories
- npm package manifests
- README install surfaces
- release notes
- git tags
- VERIFRAX engine parity references

## Canonical initial release line

The initial public version line for all eight unified primitive packages is:

- 0.1.0

## Rules

1. The first public unified package release for each primitive must start at 0.1.0.
2. No primitive may start at 1.0.0.
3. Internal preparation states may use 0.0.x only before the first public unified release is cut.
4. Once a primitive is prepared for first public release, its package manifest, README, git tag, and release note must align on 0.1.0.
5. The same initial release line must be used consistently across:
   - repository release identity
   - npm package identity
   - binary release identity
   - engine parity references where version is shown
6. No primitive may invent a different initial public line unless governance is updated explicitly.

## Constraint

No primitive repository, package manifest, README, tag, release note, or public surface may contradict this initial version line.
