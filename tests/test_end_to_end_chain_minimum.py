import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def load(rel: str):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))

def test_verification_result_index_and_chain_are_bound():
    vr = load("verification/results/current/verification-result-0001.json")
    index = load("verification/results/current/index.json")
    chain = load("evidence/chain/current/cross-stack-chain-bundle-0001.json")

    assert index["object_type"] == "VERIFICATION_RESULT_INDEX"
    assert index["status"] == "ACTIVE_TRUTH"
    assert index["historical"] is False
    assert index["current_verification_result_ref"] == "verification/results/current/verification-result-0001.json"
    assert index["historical_archive_ref"] == "verification/results/history/"

    entry = index["entries"][0]
    assert entry["verification_result_id"] == vr["verification_result_id"]
    assert entry["path"] == "verification/results/current/verification-result-0001.json"
    assert entry["receipt_id"] == vr["receipt_id"]
    assert entry["authority_seal_id"] == vr["authority_seal_id"]

    assert vr["current_index_ref"] == "verification/results/current/index.json"
    assert vr["historical_archive_ref"] == "verification/results/history/"
    assert vr["continuity_ref"] == "evidence/continuity/current/continuity-object-0001.json"
    assert vr["transfer_ref"] == "evidence/transfer/current/transfer-object-0001.json"

    assert chain["governing_refs"]["verification_result"] == "verification/results/current/verification-result-0001.json"
    assert chain["governing_refs"]["continuity"] == "evidence/continuity/current/continuity-object-0001.json"
    assert chain["governing_refs"]["transfer"] == "evidence/transfer/current/transfer-object-0001.json"

    assert chain["binding_summary"]["verification_result_id"] == vr["verification_result_id"]
    assert chain["binding_summary"]["continuity_object_id"] == "continuity-object-0001"
    assert chain["binding_summary"]["transfer_object_id"] == "transfer-object-0001"

    assert chain["integrity_checks"]["verification_result_match"] is True
    assert chain["integrity_checks"]["continuity_match"] is True
    assert chain["integrity_checks"]["transfer_match"] is True
