VERIFRAX BUNDLE SPEC v1

REQUIRED FILES
- certificate.v1.json
- certificate.v1.sha256

REQUIRED DIRECTORIES
- anchors/
- transparency/

OPTIONAL DIRECTORIES (RECOMMENDED)
- manifests/
- proofs/

ANCHORS DIRECTORY
- anchors/<type>.json for each anchor referenced in certificate.anchors[*].proof_ref

TRANSPARENCY DIRECTORY
- transparency/log.json containing payload or reference bound to:
  - certificate.transparency.log_root
  - certificate.transparency.log_entry_hash

MANIFESTS DIRECTORY (WHEN PRESENT)
- manifests/inputs.manifest.json
- manifests/outputs.manifest.json
Verifier must recompute:
- inputs.merkle_root + inputs.list_hash
- outputs.merkle_root + outputs.list_hash

VERIFIER CONTRACT
Verifier MUST output one of:
- VERIFIED
- INVALID
- FRAUD
