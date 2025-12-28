# Externalization - Strict Order (No Deviation)

## B1. Publish Canonical Hashes (WHEN ACCESS EXISTS)

Execute **exactly once per archive**:

```bash
./scripts/publish-canonical-hashes.sh CANONICAL_HASHES_v1.txt
```

### Record Required Information

For each archive, record:

1. **Static Web (Primary)**
   - URL: `https://verifrax.org/freeze/v1/CANONICAL_HASHES_v1.txt`
   - Verification: `curl -I <URL>`

2. **Git Read-Only Mirror**
   - Commit hash: `git rev-parse canonical-hashes-v1`
   - Repository: `https://github.com/verifrax/freeze-mirror`

3. **Archive-Grade (WORM)**
   - CID: `Qm...` (from IPFS)
   - Pin status: Confirmed

### Append to IMMUTABILITY_SEAL_v1.txt

Add section:

```
PUBLICATION RECORDS
-------------------

Static Web:
URL: https://verifrax.org/freeze/v1/CANONICAL_HASHES_v1.txt
Verified: [date]

Git Mirror:
Commit: [commit-hash]
Tag: canonical-hashes-v1
Repository: https://github.com/verifrax/freeze-mirror

Archive Store:
CID: [ipfs-cid]
Pin Status: Confirmed
```

## B2. External Build Attestations (WAIT STATE)

Do **not** optimize or coordinate.

Send builders **only**:

```bash
./scripts/obtain-build-attestations.sh
```

### Rules

- Different organizations
- Different OS
- Different trust domains
- Verbatim inclusion only

### No Commentary. No Synthesis.

Append attestations verbatim to `docs/EXTERNAL_BUILD_ATTESTATIONS.md`.

## B3. Reproducible Build Closure (AUTOMATED)

When binaries exist:

```bash
./scripts/replace-placeholder-hashes.sh verifrax-verifier-min
```

Immediately after:

```bash
./scripts/final-lock.sh
```

### Archive Updated Files

- Updated `IMMUTABILITY_SEAL_v1.txt`
- Updated `build.provenance.json`

---

**Execute in strict order. No deviation.**

