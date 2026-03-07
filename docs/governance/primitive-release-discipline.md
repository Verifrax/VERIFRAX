# VERIFRAX Primitive Release Discipline

This document freezes the canonical release branch and tag discipline for the Verifrax primitive layer.

This discipline is normative for:

- standalone primitive repositories
- npm package releases
- release tags
- release notes
- pull request flow
- VERIFRAX engine synchronization

## Canonical branch discipline

1. Direct commits to `main` are not part of the primitive release path.
2. Work is prepared on a working branch.
3. For VERIFRAX governance and coordination work, the working branch is `midiakiasat`.
4. Changes are reviewed through pull requests before merge.
5. Merge to `main` is the only release-eligible integration point.

## Canonical tag discipline

1. Tags must be created only from the release-integrated state that is intended to represent the public version.
2. Tags must not be created from arbitrary local states.
3. Lightweight ad hoc tags are not part of the canonical release model.
4. Canonical release tags must represent exact public release identity.
5. A tag must not be created before the corresponding primitive package surface is validated.
6. A tag must not be created before README, package metadata, and version metadata agree.
7. If engine parity is required for that release line, the tag must follow parity completion.

## Canonical release flow

1. prepare changes on the working branch
2. validate changes
3. open pull request
4. merge reviewed changes to main
5. create canonical release tag from the integrated release state
6. publish package from the same canonical release identity
7. verify public package surface
8. synchronize and validate engine parity where required

## Constraint

No primitive repository, tag, release note, package publish event, or public surface may contradict this release discipline.
