# VERIFRAX Primitive Version Policy

This document freezes the canonical version policy for the Verifrax primitive layer.

This version policy is normative for:

- standalone primitive repositories
- npm packages
- binary release references
- README install surfaces
- release notes
- git tags
- VERIFRAX engine copies
- future public release channels

## Current policy status

All Verifrax primitives in the current unification and packaging program are pre-stable.

They must therefore use the `0.x.y` version line until the primitive contract is fully unified, published, verified, and intentionally declared stable.

## Canonical version rule

1. No primitive in this program may claim `1.0.0` yet.
2. The primitive layer must start on an honest `0.x.y` line.
3. Standalone primitive repositories and their matching npm packages must use the same semantic version.
4. VERIFRAX engine copies of the same primitives must use the same version line as the standalone primitive repositories.
5. A primitive may move to `1.0.0` only after:
   - public surfaces are unified,
   - package surfaces are unified,
   - naming is frozen,
   - README structure is frozen,
   - engine parity is complete,
   - release discipline is frozen,
   - and stability is explicitly declared.
6. Pre-stable breaking changes remain allowed inside the `0.x.y` line, but must still be documented with precision.
7. No public release note, README, script header, package manifest, or engine copy may advertise a version that contradicts the canonical line.

## Canonical initial line

The canonical initial release line for this program is:

- `0.1.0` for first unified public primitive releases

If operationally necessary before first public publish, internal alignment may use `0.0.x` during preparation, but no surface may drift from the chosen canonical line once frozen for release.

## Constraint

No repository, package, binary, script header, README, engine copy, tag, release note, or public surface may contradict this version policy.
