# Authority

For complete authority scope, see [AUTHORITATIVE_SCOPE.md](AUTHORITATIVE_SCOPE.md).

## Summary

### Authoritative

- Verification engine (`verifrax-engine/`)
- Certificate JSON and hash
- Frozen release snapshots (`release-integrity/freeze-surfaces.json`)
- Reference verifier (`verifier/node/`)
- `AUTHORITATIVE_SCOPE.md`

### Not authoritative

- Presentation layer (HTML, CSS, UI)
- Translations and localization
- Marketing copy
- Infrastructure status
- Operator statements

## Conflict resolution

If conflict exists between any artifact and the cryptographic certificate, **the certificate prevails**.

## Repository Authority Resolution

Active repository authority resolution is defined by `AUTHORITY.md`.

Within the governance surface, active repository interpretation resolves through the following repository surfaces:

- VERIFRAX authors normative source material.
- VERIFRAX-SPEC publishes derived specification artifacts from VERIFRAX.
- Derived specification artifacts are not upstream repository authority.
- Governance authority is external and bound through AUCTORISEAL plus the governed repo set in `.github`.

- normative specification: `docs/spec/`
- conformance authority: `protocol-conformance/`
- active maintained verifier surfaces: `verifier/node`, `verifier/rust`
- active release freeze authority: `release-integrity/freeze-surfaces.json`
- maintained registry surface: `registry/`
- maintained index surface: `index/`

Historical materials under `archive/` and `release-history/` do not define active protocol authority unless explicitly re-designated by a repository surface.

Derived publication surfaces, including VERIFRAX-SPEC, do not define active upstream repository authority.

