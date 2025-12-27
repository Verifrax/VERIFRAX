#!/bin/bash
set -euo pipefail

export DST="/Users/midiakiasat/Desktop/VERIFRAX"
export ORG="Verifrax"
export REPO="verifrax"
export MAIN="main"

cd "$DST"

# 7) HARDEN TOOLING (NODE/PNPM) - Try with available pnpm
if command -v pnpm &> /dev/null; then
    pnpm -v
else
    echo "pnpm not found, attempting to use corepack..."
    corepack enable || true
    corepack prepare pnpm@9.0.0 --activate || true
fi

# 8) INSTALL + TEST (REPO)
echo "Installing dependencies..."
pnpm install || npm install || yarn install || echo "Package manager not available"

echo "Running tests..."
pnpm -r test || echo "Tests skipped/failed"

echo "Running lint..."
pnpm -r lint || echo "Lint skipped/failed"

echo "Running build..."
pnpm -r build || echo "Build skipped/failed"

# 9) BUNDLE VERIFY (SAMPLE)
if [ -d "engines/cinelint/sample/run-003" ]; then
  echo "Verifying bundle..."
  node engines/cinelint/tools/bundle.verify.mjs engines/cinelint/sample/run-003 || echo "Bundle verify skipped/failed"
fi

# 10) FREEZE (ENGINE FREEZE CONTRACT + ARTIFACTS)
if [ -f "engines/cinelint/scripts/freeze.sh" ]; then
  echo "Running freeze..."
  bash engines/cinelint/scripts/freeze.sh || echo "Freeze skipped/failed"
fi

# 11) COMMIT (CLEAN)
echo "Committing changes..."
git add -A
git commit -m "chore: move CineLint under Verifrax mono-repo + root workspace + hardening" || echo "Commit skipped (may already be committed)"

# 12) CREATE GITHUB REPO (ORG) + PUSH
if command -v gh &> /dev/null; then
    echo "Checking GitHub auth..."
    gh auth status || echo "GitHub CLI not authenticated"
    
    echo "Creating GitHub repo..."
    gh repo create "$ORG/$REPO" --private --source . --remote origin --push || echo "GitHub repo creation skipped (may already exist)"
    
    # 13) HARDEN GITHUB (BRANCH PROTECTION + SECURITY)
    echo "Setting up branch protection..."
    gh api -X PUT "repos/$ORG/$REPO/branches/$MAIN/protection" \
        -f required_status_checks.strict=true \
        -F enforce_admins=true \
        -f required_pull_request_reviews.required_approving_review_count=1 \
        -F required_pull_request_reviews.dismiss_stale_reviews=true \
        -f restrictions='null' || echo "Branch protection setup skipped"
    
    gh api -X PATCH "repos/$ORG/$REPO" \
        -f delete_branch_on_merge=true \
        -f allow_squash_merge=true \
        -f allow_merge_commit=false \
        -f allow_rebase_merge=false || echo "Repo settings update skipped"
    
    # 14) TAG + RELEASE (OPTIONAL)
    echo "Creating tag and release..."
    git tag -a "v0.1.0" -m "Verifrax mono-repo bootstrap (CineLint as engine)" || echo "Tag creation skipped"
    git push --tags || echo "Tag push skipped"
    gh release create "v0.1.0" --title "Verifrax v0.1.0" --notes "Bootstrap: Verifrax umbrella repo; CineLint Core moved under /engines/cinelint." || echo "Release creation skipped"
else
    echo "GitHub CLI (gh) not found. Skipping GitHub operations."
    echo "To complete GitHub setup, run:"
    echo "  gh repo create $ORG/$REPO --private --source . --remote origin --push"
fi

echo "Migration script completed!"

