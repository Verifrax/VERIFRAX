#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors = []

def load(rel: str):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))

def need(condition, label):
    if condition:
        print(f"[VERIFY] {label}")
    else:
        errors.append(label)

for rel in [
    "verification/results/current/verification-result-0001.json",
    "verification/results/current/index.json",
    "verification/results/history/README.md",
    "evidence/chain/current/cross-stack-chain-bundle-0001.json",
    "schemas/cross-stack-chain-bundle.schema.json",
    "tests/test_end_to_end_chain_minimum.py",
]:
    need((ROOT / rel).exists(), f"file-present {rel}")

vr = load("verification/results/current/verification-result-0001.json")
idx = load("verification/results/current/index.json")
chain = load("evidence/chain/current/cross-stack-chain-bundle-0001.json")

need(idx.get("object_type") == "VERIFICATION_RESULT_INDEX", "verification-index-type")
need(idx.get("status") == "ACTIVE_TRUTH", "verification-index-status")
need(idx.get("historical") is False, "verification-index-historical-false")
need(idx.get("current_verification_result_ref") == "verification/results/current/verification-result-0001.json", "verification-index-binding")
need(idx.get("historical_archive_ref") == "verification/results/history/", "verification-index-history-ref")

entries = idx.get("entries", [])
need(len(entries) >= 1, "verification-index-entry-present")
first = entries[0] if entries else {}
need(first.get("verification_result_id") == vr.get("verification_result_id"), "verification-index-entry-id")
need(first.get("path") == "verification/results/current/verification-result-0001.json", "verification-index-entry-path")
need(first.get("receipt_id") == vr.get("receipt_id"), "verification-index-entry-receipt-id")
need(first.get("authority_seal_id") == vr.get("authority_seal_id"), "verification-index-entry-authority-seal-id")

need(vr.get("current_index_ref") == "verification/results/current/index.json", "verification-result-index-ref")
need(vr.get("historical_archive_ref") == "verification/results/history/", "verification-result-history-ref")
need(vr.get("accepted_epoch_ref") == "https://github.com/Verifrax/ORBISTIUM/blob/main/epochs/current/accepted-epoch-0001.json", "verification-result-epoch-ref")
need(vr.get("authority_object_ref") == "https://github.com/Verifrax/AUCTORISEAL/blob/main/authorities/current/authority-object-0001.json", "verification-result-authority-ref")
need(vr.get("execution_receipt_ref") == "https://github.com/Verifrax/CORPIFORM/blob/main/receipts/current/execution-receipt-0001.json", "verification-result-receipt-ref")
need(vr.get("recognition_object_ref") == "https://github.com/Verifrax/ANAGNORIUM/blob/main/recognitions/current/recognition-object-0001.json", "verification-result-recognition-ref")
need(vr.get("recourse_object_ref") == "https://github.com/Verifrax/REGRESSORIUM/blob/main/claims/current/recourse-object-0001.json", "verification-result-recourse-ref")
need(vr.get("continuity_ref") == "evidence/continuity/current/continuity-object-0001.json", "verification-result-continuity-ref")
need(vr.get("transfer_ref") == "evidence/transfer/current/transfer-object-0001.json", "verification-result-transfer-ref")

gov = chain.get("governing_refs", {})
need(gov.get("verification_result") == "verification/results/current/verification-result-0001.json", "chain-verification-ref")
need(gov.get("continuity") == "evidence/continuity/current/continuity-object-0001.json", "chain-continuity-ref")
need(gov.get("transfer") == "evidence/transfer/current/transfer-object-0001.json", "chain-transfer-ref")

summary = chain.get("binding_summary", {})
need(summary.get("verification_result_id") == vr.get("verification_result_id"), "chain-verification-id-match")
need(summary.get("continuity_object_id") == "continuity-object-0001", "chain-continuity-id")
need(summary.get("transfer_object_id") == "transfer-object-0001", "chain-transfer-id")

checks = chain.get("integrity_checks", {})
need(checks.get("verification_result_match") is True, "chain-verification-match")
need(checks.get("continuity_match") is True, "chain-continuity-match")
need(checks.get("transfer_match") is True, "chain-transfer-match")

if errors:
    print("[FAIL] PHASE 5 / STEP 93 end-to-end chain minimum verification failed")
    for e in errors:
        print(f" - {e}")
    sys.exit(1)

print("[PASS] PHASE 5 / STEP 93 end-to-end chain minimum verified")
