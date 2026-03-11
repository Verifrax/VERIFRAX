# VERIFRAX Reproducible Build Instructions

## Purpose

Define deterministic procedures for reproducing the VERIFRAX verification environment.

Any party following these instructions must obtain identical verification behavior.

## Required Environment

Operating system:

- macOS / Linux

Required tooling:

- Git
- Node.js
- Rust
- Cargo

## Repository Acquisition

Clone the official repository:

git clone https://github.com/Verifrax/VERIFRAX.git
cd VERIFRAX

Checkout the canonical release:

git checkout main

## Node Reference Verifier

Install dependencies:

npm install

Run verification:

node verifier/node/src/verifier.mjs

Expected output:

canonical-equivalence: PASS
contradiction: PASS
finality-lock: PASS
invalidation: PASS
minimal-invalid: PASS
minimal-valid: PASS
profile-compatibility: PASS
signature-verification: PASS

Node reference verifier completed.

## Rust Minimal Verifier

Install Rust toolchain:

https://rustup.rs/

Build verifier:

cargo build --manifest-path verifier/rust/Cargo.toml

Run verifier:

cargo run --manifest-path verifier/rust/Cargo.toml --bin verifrax-rust-verifier

Expected output:

canonical-equivalence: PASS
contradiction: PASS
finality-lock: PASS
invalidation: PASS
minimal-invalid: PASS
minimal-valid: PASS
profile-compatibility: PASS
signature-verification: PASS

Node reference verifier completed.

## Deterministic Guarantee

Independent executions must produce:

- identical canonical hashes
- identical verification verdicts
- identical terminal output

## Conclusion

These instructions allow deterministic reproduction of the VERIFRAX verification environment.

