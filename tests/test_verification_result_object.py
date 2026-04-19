import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def load(rel: str):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))

def test_verification_result_object_minimum():
    data = load("verification/results/current/verification-result-0001.json")

    assert data["verification_result_id"] == "verification-result-0001"
    assert data["claim_class_ref"] == "Verifrax/SYNTAGMARIUM/claim-classes/verification-result.json"
    assert data["governing_law_version_ref"] == "Verifrax/SYNTAGMARIUM/law/versions/current/law-version-0001.json"

    assert "receipt_id" in data and isinstance(data["receipt_id"], str) and data["receipt_id"]
    assert "authority_seal_id" in data and isinstance(data["authority_seal_id"], str) and data["authority_seal_id"]
    assert "historical_archive_ref" in data and data["historical_archive_ref"] == "verification/results/history/"
    assert "current_index_ref" in data and data["current_index_ref"] == "verification/results/current/index.json"

    assert data["accepted_epoch_ref"] == "https://github.com/Verifrax/ORBISTIUM/blob/main/epochs/current/accepted-epoch-0001.json"
    assert data["authority_object_ref"] == "https://github.com/Verifrax/AUCTORISEAL/blob/main/authorities/current/authority-object-0001.json"
    assert data["execution_receipt_ref"] == "https://github.com/Verifrax/CORPIFORM/blob/main/receipts/current/execution-receipt-0001.json"
    assert data["recognition_object_ref"] == "https://github.com/Verifrax/ANAGNORIUM/blob/main/recognitions/current/recognition-object-0001.json"
    assert data["recourse_object_ref"] == "https://github.com/Verifrax/REGRESSORIUM/blob/main/claims/current/recourse-object-0001.json"
    assert data["continuity_ref"] == "evidence/continuity/current/continuity-object-0001.json"
    assert data["transfer_ref"] == "evidence/transfer/current/transfer-object-0001.json"
