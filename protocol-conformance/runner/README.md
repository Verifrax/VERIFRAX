# VERIFRAX Conformance Runner

This runner executes the protocol conformance suites located in:

protocol-conformance/v2/

The runner loads each suite definition, evaluates the expected
verification verdict, and confirms deterministic output behavior.

The runner provides a minimal deterministic harness intended for:

• protocol verification validation
• cross-implementation comparison
• continuous integration conformance checks

Independent implementations may replace the verification engine
but MUST produce identical verdict outputs when executing the
conformance suites.
