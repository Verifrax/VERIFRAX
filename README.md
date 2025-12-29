# VERIFRAX

VERIFRAX is a deterministic verification system that produces final, reproducible verdicts for evidence bundles.

## Current Stable Version
- **v2.0.0** (tagged, frozen)

## Active Surfaces
- `/api/upload` — Worker-proxied R2 ingestion
- Deterministic verification engine
- Frozen governance and bundle specifications

## What This Repo Is NOT
- Not a blockchain
- Not a storage service
- Not a prediction system
- Not a human review platform

## Trust Boundary
Only artifacts under `freeze/v2/releases/` are considered authoritative.

## Authoritative Documentation
- `docs/V2_EDGE_API.md` — API specification
- `docs/DNS_AUDIT_v2.md` — DNS security audit
- `docs/GOVERNANCE_DISPUTE_FINALITY.md` — Dispute protocol
- `docs/GOVERNANCE_VERSION_FINALITY.md` — Version guarantees
- `docs/EVIDENCE_BUNDLE_SPEC_v1.md` — Bundle specification
- `docs/PRICING_RISK_TIERS.md` — Pricing structure

## Architecture
- **Worker:** `workers/verifrax-edge/` — Cloudflare Worker (R2 upload rail)
- **Core Engine:** `core/` — Deterministic verification engine
- **Frozen Release:** `freeze/v2/releases/v2.0.0/` — Immutable v2.0.0 snapshot

## Archived
- `archive/engines/` — Historical engines (not part of v2 trusted computing base)
- `docs/_graveyard/` — Non-authoritative documentation
