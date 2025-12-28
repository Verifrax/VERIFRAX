# Public Truth Index (CLEAR)

The truth index maintains an immutable, publicly accessible record of all claims, bundles, invalidations, and their relationships.

## Index Files

All index files use NDJSON (newline-delimited JSON) format for streaming and append-only operations.

### claims.ndjson

One claim per line. Each line is a JSON object representing a claim.

```json
{"claim_id":"uuid","claim_type":"media-finality","subject":{"identifier":"...","type":"artifact"},"issued_at":"ISO8601",...}
```

### bundles.ndjson

One bundle per line. Each line contains bundle metadata and hash.

```json
{"bundle_hash":"sha256:...","bundle_id":"uuid","created_at":"ISO8601","profile_id":"public@1.0.0",...}
```

### invalidations.ndjson

One invalidation per line.

```json
{"invalidation_id":"uuid","targets":[{"type":"claim_id","identifier":"..."}],"issued_at":"ISO8601",...}
```

### edges.ndjson

Relationships between claims, evidence, and invalidations.

```json
{"from":"claim_id","to":"evidence_id","relationship":"supports","type":"claim-evidence"}
{"from":"invalidation_id","to":"claim_id","relationship":"invalidates","type":"invalidation-claim"}
```

## Publishing

The index is published to:
- `apps/web/clear/` - Web interface
- `apps/web-verifier/clear/` - Verifier web interface
- GitHub Pages artifact

## Index Freeze

Periodic snapshots of the index are created with signed manifests to prevent rollback attacks.

