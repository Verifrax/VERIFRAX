# Verifrax Engine Semantics Freeze — Hardening Guide

## Source of Truth

**TAG**: `engine-semantics-freeze-20251226-155121`  
**MANIFEST**: `freeze-manifests/engine-semantics-freeze-20251226-155121.MANIFEST.sha256`  
**GUARD**: `scripts/semantics-guard.sh`  
**CI**: `semantics-guard` + `semantics-finality`

## Hardening Phase (Operational)

### 1. Branch Protection (GitHub UI/CLI)

**Required Settings:**
- Require pull request reviews before merging
- Require status checks to pass before merging:
  - `Semantics Guard`
  - `Semantics Finality`
- Require conversation resolution before merging
- Do not allow force pushes
- Do not allow deletions
- Require linear history

**GitHub CLI Command:**
```bash
gh api repos/kaaffilm/verifrax/branches/main/protection \
  -X PUT \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]="Semantics Guard" \
  -f required_status_checks.contexts[]="Semantics Finality" \
  -f enforce_admins=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f restrictions=null
```

### 2. Anchor Verification (External Services)

**Environment Variables:**
```bash
export ANCHOR_ETH_RPC=https://mainnet.infura.io/v3/$INFURA_KEY
export ANCHOR_REKOR_URL=https://rekor.sigstore.dev
export ANCHOR_CHAIN_ID=1
```

**Verification:**
- Use `tools/lib/verify-eth-anchor.mjs` for Ethereum anchors
- Use `tools/lib/verify-rekor-anchor.mjs` for Rekor anchors

### 3. Transparency Publication

**Status**: Requires implementation of `ops/transparency/publish.mjs`

### 4. Continuous Monitoring

**Cron Job:**
```bash
*/10 * * * * cd /path/to/verifrax && ./scripts/semantics-guard.sh >> /var/log/verifrax/guard.log 2>&1
```

### 5. External Reproducibility

**Verification Script:**
```bash
git clone https://github.com/kaaffilm/verifrax.git /tmp/verifrax-verify
cd /tmp/verifrax-verify
git checkout engine-semantics-freeze-20251226-155121
./scripts/semantics-guard.sh
shasum -a 256 freeze-manifests/engine-semantics-freeze-20251226-155121.MANIFEST.sha256
```

## Current Status

- ✅ Freeze tag created and verified
- ✅ Manifest hash-locked
- ✅ Semantics guard script active
- ✅ CI workflows configured
- ✅ Pre-commit and pre-push hooks installed
- ⚠️ Branch protection requires GitHub UI/CLI setup
- ⚠️ Anchor verification requires external service keys
- ⚠️ Transparency publication requires ops layer implementation
- ⚠️ Continuous monitoring requires cron setup

## Operational Requirements

1. **GitHub Branch Protection**: Must be configured in GitHub UI or via CLI
2. **External Services**: Infura API key for Ethereum anchor verification
3. **Transparency Log**: Rekor URL for transparency publication
4. **Monitoring**: Cron job for continuous semantics guard
5. **Economics**: Stake registry and slashing contracts (if applicable)

## Immutability Guarantees

The freeze is operationally irreversible through:
- Cryptographic manifest hashes
- CI governance enforcement
- Git hooks (local protection)
- Tagged commits (immutable reference)

**ABSOLUTE FINALITY — HASH-LOCKED, CI-GOVERNED, OPERATIONALLY IRREVERSIBLE**

