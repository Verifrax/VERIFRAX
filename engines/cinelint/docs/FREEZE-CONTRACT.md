# Freeze Contract (Non-Negotiable)

FROZEN DIRS:
- core/
- tools/
- sample/run-003/

RULE:
Any change to a FROZEN DIR requires an explicit re-freeze that produces:
1) a new freeze tag
2) a new freeze manifest
3) a passing CI run proving no drift

SOURCE OF TRUTH:
TAG      = engine-semantics-freeze-20251226-155121
MANIFEST = freeze-manifests/engine-semantics-freeze-20251226-155121.MANIFEST.sha256
GUARD    = scripts/semantics-guard.sh
CI       = Semantics Guard + Semantics Finality + Re-freeze Required If Frozen Dirs Touched
