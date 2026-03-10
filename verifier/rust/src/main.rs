use serde_json::Value;
use std::fs;
use std::path::Path;

fn load_json(path: &Path) -> Value {
    let data = fs::read_to_string(path).expect("read json");
    serde_json::from_str(&data).expect("parse json")
}

fn verify_bundle(bundle: &Value) -> Value {

    if bundle.get("protocol_version").is_none() {
        return json!({
            "verdict": "FAILED",
            "error_class": "MISSING_PROTOCOL_VERSION"
        });
    }

    if bundle.get("bundle_hash").is_none() {
        return json!({
            "verdict": "FAILED",
            "error_class": "MISSING_BUNDLE_HASH"
        });
    }

    if bundle.get("invalidation").is_some() {
        return json!({
            "verdict": "INVALIDATED",
            "error_class": "CLAIM_INVALIDATED"
        });
    }

    json!({
        "verdict": "VERIFIED"
    })
}

fn run_suite(root: &Path, suite_file: &Path) {

    let suite = load_json(suite_file);

    let bundle_path = root.join(
        suite["input_bundle"].as_str().unwrap()
    );

    let expected_path = root.join(
        suite["expected_output"].as_str().unwrap()
    );

    let bundle = load_json(&bundle_path);
    let expected = load_json(&expected_path);

    let result = verify_bundle(&bundle);

    if result["verdict"] != expected["verdict"] {
        panic!("verdict mismatch");
    }

    println!("suite passed");
}

fn main() {

    let root = Path::new("protocol-conformance/v2");
    let suites_dir = root.join("suites");

    for entry in fs::read_dir(suites_dir).unwrap() {

        let path = entry.unwrap().path();

        if path.extension().unwrap() == "json" {
            run_suite(root, &path);
        }
    }

    println!("Rust verifier completed.");
}

use serde_json::json;
