export type CineLintCertificateV1 = {
  version: "v1";
  certificate_id: string;           // uuid
  issued_at: string;                // ISO8601
  issuer: { org: string; key_id: string };
  subject: {
    title: string;                  // asset title
    kind: "feature"|"episode"|"trailer"|"ad";
    asset_id: string;               // internal or external id
  };
  profile: { name: string; version: string; hash: string };
  pipeline: { name: string; version: string; sbom_hash: string; parameters_hash: string };
  inputs: { merkle_root: string; list_hash: string };
  outputs: { merkle_root: string; list_hash: string };
  execution: { deterministic: true; run_id: string; trace_root: string };
  consensus: { quorum_threshold: string; stake_snapshot_hash: string; threshold_sig: string };
  finality: { zk_proof_hash: string; receipt_hash: string };
  anchors: Array<{ type: "eth"|"btc"|"rekor"; commitment_hash: string; proof_ref: string }>;
  transparency: { log_root: string; log_entry_hash: string };
  exclusions: string[];             // explicit exclusions ids
  verification: { verifier_version: string; instructions_ref: string };
};

