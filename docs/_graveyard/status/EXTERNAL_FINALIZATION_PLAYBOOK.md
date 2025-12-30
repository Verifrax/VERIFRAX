# VERIFRAX v1 — External Finalization Playbook

**Status**: Execution-ready, awaiting external events

---

## A. CANONICAL HASH PUBLICATION (POINT OF NO RETURN)

### A1. Static Web Publication

**Command**:
```bash
./scripts/publish-canonical-hashes.sh CANONICAL_HASHES_v1.txt
```

**Manual Steps**:
```bash
scp CANONICAL_HASHES_v1.txt user@verifrax.org:/var/www/html/freeze/v1/
curl -I https://verifrax.org/freeze/v1/CANONICAL_HASHES_v1.txt
```

**Record Immediately** (append to `IMMUTABILITY_SEAL_v1.txt`):
```
STATIC WEB PUBLICATION
----------------------
URL: https://verifrax.org/freeze/v1/CANONICAL_HASHES_v1.txt
Date: [ISO8601 timestamp]
ETag: [from HTTP headers]
Retrieved Hash: sha256:[compute from retrieved file]
```

**Also append to**: `docs/EXTERNALIZATION_ORDER.md`

---

### A2. Git Read-Only Mirror

**Commands**:
```bash
git clone --mirror https://github.com/verifrax/freeze-mirror.git
cd freeze-mirror.git
cp ../CANONICAL_HASHES_v1.txt .
git add CANONICAL_HASHES_v1.txt
git commit -m "freeze: canonical hashes v1 (immutable)"
git tag canonical-hashes-v1
git push --mirror
```

**Record Immediately** (append to `IMMUTABILITY_SEAL_v1.txt`):
```
GIT MIRROR PUBLICATION
---------------------
Repository: https://github.com/verifrax/freeze-mirror
Commit Hash: [git rev-parse HEAD]
Tag: canonical-hashes-v1
Date: [ISO8601 timestamp]
```

---

### A3. Archive-Grade (WORM)

**Command**:
```bash
ipfs add --pin=true CANONICAL_HASHES_v1.txt
```

**Record Immediately** (append to `IMMUTABILITY_SEAL_v1.txt`):
```
ARCHIVE STORE PUBLICATION
------------------------
CID: Qm[returned CID]
Pin Status: Confirmed
Date: [ISO8601 timestamp]
Storage: IPFS (WORM-compatible)
```

---

## B. EXTERNAL BUILD ATTESTATIONS (NO COORDINATION)

### B1. Builder Instruction (ONLY THIS)

**Send verbatim**:
```bash
./scripts/obtain-build-attestations.sh
```

**Output to send**:
```
BUILD COMMAND (PROVIDE TO BOTH PARTIES):

git clone https://github.com/verifrax/verifrax.git
cd verifrax/verifrax-verifier-min
cargo build --release --locked
shasum -a 256 target/release/verifrax-verifier-min*

REQUIRED OUTPUT FROM EACH BUILDER:

sha256:<hash>  verifrax-verifier-min-<platform>
signed statement + date + environment
```

**Rules**:
- ❌ No context
- ❌ No framing
- ❌ No optimization
- ✅ Verbatim only

---

### B2. Acceptance Rules

**Requirements**:
- ✅ Different organizations
- ✅ Different OS
- ✅ Different trust domains
- ✅ Signed statements
- ✅ Exact binary hashes

**Reject if**:
- Same organization
- Same OS
- Same trust domain
- Unsigned statements
- Normalized hashes

---

### B3. Inclusion

**Append verbatim to**: `docs/EXTERNAL_BUILD_ATTESTATIONS.md`

**Format**:
```markdown
## Builder 1: [Organization Name]

**Organization**: [Name]
**Builder**: [Name]
**Date**: [ISO8601]
**OS**: [OS]
**Trust Domain**: [Domain]

### Build Statement

[VERBATIM STATEMENT - NO EDITS]

### Binary Hashes

- Linux: sha256:[hash]
- macOS: sha256:[hash]
- Windows: sha256:[hash]
```

**Rules**:
- ❌ No synthesis
- ❌ No commentary
- ❌ No normalization
- ✅ Verbatim only

---

## C. REPRODUCIBLE BUILD CLOSURE

### C1. When Binaries Exist (ALL Platforms)

