#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORG = ROOT.parent

def load_json(path: Path):
    if not path.exists():
        raise SystemExit(f"FAIL missing-file {path}")
    try:
        return json.loads(path.read_text())
    except Exception as e:
        raise SystemExit(f"FAIL invalid-json {path}: {e}")

def need(cond, msg):
    if not cond:
        raise SystemExit(f"FAIL {msg}")

def gh_to_local(url: str):
    m = re.match(r"^https://github\.com/Verifrax/([^/]+)/blob/main/(.+)$", url)
    if not m:
        return None
    repo, rel = m.group(1), m.group(2)
    return ORG / repo / rel

chain = load_json(ROOT / "evidence/chain/current/cross-stack-chain-bundle-0001.json")
index_obj = load_json(ROOT / "evidence/chain/current/index.json")
schema = load_json(ROOT / "schemas/cross-stack-chain-bundle.schema.json")
verification = load_json(ROOT / "verification/results/current/verification-result-0001.json")
artifact = load_json(ROOT / "evidence/artifact-0005/artifact-0005.json")

recognition = load_json(ORG / "ANAGNORIUM/recognitions/current/recognition-object-0001.json")
recognition_index = load_json(ORG / "ANAGNORIUM/recognitions/current/index.json")
recourse = load_json(ORG / "REGRESSORIUM/claims/current/recourse-object-0001.json")
recourse_index = load_json(ORG / "REGRESSORIUM/claims/current/index.json")

print("[VERIFY] files-present")

need(chain["object_type"] == "CrossStackChainBundle", "chain bundle type")
need(chain["status"] == "ACTIVE_TRUTH", "chain bundle status")
need(chain["subject_artifact_id"] == "artifact-0005", "subject artifact id")
need(chain["subject_ref"] == "evidence/artifact-0005/artifact-0005.json", "subject ref")
need(chain["governing_refs"]["verification_result"] == "verification/results/current/verification-result-0001.json", "verification result ref")
need(chain["index_refs"]["chain_index"] == "evidence/chain/current/index.json", "chain index ref")
need(chain["index_refs"]["historical_archive"] == "evidence/chain/history/", "historical archive ref")

print("[VERIFY] chain-bundle-core")

need(index_obj["object_type"] == "CrossStackChainIndex", "chain index type")
need(index_obj["status"] == "ACTIVE_TRUTH", "chain index status")
need(index_obj["historical"] is False, "chain index historical false")
need(index_obj["current_chain_bundle_ref"] == "evidence/chain/current/cross-stack-chain-bundle-0001.json", "current chain bundle ref")
need(index_obj["entries"][0]["chain_bundle_id"] == chain["chain_bundle_id"], "index id matches")

print("[VERIFY] chain-index-core")

need(chain["binding_summary"]["verification_result_id"] == verification["verification_result_id"], "verification result id matches")
need(chain["binding_summary"]["authority_id"] == verification["authority_id"], "authority id matches")
need(chain["binding_summary"]["authority_seal_id"] == verification["authority_seal_id"], "authority seal id matches")
need(chain["binding_summary"]["receipt_id"] == verification["receipt_id"], "receipt id matches")
need(chain["binding_summary"]["canonical_semantic_sha256"] == verification["canonical_semantic_sha256"], "semantic sha matches")
need(chain["subject_artifact_id"] == artifact["artifact_id"], "artifact id matches")

print("[VERIFY] verification-binding-core")

need(chain["governing_refs"]["recognition_object"] == "https://github.com/Verifrax/ANAGNORIUM/blob/main/recognitions/current/recognition-object-0001.json", "recognition object ref exact")
need(chain["governing_refs"]["recourse_object"] == "https://github.com/Verifrax/REGRESSORIUM/blob/main/claims/current/recourse-object-0001.json", "recourse object ref exact")
need(chain["binding_summary"]["recognition_object_id"] == recognition["recognition_object_id"], "recognition object id matches")
need(chain["binding_summary"]["recourse_object_id"] == recourse["recourse_object_id"], "recourse object id matches")
need(recognition_index["current_recognition_object_ref"] == "recognitions/current/recognition-object-0001.json", "recognition index bound")
need(recourse_index["current_recourse_object_ref"] == "claims/current/recourse-object-0001.json", "recourse index bound")

need(recognition["verification_result_ref"] == recourse["verification_result_ref"], "recognition/recourse verification ref match")
need(recognition["accepted_epoch_ref"] == recourse["accepted_epoch_ref"], "recognition/recourse epoch ref match")
need(recognition["authority_object_ref"] == recourse["authority_object_ref"], "recognition/recourse authority ref match")
need(recognition["execution_receipt_ref"] == recourse["execution_receipt_ref"], "recognition/recourse receipt ref match")
need(recognition["subject_ref"] == recourse["subject_ref"], "recognition/recourse subject ref match")

print("[VERIFY] recognition-recourse-binding-core")

for key, expected in [
    ("law_version_match", True),
    ("accepted_epoch_match", True),
    ("authority_object_match", True),
    ("execution_receipt_match", True),
    ("verification_result_match", True),
    ("subject_ref_match", True),
    ("recognition_index_binding_ok", True),
    ("recourse_index_binding_ok", True),
    ("recognition_precedes_recourse", True),
]:
    need(chain["consistency"][key] is expected, f"consistency {key}")

print("[VERIFY] consistency-core")

try:
    import jsonschema  # type: ignore
except Exception:
    print("[VERIFY] jsonschema-module absent -> structural verification only")
else:
    from jsonschema import Draft202012Validator
    Draft202012Validator(schema).validate(chain)
    print("[VERIFY] full-jsonschema-validation")

print("[PASS] PHASE 3 / STEP 21 public chain bundle minimum verified")
