# Dependabot-safe CI checklist

Dependabot PRs branch from an older `main`. If workflows assume **current** `main` (e.g. shallow clone, missing scripts), those PRs fail with infra drift, not because the dependency bump is bad.

Use this checklist when adding or changing workflows so Dependabot (and any branch-from-main PR) stays green.

---

## 1. Checkout: use full history when you need base or parent commits

Any job that runs **on `pull_request`** and does one of the following **must** use `fetch-depth: 0` on `actions/checkout`:

- `git diff --name-only "$BASE" "$HEAD"` (or similar) where `BASE` = `github.event.pull_request.base.sha`
- `git diff --name-only HEAD~1` (or any `HEAD~n`)
- `git merge-base ...`
- `git show <base-sha>:path`

**Why:** Default checkout is shallow (e.g. `fetch-depth: 1`). The base commit of the PR is often not in the clone → `fatal: bad object <base-sha>`.

**Fix:**

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

**Workflows that already do this:** authority-boundary, governance, truth-index-integrity, verifier-reproducibility, verifrax-finality (finality-gate), finality-guard, freeze-protection, freeze-guard.

---

## 2. CI scripts: live at repo root where workflows expect them

Workflows that run `node ci/verify-*.mjs` expect those files **at the repo root** (e.g. `ci/verify-truth-index.mjs`, `ci/verify-reproducibility.mjs`).

- Do **not** reference scripts only under `freeze/` or `verifrax-freeze/` unless the workflow explicitly checks out or copies from there.
- When you add a new `ci/` script referenced by a workflow, add it at **root** `ci/` so every branch (including Dependabot’s) has it after merging base.

**Why:** Dependabot branches don’t include unreleased commits. If the script was added in a recent merge, a Dependabot branch based on older `main` won’t have it → `Cannot find module '.../ci/verify-*.mjs'`.

---

## 3. Submodules: `.gitmodules` must list a valid `url` for every submodule path

If the repo has gitlinks (submodules), `actions/checkout`’s post step runs `git submodule foreach ...`. If `.gitmodules` has a path with no `url`, that step fails with:

`fatal: No url found for submodule path '...' in .gitmodules`

Ensure every submodule path in `.gitmodules` has a valid `url` (or remove the entry if the path is no longer a submodule).

---

## 4. Optional: Dependabot labels

If you use `labels:` in `dependabot.yml`, those labels must exist in the repo (Settings → Labels). Otherwise Dependabot may warn or fail. Prefer either:

- Creating the labels in the repo, or  
- Omitting `labels:` so Dependabot doesn’t require them.

---

## Quick verification

After changing workflows or CI scripts:

1. Open a **new** Dependabot PR (or use “Update branch” on an existing one) so it rebases onto latest `main`.
2. Confirm these jobs pass (or are skipped as intended):  
   `deny-authority-mutations`, `governance-integrity`, `verify-integrity`, `reproduce`.
3. If they fail with `fatal: bad object` or `Cannot find module .../ci/...`, apply the fixes above and re-run.

---

*Last updated: 2026-01-31*
