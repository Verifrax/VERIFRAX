# What VERIFRAX Is (and Is Not)

## Problem Solved

VERIFRAX produces **deterministic verification certificates** over evidence bundles. It answers: "Given this input, what is the final, immutable verdict?"

## What It Does

- Accepts evidence bundle + payment
- Executes deterministic verification
- Issues exactly one certificate per execution
- Certificate is independently verifiable without VERIFRAX

## What It Does NOT Do

- Store your data
- Provide human review
- Allow re-execution or amendment
- Depend on VERIFRAX survival for validity

## Example

1. Pay €120 at api.verifrax.net
2. Upload evidence bundle
3. Receive certificate with hash

Certificate hash (genesis):
```
d7c23b65887c0ef554555b231c59935f6e2717586b54a68da8dc49b0bc61731b
```

## Verification

```bash
verifrax verify certificate.json
```

Or verify manually: recompute SHA-256 of canonical JSON, compare to `certificate_hash`.

## When to Use

- Timestamped proof of evidence state
- Dispute resolution (pre-established truth)
- Audit trail with cryptographic finality

## When NOT to Use

- Continuous monitoring (this is one-shot)
- Large-scale batch processing
- Mutable or revisable claims
