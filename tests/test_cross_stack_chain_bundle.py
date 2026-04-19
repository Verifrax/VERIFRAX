import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def load(rel):
    return json.loads((ROOT / rel).read_text())

def test_chain_bundle_core():
    obj = load("evidence/chain/current/cross-stack-chain-bundle-0001.json")
    idx = load("evidence/chain/current/index.json")
    vr = load("verification/results/current/verification-result-0001.json")

    assert obj["object_type"] == "CrossStackChainBundle"
    assert obj["status"] == "ACTIVE_TRUTH"
    assert obj["subject_artifact_id"] == "artifact-0005"
    assert obj["subject_ref"] == "evidence/artifact-0005/artifact-0005.json"
    assert obj["governing_refs"]["verification_result"] == "verification/results/current/verification-result-0001.json"
    assert obj["binding_summary"]["verification_result_id"] == vr["verification_result_id"]
    assert idx["current_chain_bundle_ref"] == "evidence/chain/current/cross-stack-chain-bundle-0001.json"
    assert idx["entries"][0]["chain_bundle_id"] == obj["chain_bundle_id"]
