#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def need(ok, label):
    if not ok:
        raise SystemExit(f"FAIL {label}")
    print(f"[VERIFY] {label}")

def load(rel):
    return json.loads((ROOT / rel).read_text())

required_files = [
    "evidence/continuity/current/continuity-object-0001.json",
    "evidence/continuity/current/index.json",
    "evidence/continuity/history/README.md",
    "evidence/transfer/current/transfer-object-0001.json",
    "evidence/transfer/current/index.json",
    "evidence/transfer/history/README.md",
    "schemas/continuity-object.schema.json",
    "schemas/transfer-object.schema.json",
    "evidence/chain/current/cross-stack-chain-bundle-0001.json",
    "tests/test_continuity_transfer_objects.py"
]
for rel in required_files:
    need((ROOT / rel).exists(), f"file-present {rel}")

continuity = load("evidence/continuity/current/continuity-object-0001.json")
continuity_index = load("evidence/continuity/current/index.json")
transfer = load("evidence/transfer/current/transfer-object-0001.json")
transfer_index = load("evidence/transfer/current/index.json")
bundle = load("evidence/chain/current/cross-stack-chain-bundle-0001.json")

need(continuity["object_type"] == "ContinuityObject", "continuity-object-type")
need(continuity["status"] == "ACTIVE_TRUTH", "continuity-status")
need(continuity["historical_archive_ref"] == "evidence/continuity/history/", "continuity-history-ref")
need(continuity_index["current_continuity_object_ref"] == "evidence/continuity/current/continuity-object-0001.json", "continuity-index-binding")
need(continuity_index["historical"] is False, "continuity-index-historical-false")

need(transfer["object_type"] == "TransferObject", "transfer-object-type")
need(transfer["status"] == "ACTIVE_TRUTH", "transfer-status")
need(transfer["continuity_object_ref"] == "evidence/continuity/current/continuity-object-0001.json", "transfer-links-continuity")
need(transfer["historical_archive_ref"] == "evidence/transfer/history/", "transfer-history-ref")
need(transfer_index["current_transfer_object_ref"] == "evidence/transfer/current/transfer-object-0001.json", "transfer-index-binding")
need(transfer_index["historical"] is False, "transfer-index-historical-false")

need(bundle["governing_refs"]["continuity_object"] == "evidence/continuity/current/continuity-object-0001.json", "bundle-continuity-ref")
need(bundle["governing_refs"]["transfer_object"] == "evidence/transfer/current/transfer-object-0001.json", "bundle-transfer-ref")
need(bundle["index_refs"]["continuity_index"] == "evidence/continuity/current/index.json", "bundle-continuity-index")
need(bundle["index_refs"]["transfer_index"] == "evidence/transfer/current/index.json", "bundle-transfer-index")
need(bundle["consistency"]["continuity_index_binding_ok"] is True, "bundle-continuity-consistency")
need(bundle["consistency"]["transfer_index_binding_ok"] is True, "bundle-transfer-consistency")
need(bundle["consistency"]["continuity_transfer_link_ok"] is True, "bundle-continuity-transfer-link")

print("[PASS] PHASE 3 / STEP 29 continuity-transfer minimum verified")
