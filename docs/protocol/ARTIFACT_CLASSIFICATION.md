# VERIFRAX Artifact Classification

**Purpose:** classify repository artifacts by whether they are required for active verification authority, governance/context, or historical/internal preservation.

**Interpretation rule:** active repository authority is defined by `AUTHORITY.md`. If this classification and `AUTHORITY.md` appear to differ, `AUTHORITY.md` prevails.

---

## (1) ACTIVE VERIFICATION AUTHORITY

**Definition:** artifacts that belong to the currently maintained repository authority path for normative protocol interpretation, maintained verifier execution, conformance, release-integrity, registry, and deterministic audit navigation.

### Canonical active roots

- `AUTHORITY.md`
- `docs/spec/`
- `protocol-conformance/`
- `verifier/node/`
- `verifier/rust/`
- `release-integrity/`
- `registry/`
- `index/`

### Active verification-result and evidence-root surfaces

- `verification/results/current/`
- `verification/results/history/`
- `evidence/`
- `README.md` when used to state the current repository boundary and public-role separation

### Active maintained-verifier statements

- any document that explicitly names `verifier/node` and `verifier/rust` as the only maintained verifier surfaces
- conformance and release-integrity material that resolves through active maintained verifier paths

---

## (2) GOVERNANCE / EXPLANATORY / SUPPORT

**Definition:** artifacts that help readers, implementers, auditors, or operators understand the repository, but do not themselves outrank the active authority path.

Examples include:

- `docs/ecosystem/`
- explanatory READMEs outside canonical active roots
- governance notes
- compatibility notes
- process documentation
- reproduction instructions
- release explanations
- host/repo separation guidance

These materials may explain active surfaces, but they do not replace them.

---

## (3) HISTORICAL / ARCHIVE / INTERNAL

**Definition:** artifacts preserved for lineage, audit continuity, historical re-reading, or internal doctrine that must not be interpreted as current maintained repository authority.

Includes:

- `archive/`
- `release-history/`
- superseded verifier-era directories and references
- frozen historical snapshots
- generated outputs
- temporary build material
- internal doctrine, contingency, or planning material
- `node_modules/`, local caches, and tool output
- archived verifier names such as `verifrax-reference-verifier` and `verifrax-verifier-min` when preserved only for history

---

## Hard rule

Historical or archived verifier material must never be read as current maintained verifier authority.

The only active maintained verifier directories are:

- `verifier/node`
- `verifier/rust`

---

## Summary

For active repository interpretation, use:

- `AUTHORITY.md`
- `docs/spec/`
- `protocol-conformance/`
- `release-integrity/`
- `registry/`
- `index/`
- `verifier/node`
- `verifier/rust`

Anything outside that active path is explanatory, historical, or internal unless explicitly re-designated by a canonical active surface.
