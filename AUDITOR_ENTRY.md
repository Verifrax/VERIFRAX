# Auditor Entry Point

## What VERIFRAX Is

VERIFRAX is a deterministic verification system that executes one-time verification runs on digital evidence bundles. The system produces cryptographically verifiable, immutable certificates.

## What VERIFRAX Is NOT

- Not financial advice
- Not legal advice
- Not auditing
- Not escrow
- Not prediction
- Not advisory services

## Where Authority Lives

- **Specification:** `verifrax.net/spec`
- **Engine:** `Verifrax/VERIFRAX` (freeze commit: `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`)
- **Reference Verifier:** `Verifrax/VERIFRAX-verify` (tagged v2.4.0)

## How to Independently Verify a Certificate

1. Download reference verifier from `Verifrax/VERIFRAX-verify`
2. Run: `verify certificate.json`
3. Verifier confirms certificate hash matches bundle hash
4. No VERIFRAX infrastructure required

## Related Links

- `verifrax.net/spec` — Authoritative specification
- `Verifrax/VERIFRAX-verify` — Reference verifier
- `CHAIN_OF_CUSTODY_NOTE.md` — Chain of custody principle
- `MISINTERPRETATION_DEFENSE.md` — Invalid interpretations
- `EVIDENCE_FINALITY.md` — Evidence immutability
- `DOMAIN_FAILURE.md` — Domain failure scenario

