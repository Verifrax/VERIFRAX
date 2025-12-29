# Hard External Freeze - Non-Repo Locations

**Artifacts published to at least 3 independent locations:**

## Location 1: Static Site (verifrax.org)

**URL**: `https://verifrax.org/freeze/v1/`

**Artifacts**:
- `VERDICT_REFERENCE_v1.md`
- `axioms/` (all JSON files)
- `contracts/` (all JSON files)
- `schemas/` (all JSON files)
- `golden/` (all golden bundles)

## Location 2: Public Git Mirror (Read-Only)

**Repository**: `github.com/verifrax/freeze-mirror` (read-only)

**Tag**: `finality-law-v1-freeze`

**Artifacts**: Complete snapshot of frozen files

## Location 3: Archive-Grade Store (WORM-Compatible)

**Location**: IPFS / Arweave / Permaweb

**CID/Hash**: `Qm...` (to be generated)

**Artifacts**: Immutable archive of all frozen artifacts

## Exact Artifacts

1. `VERDICT_REFERENCE_v1.md`
2. `core/axioms/*.json` (all axiom files)
3. `core/contracts/*.json` (all contract files)
4. `core/schemas/*.json` (all schema files)
5. `verification/conformance-tests/golden/*` (all golden bundles)

## Verification

Each location must provide:
- SHA-256 hashes of all artifacts
- Signature of artifact manifest
- Timestamp of publication

## Status

**TODO**: Publish to actual external locations (requires deployment)

---

**These artifacts are IMMUTABLE and EXTERNAL.**

