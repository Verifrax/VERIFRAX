import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def load(rel: str):
    return json.loads((ROOT / rel).read_text())

def test_continuity_transfer_minimum():
    continuity = load("evidence/continuity/current/continuity-object-0001.json")
    continuity_index = load("evidence/continuity/current/index.json")
    transfer = load("evidence/transfer/current/transfer-object-0001.json")
    transfer_index = load("evidence/transfer/current/index.json")
    bundle = load("evidence/chain/current/cross-stack-chain-bundle-0001.json")

    assert continuity["object_type"] == "ContinuityObject"
    assert continuity["status"] == "ACTIVE_TRUTH"
    assert continuity_index["current_continuity_object_ref"] == "evidence/continuity/current/continuity-object-0001.json"

    assert transfer["object_type"] == "TransferObject"
    assert transfer["status"] == "ACTIVE_TRUTH"
    assert transfer["continuity_object_ref"] == "evidence/continuity/current/continuity-object-0001.json"
    assert transfer_index["current_transfer_object_ref"] == "evidence/transfer/current/transfer-object-0001.json"

    assert bundle["governing_refs"]["continuity_object"] == "evidence/continuity/current/continuity-object-0001.json"
    assert bundle["governing_refs"]["transfer_object"] == "evidence/transfer/current/transfer-object-0001.json"
    assert bundle["index_refs"]["continuity_index"] == "evidence/continuity/current/index.json"
    assert bundle["index_refs"]["transfer_index"] == "evidence/transfer/current/index.json"
