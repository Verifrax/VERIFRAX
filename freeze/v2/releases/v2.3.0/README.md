# VERIFRAX Truth Index v2.3.0

## What This Is

The VERIFRAX Truth Index is a **public, append-only cryptographic proof of verification existence**.

It records that a verification occurred, without interpretation, queries, or discretion.

## What This Is NOT

- **Not a query system** - No search, filtering, or indexing logic
- **Not a database** - No mutations, updates, or deletes
- **Not an authority** - Does not decide truth, only records existence
- **Not a legal system** - No legal semantics or interpretation
- **Not mutable** - Existing entries cannot be changed

## Format

**File:** `index/truth.ndjson`

**Format:** NDJSON (one JSON object per line)

**Schema:**
```json
{
  "verdict_hash": "sha256:...",
  "bundle_hash": "sha256:...",
  "profile_id": "public@1.0.0",
  "verifier_version": "2.1.0",
  "issued_at": "ISO8601"
}
```

## Append-Only Rule

**CRITICAL:** This index is append-only.

- Existing entries MUST NOT be modified
- Existing entries MUST NOT be removed
- Only appends at end are allowed
- Line number == publication order

Any mutation invalidates trust.

## Integrity Verification

**SHA256SUMS.txt:** Contains SHA-256 hash of `truth.ndjson`

**CI Enforcement:** GitHub Action verifies:
- No existing entries modified
- No existing entries removed
- Only appends at end

## Third-Party Verification

To verify integrity:

1. Download `index/truth.ndjson`
2. Compute SHA-256 hash
3. Compare with `index/SHA256SUMS.txt`
4. Verify entries are valid JSON
5. Verify no entries were reordered

## Access Model

- **Static file** - Publicly readable
- **No API** - Direct file access only
- **No pagination** - Full file download
- **No search** - Consumers bring the hash

This avoids:
- Index authority creep
- Query semantics
- "Verdict shopping"

## Version

This index format is frozen as of v2.3.0.

Changes require:
1. New version number
2. Explicit deprecation notice
3. Migration path documented

