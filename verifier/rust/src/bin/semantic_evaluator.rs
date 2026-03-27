use std::collections::BTreeSet;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};

use serde_json::{json, Value};

fn read_json(path: &Path) -> Value {
    let data = fs::read_to_string(path).expect("failed to read json file");
    serde_json::from_str(&data).expect("failed to parse json")
}

fn read_text_if_exists(path: &Path) -> Option<String> {
    if path.exists() {
        Some(fs::read_to_string(path).expect("failed to read text").trim().to_string())
    } else {
        None
    }
}

fn resolve_evidence_path(repo_root: &Path, artifact_path: &Path, declared: Option<&str>) -> Option<PathBuf> {
    let declared = declared?;
    let declared_path = PathBuf::from(declared);

    if declared_path.is_absolute() {
        return Some(declared_path);
    }

    let artifact_dir = artifact_path.parent().unwrap_or(repo_root);
    let from_artifact = artifact_dir.join(&declared_path);
    if from_artifact.exists() {
        return Some(from_artifact);
    }

    Some(repo_root.join(declared_path))
}

fn sorted_codes(codes: Vec<&str>) -> Vec<String> {
    let mut set = BTreeSet::new();
    for c in codes {
        set.insert(c.to_string());
    }
    set.into_iter().collect()
}

fn support_path<'a>(artifact: &'a Value, key: &str) -> Option<&'a str> {
    artifact.get("supporting_evidence")?.get(key)?.as_str()
}

fn subject_field<'a>(artifact: &'a Value, key: &str) -> Option<&'a str> {
    artifact.get("subject")?.get(key)?.as_str()
}

fn evaluate_artifact_0002(repo_root: &Path, artifact: &Value, artifact_path: &Path) -> Value {
    let seal_log = resolve_evidence_path(repo_root, artifact_path, support_path(artifact, "seal_presence_log"));
    let ledger_log = resolve_evidence_path(repo_root, artifact_path, support_path(artifact, "ledger_presence_log"));

    if !seal_log.as_ref().map(|p| p.exists()).unwrap_or(false)
        || !ledger_log.as_ref().map(|p| p.exists()).unwrap_or(false)
    {
        return json!({
            "artifact_id": artifact["artifact_id"],
            "subject_ref": subject_field(artifact, "subject_ref").unwrap_or(""),
            "commit": subject_field(artifact, "commit").unwrap_or(""),
            "verdict": "NOT_EXECUTABLE",
            "status": "NOT_EXECUTED",
            "reason_codes": sorted_codes(vec![
                "DECLARED_EVIDENCE_MISSING",
                "EXECUTION_PREREQUISITE_MISSING"
            ]),
            "observations": {
                "seal_presence": "UNKNOWN",
                "ledger_presence": "UNKNOWN"
            },
            "notes": [
                "declared mandatory evidence for semantic readiness evaluation was missing"
            ]
        });
    }

    let seal_presence = read_text_if_exists(&seal_log.unwrap()).unwrap_or_else(|| "UNKNOWN".to_string());
    let ledger_presence = read_text_if_exists(&ledger_log.unwrap()).unwrap_or_else(|| "UNKNOWN".to_string());

    let mut codes = vec!["DECLARED_EVIDENCE_PRESENT"];
    if seal_presence == "ABSENT" {
        codes.push("GENESIS_SEAL_ABSENT");
    }
    if seal_presence == "PRESENT" {
        codes.push("GENESIS_SEAL_PRESENT");
    }
    if ledger_presence == "ABSENT" {
        codes.push("AUTHORITY_LEDGER_ABSENT");
    }
    if ledger_presence == "PRESENT" {
        codes.push("AUTHORITY_LEDGER_PRESENT");
    }

    if seal_presence == "ABSENT" || ledger_presence == "ABSENT" {
        codes.push("SEMANTIC_READINESS_UNSATISFIED");
        json!({
            "artifact_id": artifact["artifact_id"],
            "subject_ref": subject_field(artifact, "subject_ref").unwrap_or(""),
            "commit": subject_field(artifact, "commit").unwrap_or(""),
            "verdict": "FAILED",
            "status": "EXECUTED",
            "reason_codes": sorted_codes(codes),
            "observations": {
                "seal_presence": seal_presence,
                "ledger_presence": ledger_presence
            },
            "notes": [
                "semantic readiness conditions were evaluated from declared evidence"
            ]
        })
    } else {
        codes.push("SEMANTIC_VALIDATION_SUCCEEDED");
        json!({
            "artifact_id": artifact["artifact_id"],
            "subject_ref": subject_field(artifact, "subject_ref").unwrap_or(""),
            "commit": subject_field(artifact, "commit").unwrap_or(""),
            "verdict": "VERIFIED",
            "status": "EXECUTED",
            "reason_codes": sorted_codes(codes),
            "observations": {
                "seal_presence": seal_presence,
                "ledger_presence": ledger_presence
            },
            "notes": [
                "semantic readiness conditions were satisfied from declared evidence"
            ]
        })
    }
}

