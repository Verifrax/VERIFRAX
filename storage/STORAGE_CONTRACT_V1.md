# VERIFRAX STORAGE CONTRACT — V1 (IMMUTABLE)

VERSION: v2.7.0
STATE: LOCKED

R2_BUCKETS:
  EVIDENCE: verifrax-evidence
  CERTS: verifrax-certificates

OBJECT_KEYS:
  evidence/<bundle_hash>
  cert/<certificate_hash>.json

RULES:
  - No overwrite
  - No delete
  - No mutation
  - Append-only

