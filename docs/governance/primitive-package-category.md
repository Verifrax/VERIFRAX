# VERIFRAX Primitive Package Category

This document freezes the canonical package category rule for the Verifrax primitive layer.

This package category rule is normative for:

- standalone primitive repositories
- npm package manifests
- installation surfaces
- README usage surfaces
- binary exposure
- release notes
- verification procedures
- VERIFRAX engine parity

## Canonical package category

All eight Verifrax primitives in this program are classified as CLI-first packages.

They are not classified as general-purpose JavaScript libraries.

They are not classified as hybrid library and CLI packages unless that is explicitly introduced later by a new approved contract.

## Canonical implications

1. The primary public runtime surface is the executable command.
2. npm packaging exists to distribute the primitive command cleanly and consistently.
3. The canonical install surface must prioritize command installation and command usage.
4. Package manifests must expose a binary entry through the `bin` field.
5. README structures must describe invocation, input behavior, output behavior, exit behavior, and operational constraints.
6. Public package descriptions must describe the primitive as a command-oriented primitive, not as an abstract library.
7. No package may imply a stable programmatic JavaScript API unless one is intentionally designed, documented, and versioned separately.
8. Shell script runtime assets are part of the canonical package surface for this primitive layer.
9. Validation for release must include command execution verification, not only manifest validation.
10. VERIFRAX engine copies must preserve the same command identity and command behavior as the standalone primitive packages.

## Constraint

No repository, package manifest, README, release note, engine copy, or public surface may contradict this CLI-first package category rule.
