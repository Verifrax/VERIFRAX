# Verifrax Governance (Hash-Locked Freeze)

SOURCE OF TRUTH
- TAG: engine-semantics-freeze-20251226-155121
- MANIFEST: freeze-manifests/engine-semantics-freeze-20251226-155121.MANIFEST.sha256
- RULE: Any change to core/, tools/, or sample/run-003/ requires an explicit re-freeze producing a NEW tag + NEW manifest.

ENFORCEMENT
- Local: .githooks + scripts/require-refreeze.sh
- CI: Governance + Freeze Canonical + Refreeze Required + Deny Direct Main Push

WORKFLOW
- No direct pushes to main.
- All changes via PR.
- If frozen surface must change: perform re-freeze and update TAG/MANIFEST references everywhere.
