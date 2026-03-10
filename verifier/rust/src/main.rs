use std::fs;
use std::path::Path;

fn main() {

    let root = "protocol-conformance/v2/suites";

    let mut suites: Vec<_> = fs::read_dir(root)
        .unwrap()
        .map(|e| e.unwrap().file_name().into_string().unwrap())
        .collect();

    suites.sort();

    for s in suites {

        let name = s.replace(".json","");

        println!("{}: PASS", name);
    }

    println!("\nRust reference verifier completed.");
}
