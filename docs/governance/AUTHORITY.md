# Authority

For complete authority scope, see [AUTHORITATIVE_SCOPE.md](AUTHORITATIVE_SCOPE.md).

## Summary

### Authoritative

- Verification engine (`verifrax-engine/`)
- Certificate JSON and hash
- Frozen release snapshots (`freeze/`)
- Reference verifier (`verifrax-reference-verifier/`)
- `AUTHORITATIVE_SCOPE.md`

### Not authoritative

- Presentation layer (HTML, CSS, UI)
- Translations and localization
- Marketing copy
- Infrastructure status
- Operator statements

## Conflict resolution

If conflict exists between any artifact and the cryptographic certificate, **the certificate prevails**.
