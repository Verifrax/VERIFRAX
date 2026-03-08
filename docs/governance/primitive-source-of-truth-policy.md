# VERIFRAX Primitive Source of Truth Policy

This document freezes the canonical source-of-truth policy for the Verifrax primitive layer.

This policy is normative for:

- standalone primitive repositories
- VERIFRAX engine copies
- public release surfaces
- npm package publication
- README alignment
- version alignment
- future synchronization work

## Canonical authority rule

For each primitive in the Verifrax primitive layer, the standalone primitive repository is the canonical source of truth.

The matching copy inside VERIFRAX engine is a synchronized mirror of that canonical primitive, not an independent authority line.

## Canonical implications

1. Primitive logic must be authored and stabilized in the standalone primitive repository first.
2. Public identity for each primitive is owned first by the standalone primitive repository.
3. README meaning, package identity, version identity, and behavioral contract originate from the standalone primitive repository.
4. VERIFRAX engine copies must inherit the same primitive identity, same primitive order, same version line, and same contract surface.
5. VERIFRAX engine must not silently diverge from the standalone primitive repositories.
6. If divergence is discovered, the standalone primitive repository remains authoritative unless governance explicitly declares a replacement authority model.
7. Engine synchronization is required after canonical primitive changes that affect identity, contract, version, or public behavior.
8. A primitive is not considered aligned until its standalone repository and engine mirror agree at the contract level.
9. No README, package, script header, release note, or public description may imply that VERIFRAX engine is the primary authority for a primitive while this policy is in force.

## Operational rule

The correct upgrade order is:

1. freeze primitive contract
2. update standalone primitive repository
3. validate standalone primitive repository
4. publish standalone primitive package
5. synchronize VERIFRAX engine copy
6. validate parity

## Constraint

No repository, package manifest, README, engine copy, release note, tag, or public surface may contradict this source-of-truth policy.
