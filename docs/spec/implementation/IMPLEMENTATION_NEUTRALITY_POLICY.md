# VERIFRAX Implementation Neutrality Policy

## Purpose

This document defines the neutrality guarantees of the VERIFRAX
protocol with respect to implementation technologies.

The protocol specification MUST remain independent from any
specific programming language, runtime environment, or software
architecture.

No implementation may be treated as protocol authority.

---

## Protocol Authority Boundary

Protocol authority is defined exclusively by:

• the normative specification
• the deterministic verification algorithms
• the protocol conformance suites

Implementations act only as realizations of the specification.

No implementation behavior may redefine protocol semantics.

---

## Reference Implementation Status

The VERIFRAX reference verifier serves only as:

• an executable specification
• a validation tool for conformance suites
• a behavioral reference for independent implementations

The reference implementation MUST NOT introduce behavior that
is not defined by the protocol specification.

If divergence occurs between specification and implementation,
the specification takes precedence.

---

## Multi-Language Compatibility

Independent implementations MAY be written in any programming
language or runtime environment.

Examples include but are not limited to:

• JavaScript / Node.js
• Rust
• Go
• Python
• C / C++
• JVM languages

Protocol compatibility is determined exclusively by deterministic
behavior and conformance suite results.

---

## Deterministic Behavior Requirement

All compliant implementations MUST guarantee:

• identical canonical normalization
• identical verification ordering
• identical verdict outputs
• identical finality behavior

Implementation-specific optimizations MUST NOT alter protocol
semantics.

---

## Conformance Verification

Compatibility is demonstrated by executing the official
protocol conformance suites.

All compliant implementations MUST pass:

protocol-conformance/v2/

Results SHOULD be published to support ecosystem verification.

---

## Ecosystem Interoperability

The neutrality policy enables the development of multiple
independent verifiers.

Independent implementations strengthen protocol security by:

• reducing monoculture risk
• validating deterministic specification behavior
• detecting specification ambiguities

Protocol evolution MUST preserve interoperability across
existing implementations.

---

## Compliance

Implementations claiming VERIFRAX compatibility MUST:

• follow the normative specification
• satisfy the reference implementation contract
• pass the official conformance suites
• preserve deterministic verification semantics
