## Authority Boundary

The following paths are authoritative and immutable:

- release-integrity/freeze-surfaces.jsonv2.6.0/**
- verifrax-engine/execute_v2_6_0.js
- verifier/node/src/verify_v2_6_0.js
- SYSTEM_IDENTITY.*
- BUILD_HASH.txt

All other paths are mutable runtime.

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

