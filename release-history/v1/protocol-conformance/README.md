# VERIFRAX Protocol Conformance

Status: Normative

---

## 1. Purpose

The protocol conformance suite enables automated verification
that implementations comply with the VERIFRAX protocol
specification.

Conformance tests ensure that independent implementations:

- produce identical verification results
- follow deterministic protocol algorithms
- implement protocol rules correctly

---

## 2. Conformance Structure

The conformance system consists of:

bundles/  
Test evidence bundles used as verification input.

expected/  
Expected verification outputs for each bundle.

suites/  
Structured conformance test definitions.

---

## 3. Conformance Evaluation

An implementation is considered VERIFRAX-compliant if it:

1. processes all conformance bundles successfully
2. produces the expected deterministic outputs
3. passes all conformance suites without deviation

---

## 4. Deterministic Requirement

All conformance results MUST be deterministic.

Given the same:

- protocol version
- evidence bundle
- verification rules

all compliant implementations MUST produce identical outputs.

---

## 5. Protocol Versioning

Conformance suites are versioned alongside protocol
releases.

Each protocol version MUST define its corresponding
conformance suites.

---

## 6. Compliance

Implementations claiming VERIFRAX compatibility SHOULD
run the official protocol conformance suites.

Passing the conformance suites demonstrates
protocol-level compliance.
