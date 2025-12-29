# VERIFRAX v2 Freeze Protocol

**Version:** 2.0.0  
**Purpose:** Immutable build and interface snapshots for each release

## What Gets Frozen

Each release freezes the following artifacts:

### Worker Configuration
- `wrangler.toml` - Cloudflare Worker configuration
- Environment bindings (R2, KV, secrets)

### Worker Source Code
- `src/index.js` - Worker implementation
- All source files required for deployment

### API Specification
- `docs/V2_EDGE_API.md` - Edge API contract
- Request/response schemas
- Status codes and error handling

### Governance Documents
- `docs/GOVERNANCE_DISPUTE_FINALITY.md` - Dispute protocol
- `docs/GOVERNANCE_VERSION_FINALITY.md` - Version guarantees
- `docs/EVIDENCE_BUNDLE_SPEC_v1.md` - Bundle specification
- `docs/PRICING_RISK_TIERS.md` - Pricing structure

### DNS Configuration
- `docs/DNS_AUDIT_v2.md` - DNS audit and decisions

## Canonical Hash Computation

### Method

1. **Create release tarball:**
   ```bash
   tar -czf release-v2.0.0.tar.gz \
     freeze/v2/releases/v2.0.0/
   ```

2. **Compute SHA-256:**
   ```bash
   shasum -a 256 release-v2.0.0.tar.gz
   ```

3. **Store in `SHA256SUMS.txt`:**
   ```
   sha256:...  release-v2.0.0.tar.gz
   ```

### Individual File Hashes

Each file in the release bundle is hashed individually:

```bash
find freeze/v2/releases/v2.0.0/ -type f -exec shasum -a 256 {} \; > SHA256SUMS.txt
```

## Release Bundle Structure

```
freeze/v2/releases/v2.0.0/
├── wrangler.toml              # Worker configuration
├── index.js                    # Worker source (copy)
├── V2_EDGE_API.md              # API specification
├── GOVERNANCE_DISPUTE_FINALITY.md
├── GOVERNANCE_VERSION_FINALITY.md
├── EVIDENCE_BUNDLE_SPEC_v1.md
├── PRICING_RISK_TIERS.md
├── DNS_AUDIT_v2.md
├── PRODUCTION_PROOF.md         # Deployment proof
└── SHA256SUMS.txt              # Canonical hashes
```

## Tagging Releases

### Git Tag Format

```
v2.0.0
```

### Tag Message

```
VERIFRAX v2.0.0: Worker-proxied R2 upload rail + governance + freeze protocol

- /api/upload endpoint with R2 storage
- Governance documents (dispute, version, bundle spec, pricing)
- Freeze protocol for immutable releases
- DNS audit framework
```

### Tagging Process

1. **Ensure clean state:**
   ```bash
   git status
   git diff
   ```

2. **Create annotated tag:**
   ```bash
   git tag -a v2.0.0 -m "VERIFRAX v2.0.0: ..."
   ```

3. **Push tag:**
   ```bash
   git push origin v2.0.0
   ```

## Freeze Discipline

### What Cannot Change After Freeze

- **Frozen artifacts:** Cannot be modified in-place
- **API contracts:** Cannot be broken without versioning
- **Governance documents:** Cannot be silently edited

### What Can Change

- **Documentation:** Can be extended (not modified)
- **New features:** Can be added (new versions)
- **Bug fixes:** Require new version (PATCH bump)

### Narrative Prevention

Freeze protocol prevents:
- **Rewriting history:** Old releases remain immutable
- **Silent changes:** All changes require version bumps
- **Contract drift:** API contracts cannot change without notice

## Release Process

### Step 1: Prepare Release Bundle

1. Create release directory: `freeze/v2/releases/v2.0.0/`
2. Copy frozen artifacts
3. Compute hashes
4. Create `SHA256SUMS.txt`

### Step 2: Create Production Proof

1. Document deployment verification
2. Include exact `curl` commands
3. Include Worker version ID
4. Store in `PRODUCTION_PROOF.md`

### Step 3: Tag and Release

1. Commit all artifacts
2. Create git tag
3. Push to repository
4. Create GitHub release (optional)

### Step 4: Publish

1. Release notes (factual, tight)
2. What shipped
3. Known limitations
4. Migration path (if any)

## Version Compatibility

### Backward Compatibility

- **v2.0.0** remains runnable after v2.1.0 release
- **v2.0.0** artifacts remain available
- **v2.0.0** API contract remains valid

### Forward Compatibility

- New versions may extend APIs
- New versions may add features
- New versions must not break v2.0.0 contracts

## References

- `freeze/v2/releases/v2.0.0/` - v2.0.0 release bundle
- `docs/V2_EDGE_API.md` - API specification
- `GOVERNANCE.md` - System governance

