# Primitive Execution Contract

Status: canonical execution law for the Verifrax primitive layer

Scope:
- originseal
- archicustos
- kairoclasp
- limenward
- validexor
- attestorium
- irrevocull
- guillotine

## 1. Interpreter rule

All primitives must declare one explicit shell interpreter in the shebang.

Canonical rule:
- use `#!/bin/sh` only if the script is strictly POSIX-sh compatible
- use `#!/usr/bin/env bash` only if the script intentionally requires bash features

Hard rule:
- declared interpreter and actual syntax must match
- no primitive may rely on shell features not guaranteed by its shebang

## 2. Strict mode rule

Canonical shell discipline:
- `set -eu` is the default primitive baseline
- `set -o pipefail` may be used only when the declared interpreter supports it
- if `pipefail` is required, the primitive must not declare plain POSIX `sh`

Hard rule:
- no primitive may publish a shebang/runtime combination that parses under one shell and fails under the declared shell

## 3. Repository precondition rule

If a primitive requires Git repository context, it must verify that condition explicitly before contract evaluation.

Canonical failure behavior:
- precondition failures must terminate immediately
- precondition failures must not be reported as successful contract evaluation

## 4. Input contract rule

Canonical input source:
- stdin is the contract input channel unless the primitive is intentionally argument-only

Canonical empty-input rule:
- empty stdin must be handled explicitly
- empty input must produce a deterministic failure verdict or deterministic contract rejection

Hard rule:
- no primitive may silently treat missing input as valid input

## 5. Argument contract rule

Arguments must be explicit, positional, and validated.

For primitives that require a ledger directory or other path input:
- the required argument must be checked before mutation or evaluation
- missing required arguments must terminate with a precondition failure
- invalid paths must terminate with a precondition failure

Hard rule:
- no primitive may redirect output to an empty path, implicit path, or undeclared path

## 6. Mutation boundary rule

Primitive role determines allowed side effects.

Allowed categories:
- read-only evaluation
- deterministic ledger append
- restricted termination behavior where explicitly defined

Hard rule:
- no primitive may perform undeclared mutation
- no primitive may widen its mutation surface outside its role contract

## 7. Stdout and stderr rule

Canonical channel semantics:
- stdout is for stable contract verdicts and stable machine-consumable emitted records
- stderr is for environment, precondition, or runtime diagnostics

Hard rule:
- stderr diagnostics must not be required to interpret the primitive verdict
- contract consumers must be able to determine outcome from exit code and stable stdout contract

## 8. Exit-code rule

Canonical exit-code classes:
- `0` = successful primitive contract completion
- `1` = contract rejection / denied / invalid user-supplied state
- `2` = environment, repository, argument, or runtime precondition failure

Hard rule:
- the same primitive must not use the same exit code for both contract rejection and environment failure
- irreversible primitives may define richer rule text, but not ambiguous exit-class meaning

## 9. Determinism rule

All primitive decisions must be deterministic with respect to:
- declared inputs
- declared repository state
- declared ledger state
- declared time dependency, if time is part of the primitive role

Hard rule:
- nondeterministic output is forbidden unless the primitive role explicitly includes time capture or digest capture
- where time is part of the role, the time field must be the only intended nondeterministic field

## 10. Ledger rule

Ledger-writing primitives must:
- write to one explicit ledger target
- use one deterministic record shape
- terminate safely if the ledger target is unavailable

Hard rule:
- no primitive may write partial malformed ledger records
- no primitive may append to an empty or accidental path

## 11. Verdict rule

Every primitive must emit one stable top-level verdict vocabulary for its role.

Examples of role-local verdicts:
- `SEALED`
- `CLASPED`
- `VERIFIED`
- `ATTESTED`
- `PASS`
- `EXECUTED`
- `DENIED`

Hard rule:
- verdict tokens must be intentional and stable
- verdict text must not drift between standalone and engine copies

## 12. Parity rule

The standalone primitive repository is the source of truth.

Hard rule:
- `VERIFRAX/engine` must mirror the standalone primitive exactly
- primitive repair happens in the standalone source first
- engine copies are updated only by parity propagation after standalone repair

## 13. Testability rule

Every primitive must be testable by:
- syntax validation under its declared interpreter
- positive-path smoke execution
- negative-path rejection execution
- exit-code assertion
- stdout assertion
- stderr assertion where diagnostics are expected

## 14. Current application priority

This execution contract applies immediately to Phase 6 hardening.

First forced application target:
- `originseal`, because its current source violates the argument contract and parse-safety rule

