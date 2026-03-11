VERIFRAX SDK Integration Templates

This document defines minimal SDK integration templates for external
systems embedding VERIFRAX verification.

Purpose

The goal of these templates is to give implementers a deterministic,
non-invasive integration pattern.

SDK integrations must act as transport and execution layers only.

They must not mutate protocol semantics.

Available Templates

- Node integration template
- Python integration template

Locations

- sdk-templates/node/
- sdk-templates/python/

Required Behavior

An SDK integration must:

- call the verifier deterministically
- preserve raw verifier outputs
- expose protocol failure classes unchanged
- avoid semantic reinterpretation

Prohibited Behavior

An SDK integration must not:

- invent new verdict categories
- collapse protocol failure classes
- rewrite canonical verifier output
- suppress protocol errors

Ecosystem Role

These templates are minimal reference patterns for application developers
integrating VERIFRAX into services, pipelines, and tooling.
