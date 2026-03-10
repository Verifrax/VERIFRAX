# Reproducibility

## Build environment

| Component | Version | Hash verification |
|-----------|---------|-------------------|
| Node.js | 20.x LTS | n/a |
| Wrangler | 4.x | n/a |
| SHA-256 | OpenSSL | Standard |

## Verification steps

```bash
# Clone at specific tag
git clone --branch v2.8.0 https://github.com/Verifrax/VERIFRAX.git
cd VERIFRAX

# Verify engine hash
sha256sum verifrax-engine/execute_v2_6_0.js

# Verify frozen snapshot
sha256sum verifrax-freeze/v2.8.0/source/VERIFRAX/freeze/v2.8.0/worker.js

# Verify reference verifier
sha256sum verifrax-reference-verifier/verify.js
```

## Certificate reproducibility

Given identical:
- Evidence bundle content
- Bundle hash
- Profile ID
- Execution timestamp

The certificate hash will be identical.

## Non-reproducible elements

- Execution timestamp (by design)
- Payment session ID (external system)
- Network latency artifacts

## Verification without network

```bash
# Offline verification
node verifrax-reference-verifier/verify.js certificate.json
```

No network access required for certificate validation.
