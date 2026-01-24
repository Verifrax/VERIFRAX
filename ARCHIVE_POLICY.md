# Archive Policy

## Retention

| Artifact | Retention | Location |
|----------|-----------|----------|
| Certificates | Permanent | Holder's responsibility |
| Engine snapshots | Permanent | `freeze/` directory |
| Reference verifier | Permanent | Repository |
| Git tags | Immutable | GitHub |

## VERIFRAX responsibility

VERIFRAX commits to:
- Maintaining frozen snapshots indefinitely
- Never deleting released tags
- Never modifying released artifacts

## VERIFRAX does NOT guarantee

- Hosting availability
- API endpoint persistence
- Domain name continuity
- Infrastructure uptime

## Certificate validity after infrastructure loss

Certificates remain valid if VERIFRAX:
- Goes offline
- Ceases operation
- Loses domain

Verification requires only:
- The certificate JSON
- The reference verifier (archived)
- SHA-256 implementation

## Archival recommendations

Certificate holders should:
1. Store certificate JSON locally
2. Archive reference verifier
3. Preserve evidence bundle
4. Document verification steps

## Version migration

No migration path exists between certificate versions.
Each certificate is self-contained and permanently valid per its version.
