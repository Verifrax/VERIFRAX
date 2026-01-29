## EX-001 — Bootstrap: Runtime CI Non-Blocking on Governance-Only PRs / Missing Artifacts

**Purpose**
Prevent governance deadlocks while the runtime artifact surface is not yet fully present in-repo.

**Scope**
Applies only to PR checks for:
- Truth Index Integrity
- Verifier Reproducibility
- Verifrax Finality

**Rule**
If a pull request does not touch runtime surfaces, or runtime surfaces are touched but required artifacts are absent, the above checks MUST exit successfully (non-blocking).

**Retirement Conditions (EX-001 MUST be removed when ALL are true)**
1. `BUILD_HASH.txt` exists on `main` and is regenerated deterministically by CI.
2. `index/truth.ndjson` exists on `main` and is updated only by the release pipeline.
3. `fixtures/bundles/minimal-valid/*` exists on `main` and is sufficient to run reproducibility in CI.
4. Release pipeline produces and publishes an evidence bundle, and `seed-claim` succeeds on `main` without manual inputs.

**Retirement Procedure**
- Remove EX-001 gates from runtime workflows.
- Replace with strict required checks on PR for runtime surfaces.
- Tag the first commit after removal as `governance-baseline-post-ex001-<date>`.

**Audit**
EX-001 is allowed only while the retirement conditions are not satisfied.
