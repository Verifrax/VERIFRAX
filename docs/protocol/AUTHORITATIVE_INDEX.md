# Authoritative Index

## This repository

VERIFRAX is the authoritative repository boundary for:

- normative protocol specification under `docs/spec/`
- maintained conformance under `protocol-conformance/`
- maintained verifier implementations under `verifier/`
- active release-integrity metadata under `release-integrity/`
- registry and index surfaces used for deterministic repository interpretation

Repository authority must be read through `AUTHORITY.md`.

## Canonical active surfaces

| Surface | Authority |
|------|-----------|
| `AUTHORITY.md` | repository authority map |
| `docs/spec/` | normative protocol semantics |
| `protocol-conformance/` | maintained conformance authority |
| `verifier/node` | maintained Node verifier |
| `verifier/rust` | maintained Rust verifier |
| `release-integrity/` | active release-integrity authority |
| `registry/` | maintained registry declarations |
| `index/` | maintained repository index surfaces |

## Historical and non-authority surfaces

The following are not active repository authority unless a canonical active surface explicitly re-designates them:

- `archive/`
- `release-history/`
- superseded verifier-era directories
- frozen historical snapshots retained for lineage
- generated outputs
- explanatory prose outside declared active authority surfaces

## Maintained verifier rule

The only active maintained verifier directories in this repository are:

- `verifier/node`
- `verifier/rust`

Archived or historical verifier material must not be treated as current implementation authority.

## Verification

```bash
./docs/operations/BUILD_REPRODUCE.sh
```