fn evaluate_artifact_0003(repo_root: &Path, artifact: &Value, artifact_path: &Path) -> Value {
    let seal_log = resolve_evidence_path(repo_root, artifact_path, support_path(artifact, "seal_presence_log"));
    let ledger_log = resolve_evidence_path(repo_root, artifact_path, support_path(artifact, "ledger_presence_log"));

    if !seal_log.as_ref().map(|p| p.exists()).unwrap_or(false)
        || !ledger_log.as_ref().map(|p| p.exists()).unwrap_or(false)
    {
        return json!({
            "artifact_id": artifact["artifact_id"],
            "subject_ref": subject_field(artifact, "subject_ref").unwrap_or(""),
            "commit": subject_field(artifact, "commit").unwrap_or(""),
            "verdict": "NOT_EXECUTABLE",
            "status": "NOT_EXECUTED",
            "reason_codes": sorted_codes(vec![
                "DECLARED_EVIDENCE_MISSING",
                "EXECUTION_PREREQUISITE_MISSING"
            ]),
            "observations": {
                "seal_presence": "UNKNOWN",
                "ledger_presence": "UNKNOWN"
            },
            "notes": [
                "declared mandatory evidence for issuance validation was missing"
            ]
        });
    }

    let seal_presence = read_text_if_exists(&seal_log.unwrap()).unwrap_or_else(|| "UNKNOWN".to_string());
    let ledger_presence = read_text_if_exists(&ledger_log.unwrap()).unwrap_or_else(|| "UNKNOWN".to_string());

    let mut codes = vec!["DECLARED_EVIDENCE_PRESENT"];
    if seal_presence == "ABSENT" {
        codes.push("GENESIS_SEAL_ABSENT");
    }
    if seal_presence == "PRESENT" {
        codes.push("GENESIS_SEAL_PRESENT");
    }
    if ledger_presence == "ABSENT" {
        codes.push("AUTHORITY_LEDGER_ABSENT");
    }
    if ledger_presence == "PRESENT" {
        codes.push("AUTHORITY_LEDGER_PRESENT");
    }

    if seal_presence == "ABSENT" || ledger_presence == "ABSENT" {
        codes.push("SUBJECT_ABSENT_NOT_EXECUTABLE");
        json!({
            "artifact_id": artifact["artifact_id"],
            "subject_ref": subject_field(artifact, "subject_ref").unwrap_or(""),
            "commit": subject_field(artifact, "commit").unwrap_or(""),
            "verdict": "NOT_EXECUTABLE",
            "status": "NOT_EXECUTED",
            "reason_codes": sorted_codes(codes),
            "observations": {
                "seal_presence": seal_presence,
                "ledger_presence": ledger_presence
            },
            "notes": [
                "claimed external issuance subject was absent at execution time"
            ]
        })
    } else {
        codes.push("SEMANTIC_VALIDATION_SUCCEEDED");
        json!({
            "artifact_id": artifact["artifact_id"],
            "subject_ref": subject_field(artifact, "subject_ref").unwrap_or(""),
            "commit": subject_field(artifact, "commit").unwrap_or(""),
            "verdict": "VERIFIED",
            "status": "EXECUTED",
            "reason_codes": sorted_codes(codes),
            "observations": {
                "seal_presence": seal_presence,
                "ledger_presence": ledger_presence
            },
            "notes": [
                "claimed external issuance subject was present and executable"
            ]
        })
    }
}


