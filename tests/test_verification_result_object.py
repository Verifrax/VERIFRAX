import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def test_verification_result_object_minimum():
    p = ROOT / verification/results/current/verification-result-0001.json
    assert p.is_file()
    data = json.loads(p.read_text())
    assert data[object_type] == VerificationResult
    assert data[verification_result_id] == verification-result-0001
    assert data[status] == ACTIVE_TRUTH
    assert data[artifact_id] == artifact-0005
    assert data[verdict] == VERIFIED
    assert data[claim_class_ref] == Verifrax/SYNTAGMARIUM/claim-classes/verification-result.json
    assert data[governing_law_version_ref] == Verifrax/SYNTAGMARIUM/law/versions/current/law-version-0001.json
    assert data[governing_freeze_object_ref] == Verifrax/SYNTAGMARIUM/freeze/objects/current/freeze-object-0001.json
    assert data[canonical_semantic_sha256] == 801c87f08221ac194282b1a2e7f58cac2dcc143f6944c98a888edc086a72fc6b
    for key in [
        artifact_ref, node_verdict_ref, node_semantic_ref, rust_verdict_ref,
        rust_semantic_ref, cross_implementation_ref
    ]:
        assert (ROOT / data[key]).is_file(), key
    node = json.loads((ROOT / data[node_semantic_ref]).read_text())
    rust = json.loads((ROOT / data[rust_semantic_ref]).read_text())
    assert node == rust
    assert node[verdict] == data[verdict]
