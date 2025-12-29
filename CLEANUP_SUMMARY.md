# VERIFRAX v2 Hard Clean Summary

**Date:** 2025-12-29  
**Pre-clean Snapshot:** Tagged as `pre-v2-clean`  
**Status:** Ready for final commit

## Completed Phases

### ✅ Phase 0: Snapshot
- Created file list snapshot: `/tmp/verifrax-filelist-preclean.txt` (820 files)
- Tagged pre-clean state: `pre-v2-clean`

### ✅ Phase 1: Declare Authoritative Surfaces
- Identified authoritative documents (6)
- Identified execution paths (worker + core engine)
- Identified freeze artifacts

### ✅ Phase 2: Archive CineLint
- Moved `engines/cinelint/` → `archive/engines/cinelint/`
- Created `archive/engines/README.md` with trust boundary notice
- **Result:** CineLint no longer in active execution path

### ✅ Phase 3: Prune Documentation
- Moved 30+ non-authoritative docs → `docs/_graveyard/`
- Kept only 6 authoritative docs:
  - `V2_EDGE_API.md`
  - `DNS_AUDIT_v2.md`
  - `GOVERNANCE_DISPUTE_FINALITY.md`
  - `GOVERNANCE_VERSION_FINALITY.md`
  - `EVIDENCE_BUNDLE_SPEC_v1.md`
  - `PRICING_RISK_TIERS.md`
- Created `docs/_graveyard/README.md` with explanation

### ✅ Phase 4: Core Engine Sanity Check
- Verified core engine is used by verification reference
- **Decision:** Kept (needed for future `/api/verify` endpoint)

### ✅ Phase 5: Script Pruning
- **Kept:** `scripts/test-upload.sh` (v2 integration test)
- **To Remove:** All other scripts (15+ files)
  - Note: Git operations blocked in sandbox - manual removal required

### ✅ Phase 6: Freeze Discipline
- Created `freeze/v2/releases/v2.0.0/IMMUTABLE.txt`
- **Note:** `chmod -R a-w` blocked in sandbox - manual enforcement required

### ✅ Phase 7: README Update
- Replaced v1 README with v2-focused README
- Clear trust boundary statement
- Lists authoritative docs only

### ✅ Phase 8: Link Hard Check
- **Manual verification required:**
  ```bash
  curl -I https://verifrax.net/
  curl -I https://verifrax.net/api/upload
  curl -I https://verifrax.net/spec
  curl -I https://verifrax.net/glossary
  ```

## Manual Steps Required

Due to sandbox restrictions, the following must be completed manually:

### 1. Remove Unused Scripts

```bash
cd /Users/midiakiasat/Desktop/VERIFRAX
git rm scripts/add-cloudflare-route.mjs \
        scripts/add-cloudflare-route.sh \
        scripts/archive-external-citation.sh \
        scripts/check-link-consistency.sh \
        scripts/console.sh \
        scripts/create-court-packet.sh \
        scripts/demo.sh \
        scripts/final-commit-and-tag.sh \
        scripts/final-lock.sh \
        scripts/obtain-build-attestations.sh \
        scripts/publish-canonical-hashes.sh \
        scripts/publish.index.mjs \
        scripts/replace-placeholder-hashes.sh \
        scripts/seed.claim.mjs \
        scripts/verifrax \
        scripts/CLOUDFLARE_ROUTES.md
```

**Keep only:** `scripts/test-upload.sh`

### 2. Enforce Freeze Immutability

```bash
chmod -R a-w freeze/v2/releases/v2.0.0
```

### 3. Final Commit

```bash
git add -A
git commit -m "VERIFRAX v2 hard clean: archive legacy, prune docs, enforce freeze discipline

- Archived CineLint engine (not used in v2 execution)
- Pruned 30+ non-authoritative docs to _graveyard
- Removed unused scripts (kept only test-upload.sh)
- Updated README with v2 focus and trust boundary
- Added IMMUTABLE.txt to freeze directory
- Reduced repo from 820 files to ~163 active files"

git push
```

## End State Metrics

**Before:** 820 files  
**After:** ~163 active files (excluding archive and graveyard)  
**Reduction:** ~80% reduction in active surface area

## Trust Boundary

**Authoritative (v2):**
- `workers/verifrax-edge/` - Execution
- `core/` - Verification engine
- `freeze/v2/releases/v2.0.0/` - Frozen release
- 6 authoritative docs in `docs/`
- `scripts/test-upload.sh` - Integration test

**Archived (not trusted):**
- `archive/engines/cinelint/` - Historical engine
- `docs/_graveyard/` - Non-authoritative docs

## Verification Checklist

- [x] Pre-clean snapshot created
- [x] CineLint archived
- [x] Docs pruned to 6 authoritative
- [x] README updated
- [x] Freeze discipline markers added
- [ ] Scripts removed (manual)
- [ ] Freeze directory made immutable (manual)
- [ ] Final commit pushed (manual)
- [ ] Link verification (manual)

## Rollback

If needed, rollback to pre-clean state:

```bash
git checkout pre-v2-clean
```

