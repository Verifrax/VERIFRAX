# VERIFRAX Freeze Compatibility Surface

This directory exists only as a compatibility mirror for legacy repository enforcement, historical workflow expectations, and earlier freeze-surface path assumptions.

It must not be interpreted as the canonical active release‑integrity authority of the repository.

---

## Purpose

Earlier VERIFRAX repository layouts exposed freeze metadata directly under a `freeze/` directory.

Several historical workflows, CI guards, external audits, and archival tooling referenced that path directly. When the repository was reorganized to introduce a dedicated release‑integrity layer, the canonical freeze authority moved.

However, removing the path entirely would break:

* historical CI expectations
* older repository enforcement checks
* archival verification scripts
* third‑party tooling referencing the legacy freeze location

For that reason this directory is retained as a **compatibility surface only**.

---

## Active freeze authority

The **only canonical freeze authority** for active releases is defined in:

```
release-integrity/freeze-surfaces.json
```

That file defines the authoritative freeze‑surface declaration for the repository and must be used for all protocol‑level release verification.

---

## Compatibility artifact

The file retained here:

```
freeze/FREEZE_SURFACE_MANIFEST.json
```

exists strictly as a compatibility mirror so that historical tooling can resolve a freeze‑manifest path without re‑activating the legacy repository layout.

This file should be treated as:

* a mirror
* a compatibility artifact
* non‑authoritative metadata

It must **never override** the canonical release‑integrity declaration.

---

## Repository authority rule

Repository authority resolution is defined by:

```
AUTHORITY.md
```

According to that document:

* `release-integrity/` defines active release integrity
* `freeze/` exists only for compatibility

Any interpretation that attempts to treat this directory as an active authority surface is incorrect.

---

## Historical lineage

Historical freeze‑era material is preserved under:

```
release-history/
```

This includes earlier repository states, historical freeze manifests, and archival release snapshots used for audit continuity.

These materials remain preserved for:

* reproducibility research
* audit reconstruction
* historical lineage inspection

They are not part of the active protocol authority surface.

---

## Security interpretation

When evaluating repository integrity:

1. resolve repository authority through `AUTHORITY.md`
2. resolve release freeze authority through `release-integrity/`
3. treat `freeze/` as compatibility only

Failure to follow this resolution order may lead to incorrect interpretation of repository authority.

---

## Summary

* Active freeze authority lives in `release-integrity/`.
* This directory exists only for compatibility with historical tooling.
* The file `FREEZE_SURFACE_MANIFEST.json` must not be interpreted as canonical protocol authority.

This compatibility surface exists to preserve long‑horizon repository stability without re‑introducing legacy authority ambiguity.
