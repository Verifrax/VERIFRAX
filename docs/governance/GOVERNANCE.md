# Governance

This repository is governed as an immutable, verification-first system.

## Principles

- **No direct pushes to `main`.** All changes land via Pull Request.
- **Linear history.** `main` contains no merge commits; changes land via squash-merge (or equivalent) only.
- **Signed changes.** Commits merged into `main` must have **verified signatures**.
- **Tags are sealed.** All tags are immutable once pushed (no update / no delete).
- **Least privilege CI.** GitHub Actions is restricted to an allowlist.

## Enforcement Surface

These rules are enforced by GitHub configuration (branch/tag rulesets and required checks), not convention.
Any exception requires an explicit temporary ruleset/branch-protection change and immediate rollback.

## Decision Authority

Repository trust anchors on the maintainer’s signing key. Published key material is the verification root for tags and local verification workflows.

- Primary signing identity: `CICULLIS signing authority`
- Public key: `security/keys/midia-kiasat_cicullis_signing.pub.asc`
- Fingerprint: `C473 C626 EFAF 03E7 657C 3ACF 94A6 3174 8AB2 DD2C`

## Change Process

1. Create a branch from `main`.
2. Open a Pull Request with:
   - clear intent
   - minimal scope
   - passing required checks
3. Merge by squash after required policy gates are satisfied.

## Release Process

- Releases are cut from `main`.
- Release tags are annotated and signed (`git tag -s`).
- Release tags use the `vMAJOR.MINOR.PATCH*` naming convention and must be annotated + signed.
- Once pushed, **tags must never be replaced**.

## Policy Exceptions

No bypass actors are configured for protected tags.
Any temporary policy relaxation must be:
- explicitly time-bounded
- documented in the PR description
- reverted immediately after use
