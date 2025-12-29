VERIFRAX CLAIM: MEDIA-FINALITY v1

WHAT THIS CERTIFICATE PROVES
1) Process Compliance
   The declared pipeline (pipeline.version, pipeline.sbom_hash, pipeline.parameters_hash) executed and produced the declared outputs.

2) Determinism
   Under identical declared inputs + pipeline definition, the pipeline is intended to reproduce identical outputs.

3) Post-Approval Immutability
   The declared outputs (outputs.merkle_root) are bound to anchors and cannot be altered without invalidating verification.

ACCEPTANCE CONDITION (SUFFICIENT PROOF)
A recipient may treat the certificate as sufficient proof of technical delivery process finality if:
- verifier returns VERIFIED
- certificate contains >=2 distinct anchors
- consensus contains stake_snapshot_hash + threshold_sig
- transparency contains log_root + log_entry_hash
- manifests (when present) recompute to certificate inputs/outputs roots

OUT OF SCOPE (EXPLICIT)
- Creative/editorial judgment
- Legal clearance
- Platform ingest acceptance
- Source authenticity
- Playback/device environment

FAILURE MODES
- INVALID: missing required evidence or mismatched hashes
- FRAUD: contradictory evidence (e.g., duplicate anchor refs, conflicting snapshots)

VERSION LOCK
Applies only to certificate schema v1.
