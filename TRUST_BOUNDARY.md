# Trust Boundary

## Trusted components

| Component | Trust basis |
|-----------|-------------|
| Cloudflare Workers | Infrastructure provider |
| Stripe | Payment processor |
| SHA-256 | Cryptographic standard |
| Frozen engine | Immutable, hash-verified |

## Untrusted components

| Component | Handling |
|-----------|----------|
| Evidence bundle | Hash-recorded, not content-validated |
| User claims | Recorded as-is |
| Network requests | TLS only |

## Attack surface

- Malformed bundle → Rejected at upload
- Hash collision → Cryptographically infeasible
- Tampered certificate → Self-verification fails
- Replay attack → Token single-use
- Payment fraud → Stripe's responsibility

## What VERIFRAX does NOT protect against

- False content in evidence bundle
- Incorrect user input
- Pre-submission data manipulation
- Social engineering
- Legal misinterpretation of certificate
