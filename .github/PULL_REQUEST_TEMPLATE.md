# Pull Request Contract

This repository enforces **determinism, finality, and accountability**.

A pull request is not a proposal.
It is a **claim** that an invariant is preserved.

Incomplete or misaligned PRs may be closed without comment.

---

## Invariant Preserved (Required)

State exactly which invariant(s) this change preserves:

- [ ] Determinism
- [ ] Binary outcomes (PASS / FAIL only)
- [ ] Forward-only execution
- [ ] No configuration flags
- [ ] No interactive behavior
- [ ] Stable failure codes

Explain briefly how the invariant is preserved.

---

## Behavioral Change Summary (Required)

Describe **what changes in observable behavior**, not implementation details.

- What behavior existed before?
- What behavior exists after?
- Why is this change necessary?

Narrative, intent, or motivation is insufficient.

---

## Tests (Required)

Describe the tests that prove this change:

- [ ] Test(s) fail before the change
- [ ] Test(s) pass after the change
- [ ] Tests are deterministic and repeatable

Link to or reference the exact test files.

---

## Failure Codes (Required)

List any failure codes affected by this change:

- Existing codes modified:
- New codes introduced (must be stable and documented):
- Codes removed (strong justification required):

If no codes are affected, state **“None”** explicitly.

---

## Determinism Impact (Required)

Answer one:

- [ ] This change does not affect determinism
- [ ] This change strengthens determinism
- [ ] This change risks determinism (explain — high scrutiny)

Any risk to determinism may result in rejection.

---

## Rejection Acknowledgement

By submitting this PR, you acknowledge that it may be rejected for any of the following reasons:

- introduces flexibility or exceptions
- adds warn-only or advisory behavior
- adds per-rule toggles or configuration
- relies on non-deterministic inputs
- weakens enforcement semantics
- increases ambiguity at decision boundaries

Forking is always permitted.
Merging is not guaranteed.

---

## Final Assertion

I assert that this pull request:

- preserves CICULLIS’s enforcement guarantees
- introduces no ambiguity
- can be audited in isolation
- does not rely on maintainer interpretation

