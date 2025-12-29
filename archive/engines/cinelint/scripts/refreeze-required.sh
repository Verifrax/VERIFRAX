
set -euo pipefail

TAG="engine-semantics-freeze-20251226-155121"


# if commit touches frozen dirs, require a new manifest file staged in same commit
if git diff --cached --name-only | grep -E '^(core|tools|sample/run-003)/' >/dev/null; then
  git diff --cached --name-only | grep -E '^freeze-manifests/engine-semantics-freeze-.*\.MANIFEST\.sha256$' >/dev/null || {
    echo "BLOCKED: frozen dirs touched; re-freeze required (new tag + new manifest)."
    exit 1
  }
fi

# always verify baseline freeze is intact before allowing any commit
./scripts/semantics-guard.sh