fn evaluate_artifact_0005(repo_root: &Path, artifact: &Value, artifact_path: &Path) -> Value {
    let execution_status_path = resolve_evidence_path(repo_root, artifact_path, support_path(artifact, "execution_status"));
    let receipt_path = resolve_evidence_path(repo_root, artifact_path, support_path(artifact, "receipt_json"));
    let receipt_digest_path = resolve_evidence_path(repo_root, artifact_path, support_path(artifact, "receipt_digest"));
    let output_digests_path = resolve_evidence_path(repo_root, artifact_path, support_path(artifact, "output_digests"));
    let exit_code_path = resolve_evidence_path(repo_root, artifact_path, support_path(artifact, "exit_code_log"));

    if !execution_status_path.as_ref().map(|p| p.exists()).unwrap_or(false)
        || !receipt_path.as_ref().map(|p| p.exists()).unwrap_or(false)
        || !receipt_digest_path.as_ref().map(|p| p.exists()).unwrap_or(false)
        || !output_digests_path.as_ref().map(|p| p.exists()).unwrap_or(false)
        || !exit_code_path.as_ref().map(|p| p.exists()).unwrap_or(false)
    {
        return json!({
            "artifact_id": artifact["artifact_id"],
            "subject_ref": subject_field(artifact, "subject_ref").unwrap_or(""),
            "commit": subject_field(artifact, "commit").unwrap_or(""),
            "verdict": "NOT_EXECUTABLE",
            "status": "NOT_EXECUTED",
            "reason_codes": sorted_codes(vec![
                "DECLARED_EVIDENCE_MISSING",
                "EXECUTION_PREREQUISITE_MISSING"
            ]),
            "observations": {
                "execution_status": "UNKNOWN",
                "receipt_status": "UNKNOWN",
                "receipt_authority_binding": "UNKNOWN",
                "exit_code": "UNKNOWN"
            },
            "notes": [
                "declared mandatory evidence for governed execution validation was missing"
            ]
        });
    }

    let execution_status = read_text_if_exists(&execution_status_path.unwrap()).unwrap_or_else(|| "".to_string());
    let receipt = read_json(&receipt_path.unwrap());
    let exit_code = read_text_if_exists(&exit_code_path.unwrap()).unwrap_or_else(|| "UNKNOWN".to_string());

    let expected_seal_id = artifact["subject"]["authority_seal_id"].as_str().unwrap_or("UNKNOWN");
    let actual_seal_id = receipt["authority_seal_id"].as_str().unwrap_or("UNKNOWN");
    let binding_matched = actual_seal_id == expected_seal_id;

    let receipt_present = receipt.get("receipt_id").is_some() && !receipt["receipt_id"].is_null();

    let mut codes = vec!["DECLARED_EVIDENCE_PRESENT"];
    if execution_status.contains("STATUS: GOVERNED EXECUTION RECORDED") {
        codes.push("GOVERNED_EXECUTION_RECORDED");
    }
    if receipt_present {
        codes.push("RECEIPT_PRESENT");
    }
    if binding_matched {
        codes.push("RECEIPT_AUTHORITY_MATCHED");
    }
    if exit_code == "0" {
        codes.push("EXIT_CODE_ZERO");
    }

    let observations = json!({
        "execution_status": if execution_status.contains("STATUS: GOVERNED EXECUTION RECORDED") { "RECORDED" } else { "UNKNOWN" },
        "receipt_status": if receipt_present { "PRESENT" } else { "ABSENT" },
        "receipt_authority_binding": if binding_matched { "MATCHED" } else { "MISMATCH" },
        "exit_code": exit_code
    });

    let failed =
        !execution_status.contains("STATUS: GOVERNED EXECUTION RECORDED") ||
        !receipt_present ||
        !binding_matched ||
        exit_code != "0";

    if failed {
        codes.push("SEMANTIC_VALIDATION_UNSATISFIED");
        json!({
            "artifact_id": artifact["artifact_id"],
            "subject_ref": subject_field(artifact, "subject_ref").unwrap_or(""),
            "commit": subject_field(artifact, "commit").unwrap_or(""),
            "verdict": "FAILED",
            "status": "EXECUTED",
            "reason_codes": sorted_codes(codes),
            "observations": observations,
            "notes": [
                "governed execution evidence was present but one or more required validation conditions failed"
            ]
        })
    } else {
        codes.push("SEMANTIC_VALIDATION_SUCCEEDED");
        json!({
            "artifact_id": artifact["artifact_id"],
            "subject_ref": subject_field(artifact, "subject_ref").unwrap_or(""),
            "commit": subject_field(artifact, "commit").unwrap_or(""),
            "verdict": "VERIFIED",
            "status": "EXECUTED",
            "reason_codes": sorted_codes(codes),
            "observations": observations,
            "notes": [
                "governed execution evidence, receipt presence, authority binding, and exit code all satisfied validation"
            ]
        })
    }
}

fn main() {
    let repo_root = env::current_dir().expect("failed to get cwd");
    let artifact_arg = env::args().nth(1).expect("usage: semantic_evaluator <artifact-json-path>");
    let artifact_path = repo_root.join(artifact_arg);
    let artifact = read_json(&artifact_path);

    let artifact_id = artifact["artifact_id"].as_str().expect("artifact_id missing");
    let output = match artifact_id {
        "artifact-0002" => evaluate_artifact_0002(&repo_root, &artifact, &artifact_path),
        "artifact-0003" => evaluate_artifact_0003(&repo_root, &artifact, &artifact_path),
        "artifact-0005" => evaluate_artifact_0005(&repo_root, &artifact, &artifact_path),
        _ => panic!("unsupported artifact id"),
    };

    println!("{}", serde_json::to_string_pretty(&output).unwrap());
}