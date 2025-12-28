# Truth Index as Memory

**Append-only. Never deleted. Signed snapshots.**

## Index Files

Published append-only:

- `index/claims.ndjson` - All claims (one per line)
- `index/bundles.ndjson` - All bundles (one per line)
- `index/invalidations.ndjson` - All invalidations (one per line)
- `index/edges.ndjson` - Claim ↔ evidence ↔ invalidation relationships

## Snapshot Policy

- **Frequency**: Weekly snapshots
- **Format**: Signed manifest + compressed archive
- **Retention**: All snapshots retained (never deleted)
- **Location**: `index/snapshots/YYYY-MM-DD/`

## Snapshot Structure

```
index/snapshots/2024-12-28/
├── claims.ndjson
├── bundles.ndjson
├── invalidations.ndjson
├── edges.ndjson
├── manifest.json
└── manifest.json.sig
```

## Manifest Format

```json
{
  "snapshot_date": "2024-12-28",
  "claims_count": 1234,
  "bundles_count": 567,
  "invalidations_count": 89,
  "hashes": {
    "claims": "sha256:...",
    "bundles": "sha256:...",
    "invalidations": "sha256:...",
    "edges": "sha256:..."
  },
  "signature": {
    "algorithm": "Ed25519",
    "value": "...",
    "key_id": "verifrax-snapshot-key"
  }
}
```

## Memory Guarantee

- Old snapshots never deleted
- Historical state always recoverable
- Narrative rollback prevented by reference
- Truth index is memory, not UI

## Rationale

Memory prevents narrative rollback.  
Append-only prevents deletion.  
Signed snapshots prevent tampering.

---

**Truth index is memory. Memory is permanent.**

