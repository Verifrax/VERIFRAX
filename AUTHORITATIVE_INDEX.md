# Authoritative Index

## This repository

VERIFRAX is the **authoritative source** for:
- Evidence bundle verification
- Certificate generation
- Verification engine logic
- Certificate schema

## Authoritative files

| File | Authority |
|------|-----------|
| `verifrax-engine/execute_v2_6_0.js` | Execution engine |
| `verifrax-reference-verifier/` | Offline verification |
| `verifrax-freeze/` | Frozen snapshots |
| `CERTIFICATE_SCHEMA.json` | Certificate structure |
| `AUTHORITATIVE_SCOPE.md` | Authority boundaries |
| `CANONICAL.md` | Scope and purpose |
| `ADVERSARIAL_FAQ.md` | Misinterpretation corrections |

## Related systems

| System | Relationship |
|--------|--------------|
| MK10-PRO | Upstream MTB definitions |
| CICULLIS | Policy enforcement |
| speedkit.eu | Discovery index |

## Non-authoritative

- `docs/` (informational only)
- UI/presentation layer
- Marketing text
- README prose

## Verification

```bash
# Verify build hashes
./BUILD_REPRODUCE.sh

# Verify certificate against schema
# (requires JSON schema validator)
```

## Live endpoint

https://api.verifrax.net — Production execution
