# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.8.x   | :white_check_mark: |
| < 2.8   | :x:                |

## Reporting a Vulnerability

**Do not open public issues for security vulnerabilities.**

To report a security vulnerability, email: **security@verifrax.net**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 7 days
- **Resolution target**: Within 30 days for critical issues

## Scope

### In Scope

- Verification engine (`verifrax-engine/`)
- Certificate generation and validation
- Cloudflare Worker execution (`worker.js`)
- Cryptographic operations (hashing, signing)
- Payment flow security (Stripe integration)

### Out of Scope

- Third-party dependencies (report to upstream)
- Cloudflare infrastructure
- Stripe infrastructure
- Social engineering attacks
- Denial of service (unless causing data corruption)

## Security Model

VERIFRAX operates under these security invariants:

1. **Determinism**: Same input → same output, always
2. **Immutability**: Certificates cannot be modified post-issuance
3. **Independence**: Certificate validity does not depend on VERIFRAX infrastructure
4. **Single execution**: Each token permits exactly one execution

Breaking any of these invariants constitutes a critical vulnerability.

## Disclosure Policy

We follow coordinated disclosure:

1. Reporter submits vulnerability privately
2. We acknowledge and assess
3. We develop and test fix
4. We deploy fix
5. We credit reporter (unless anonymity requested)
6. We publish advisory after fix is deployed

## Recognition

Security researchers who responsibly disclose vulnerabilities will be acknowledged in our security advisories (with permission).
