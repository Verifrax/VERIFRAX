# VERIFRAX Conformance Suite — Protocol v2

This directory contains the official conformance test suites for
VERIFRAX protocol version 2.

The conformance suites provide deterministic verification tests
used to validate that independent implementations behave
identically according to the protocol specification.

Structure:

bundles/
Evidence bundles used as verification inputs.

expected/
Deterministic verification outputs expected for each bundle.

suites/
Structured conformance test definitions referencing bundles
and expected outputs.

All bundles and outputs MUST remain immutable once published
for a given protocol version.

Implementations claiming compatibility with VERIFRAX protocol
version 2 SHOULD execute all conformance suites defined in this
directory.

Passing all suites demonstrates protocol-level behavioral
compatibility.
