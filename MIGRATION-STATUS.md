# Migration Status

## ✅ Completed Steps

1. **Directory Structure Created**
   - Created Verifrax monorepo structure at `/Users/midiakiasat/Desktop/VERIFRAX`
   - Created directories: `core/`, `engines/`, `products/`, `verification/`, `federation/`
   - Created `.github/` directory structure

2. **CineLint Moved**
   - Successfully moved CineLint source to `engines/cinelint/`

3. **Root Documentation**
   - Created `README.md` (Verifrax umbrella)
   - Created `GOVERNANCE.md`
   - Created `SECURITY.md`

4. **Branding Renamed**
   - Python script executed to rename CineLint → Verifrax in code/docs
   - Package names updated (e.g., `cinelint` → `verifrax` in package.json)

5. **Workspace Configuration**
   - Created `pnpm-workspace.yaml` with correct paths
   - Created root `package.json` with `@verifrax/root` name
   - Fixed packageManager to `pnpm@9.0.0`

6. **Git Initialization**
   - Git repository initialized
   - Branch `main` created
   - Git configs set (ignorecase, pull.ff, fetch.prune, rerere)
   - `.gitattributes` created
   - `.gitignore` created

## ⏳ Remaining Steps

To complete the migration, run the following commands from `/Users/midiakiasat/Desktop/VERIFRAX`:

### 7. Install Dependencies
```bash
cd /Users/midiakiasat/Desktop/VERIFRAX
pnpm install
```

### 8. Run Tests/Build
```bash
pnpm -r test || true
pnpm -r lint || true
pnpm -r build || true
```

### 9. Bundle Verify (Optional)
```bash
if [ -d "engines/cinelint/sample/run-003" ]; then
  node engines/cinelint/tools/bundle.verify.mjs engines/cinelint/sample/run-003 || true
fi
```

### 10. Freeze (Optional)
```bash
bash engines/cinelint/scripts/freeze.sh || true
```

### 11. Commit Changes
```bash
git add -A
git commit -m "chore: move CineLint under Verifrax mono-repo + root workspace + hardening"
```

### 12. Create GitHub Repo
```bash
gh auth status
gh repo create Verifrax/verifrax --private --source . --remote origin --push
```

### 13. Branch Protection
```bash
gh api -X PUT "repos/Verifrax/verifrax/branches/main/protection" \
  -f required_status_checks.strict=true \
  -F enforce_admins=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -F required_pull_request_reviews.dismiss_stale_reviews=true \
  -f restrictions='null'

gh api -X PATCH "repos/Verifrax/verifrax" \
  -f delete_branch_on_merge=true \
  -f allow_squash_merge=true \
  -f allow_merge_commit=false \
  -f allow_rebase_merge=false
```

### 14. Tag and Release
```bash
git tag -a "v0.1.0" -m "Verifrax mono-repo bootstrap (CineLint as engine)"
git push --tags
gh release create "v0.1.0" --title "Verifrax v0.1.0" --notes "Bootstrap: Verifrax umbrella repo; CineLint Core moved under /engines/cinelint."
```

## Alternative: Run Completion Script

A completion script has been created at `complete-migration.sh`. You can run it with:

```bash
cd /Users/midiakiasat/Desktop/VERIFRAX
bash complete-migration.sh
```

## Notes

- The original CineLint directory has been moved (not copied) to `engines/cinelint/`
- All branding references have been renamed from CineLint to Verifrax
- The engine directory is still named `cinelint` (as intended)
- Package manager version fixed to `pnpm@9.0.0` (semver format)

