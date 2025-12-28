# VERIFRAX v1 Verdict Reference (Normative)

This document defines the **normative, non-interpretive semantics**
of VERIFRAX v1 verdict outputs.

This document provides **no guidance, recommendations, or actions**.
It exists solely to define invariant meanings required for conformance.

## Verdict Enum

```typescript
type Verdict = 
  | "VALID"
  | "INVALID"
  | "INCONCLUSIVE"
  | "CONTRADICTED"
  | "UNSUPPORTED"
  | "NONCONFORMING";
```

## Verdict Output Schema

See `core/schemas/verdict.schema.json` for the complete JSON Schema definition.

## Normative Hashing Rule (v1)

When computing a VERIFRAX v1 bundle hash, `bundle.json` **MUST** be canonicalized prior to hashing.

Canonicalization consists of **removing all fields listed in `hash_exclusions`** before computing the path-bound content hash.

Any implementation that hashes `bundle.json` without canonicalization is **non-conformant** with VERIFRAX v1 and produces invalid bundle hashes.

This rule is **normative** and applies to all current and future verifier implementations.

## Authority Disclaimer

VERIFRAX v1 does not provide recommendations, actions, or guidance.
Any interpretation of verdicts occurs outside the system.
