# VERIFRAX Node Reference Verifier

This implementation provides the canonical executable verifier
for the VERIFRAX protocol.

The reference verifier exists to:

• validate protocol behavior
• execute the official conformance suites
• provide deterministic verification outputs
• act as a baseline for independent implementations

The verifier executes the protocol conformance suites located in:

protocol-conformance/v2/

Independent implementations MUST produce identical verification
verdicts when executing the same suites.
