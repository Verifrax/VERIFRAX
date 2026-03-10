# CICULLIS — Marketplace Surface (Non-Authoritative)

This document exists for GitHub Marketplace onboarding only.

## What this Action does

Runs a deterministic CI gate and exits pass/fail based on repository state and the shipped gate contract.

## Inputs

None (no Action inputs).

## Outputs

None (no Action outputs).

## Success / Failure semantics

- **On success:** exits `0` and the workflow continues.
- **On failure:** exits non-zero and the workflow fails.

## Security & pinning

Pin to a commit SHA:

```yaml
- uses: vatfix-ops/CICULLIS@<COMMIT_SHA>
```

## Support

Contact: `support@vatfix.eu`

Support is limited to bug reports and reproducible failures. No advisory, legal, or compliance support is provided.

## Non-authoritative notice

This Action produces technical CI outcomes only. It does not provide compliance guarantees and does not assert legal meaning.
