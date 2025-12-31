# Design Constraints

## v2.4.0 Immutability Lock

**v2.4.0 behavior is immutable.**

- No retroactive changes to v2.4.0
- No reinterpretation of v2.4.0 certificates
- No changes to v2.4.0 verification logic
- No changes to v2.4.0 certificate format

## v2.5.0 Compatibility Requirement

**v2.5.0 must consume v2.4.0 certificates read-only.**

- v2.5.0 must be able to read v2.4.0 certificates
- v2.5.0 must not modify v2.4.0 certificates
- v2.5.0 must not invalidate v2.4.0 certificates
- v2.5.0 must preserve v2.4.0 certificate semantics

## Version Isolation

- v2.4.0 and v2.5.0 are separate versions
- No shared code paths
- No shared branches
- No mixed commits
- No backports from v2.5.0 to v2.4.0

## Freeze Commit

v2.4.0 freeze commit: `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

This commit is immutable. v2.5.0 design must not affect it.