**Command**:
```bash
./scripts/replace-placeholder-hashes.sh verifrax-verifier-min
```

**Verification**:
- All `sha256:TBD` replaced in `build.provenance.json`
- All `sha256:TBD` replaced in `IMMUTABILITY_SEAL_v1.txt`
- Hashes match external attestations

---

### C2. Immediately After

**Command**:
```bash
./scripts/final-lock.sh
```

**Record Externally** (append to `IMMUTABILITY_SEAL_v1.txt`):
```
REPRODUCIBLE BUILD CLOSURE
--------------------------
Date: [ISO8601 timestamp]
Seal Hash: sha256:[from final-lock.sh output]
Provenance Hash: sha256:[shasum build.provenance.json]
Linux Binary: sha256:[hash]
macOS Binary: sha256:[hash]
Windows Binary: sha256:[hash]
```

---

## D. PASSIVE CITATION CAPTURE (ONE TIME ONLY)

### D1. Detection Condition

**Trigger**: External document contains:
```
VFXV1:
```

**Monitoring**:
- Incident databases (read-only alerts)
- Audit repositories (read-only alerts)
- Legal memo indexes (read-only alerts)

**Rules**:
- ❌ No outreach
- ❌ No prompting
- ❌ No influence
- ✅ Passive detection only

---

### D2. Capture

**Command**:
```bash
./scripts/archive-external-citation.sh <url>
```

**Output**:
- Downloaded document (with hash)
- Wayback Machine archive URL
- Citation details

**Update**: `docs/EXTERNAL_CITATIONS.md`

---

### D3. Immediate Closure

**Command**:
```bash
./scripts/final-lock.sh
```

**This is the LAST PERMITTED MUTATION.**

**Record** (append to `IMMUTABILITY_SEAL_v1.txt`):
```
CITATION CAPTURE CLOSURE
------------------------
Date: [ISO8601 timestamp]
Citation URL: [url]
Citation Hash: sha256:[hash]
Archive URL: [wayback URL]
Final Seal Hash: sha256:[from final-lock.sh]
```

**After this**: No more mutations allowed.

---

## E. FINAL VERIFICATION CHECKLIST

Before declaring v1 complete, verify:

- [ ] Canonical hashes published to 3 independent locations
- [ ] All publication records in `IMMUTABILITY_SEAL_v1.txt`
- [ ] Two external build attestations received
- [ ] Build attestations appended verbatim to `docs/EXTERNAL_BUILD_ATTESTATIONS.md`
- [ ] Reproducible builds complete (all platforms)
- [ ] Placeholder hashes replaced
- [ ] Final lock computed after build closure
- [ ] One external citation captured (if available)
- [ ] Final lock computed after citation capture
- [ ] All records in `IMMUTABILITY_SEAL_v1.txt` complete

---

## F. EXECUTION ORDER (STRICT)

1. **A1-A3**: Publish canonical hashes (all 3 locations)
2. **B1-B3**: Obtain build attestations (wait for natural occurrence)
3. **C1-C2**: Reproducible build closure (when binaries exist)
4. **D1-D3**: Citation capture (wait for natural occurrence, ONE TIME ONLY)

**No deviation. No shortcuts. No optimization.**

---

## G. RECORDING TEMPLATE

**For `IMMUTABILITY_SEAL_v1.txt`**:

```
PUBLICATION RECORDS
-------------------

Static Web:
URL: [url]
Date: [ISO8601]
ETag: [etag]
Retrieved Hash: sha256:[hash]

Git Mirror:
Repository: [url]
Commit: [hash]
Tag: [tag]
Date: [ISO8601]

Archive Store:
CID: [cid]
Pin Status: [status]
Date: [ISO8601]

REPRODUCIBLE BUILD CLOSURE
--------------------------
Date: [ISO8601]
Seal Hash: sha256:[hash]
Provenance Hash: sha256:[hash]
Linux: sha256:[hash]
macOS: sha256:[hash]
Windows: sha256:[hash]

CITATION CAPTURE CLOSURE
------------------------
Date: [ISO8601]
Citation URL: [url]
Citation Hash: sha256:[hash]
Archive URL: [url]
Final Seal Hash: sha256:[hash]
```

---

**EXECUTION-READY. AWAITING EXTERNAL EVENTS.**

