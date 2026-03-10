# VERIFRAX Rust Minimal Verifier

This implementation provides a minimal independent verifier
written in Rust.

Purpose:

• validate protocol determinism across implementations
• execute protocol conformance suites
• confirm cross-language interoperability

The Rust verifier executes the suites located in:

protocol-conformance/v2/

Outputs must match the canonical verdict outputs defined
by the protocol specification.
