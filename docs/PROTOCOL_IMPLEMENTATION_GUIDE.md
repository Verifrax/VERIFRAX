# VERIFRAX Protocol Implementation Guide

This document provides the authoritative guidance for engineers implementing
independent VERIFRAX verification engines.

The objective is to ensure that independent implementations produce identical
verification outcomes.

## Implementation Objective

A conforming implementation must:

- produce deterministic verification outcomes
- match the reference verifier outputs
- pass the official conformance test suites
- respect protocol freeze boundaries

Verification behavior must not depend on runtime environment differences.

## Required Protocol Components

A compliant implementation must support:

1. Artifact canonicalization
2. Evidence bundle parsing
3. Profile compatibility validation
4. Signature verification
5. Verification rule execution
6. Verdict generation
7. Deterministic failure codes

All components must behave deterministically.

## Canonical Verification Pipeline

The expected verification pipeline is:

1. Load artifact bundle
2. Canonicalize artifact structure
3. Validate schema and profiles
4. Verify signatures
5. Execute protocol verification rules
6. Produce final verdict

The resulting verdict must match the expected output of the
official protocol conformance suites.

## Determinism Requirements

Verification outcomes must be invariant across:

- operating systems
- CPU architectures
- runtime implementations
- language ecosystems

If two implementations produce different outcomes for the same artifact,
one of them is non-conforming.

## Reference Implementations

The repository includes two reference implementations:

- Node verifier
- Rust verifier

Independent implementations must produce identical results
to these reference verifiers.

## Conformance Testing

Implementations must execute the protocol conformance suites located in:

protocol-conformance/

Passing all suites is required for protocol compliance.

## Implementation Boundaries

Implementations must not modify:

- protocol rules
- verification semantics
- canonicalization behavior
- failure codes

Any deviation results in protocol incompatibility.

## Verification Output

The verification result must include:

- final verdict
- deterministic failure codes
- verification metadata

Output format must match the protocol specification.

## Long-Term Compatibility

Future protocol versions may extend capabilities, but historical
verification outcomes must remain reproducible.

Implementations must preserve deterministic behavior for
historical releases.

