# VERIFRAX Historical Release Snapshot v1

This directory preserves the historical v1 release-era material for VERIFRAX.

It exists to retain the earlier freeze-era release structure, archival release artifacts, and historical trace material associated with the v1 lineage surface.

This directory is preserved so that the repository state corresponding to the v1 release lineage can be reconstructed and audited without affecting the interpretation of the current protocol authority surfaces.

---

## Historical purpose

The `release-history/v1/` snapshot preserves repository material that was active or present during the v1-era repository structure.

This material is retained to support:

* reconstruction of earlier repository states
* inspection of historical release mechanics
* audit continuity across repository evolution
* verification of earlier release-bound artifacts
* long-horizon lineage traceability

The contents of this directory reflect the repository layout, release mechanics, and freeze surfaces that existed at the time the v1 release lineage was produced.

---

## Contents

This versioned historical snapshot may include preserved structures such as:

* freeze surfaces
* freeze archives
* earlier release-bound manifests
* historical release documentation
* earlier verifier execution artifacts
* preserved release-integrity material

Typical preserved directories may include:

```
freeze/
freeze-archive/
releases/
```

These directories reflect the repository layout used during the historical release lifecycle and are retained only to allow historical inspection.

---

## Genesis historical mirror

The v1 snapshot preserves a historical mirror of the canonical genesis root.

Historical mirror location:

```
release-history/v1/freeze/v2/releases/v2.3.0/GENESIS_HASH.txt
```

Canonical genesis root location:

```
index/GENESIS_HASH.txt
```

The historical mirror exists to preserve the repository state at the time the historical snapshot was created.

It must not be interpreted as defining a second genesis root.

The canonical genesis authority chain always resolves from the active repository surfaces:

```
index/GENESIS_HASH.txt
public/genesis/
release-integrity/genesis-lineage.json
```

---

## Active authority boundary

Current release authority does **not** resolve from this directory.

The active release-integrity authority surface is:

```
release-integrity/
```

The canonical freeze-surface declaration is:

```
release-integrity/freeze-surfaces.json
```

All active release-integrity interpretation must resolve from the `release-integrity/` directory rather than any historical snapshot.

---

## Relationship to the release-history root

`release-history/` is the historical container for versioned release snapshots.

Each versioned directory such as `release-history/v1/` represents a preserved repository state associated with a specific historical release lineage.

These directories exist so that earlier repository states remain inspectable without allowing them to become ambiguous with current protocol authority surfaces.

---

## Interpretation rule

The entire `release-history/v1/` directory must be interpreted as **historical lineage material only**.

It exists for:

* audit continuity
* historical repository reconstruction
* release lineage inspection
* verification of earlier repository states

It must **not** be used as the active source of:

* protocol semantics
* maintained verifier authority
* active conformance targets
* release-integrity authority
* freeze-surface declarations

Active repository authority always resolves from the canonical surfaces defined in:

```
AUTHORITY.md
```

---

## Maintainer guidance

Maintainers and auditors investigating historical releases should:

1. Use `release-history/v1/` to inspect the repository state corresponding to the v1 lineage.
2. Use `release-integrity/` to determine the current release-integrity authority surface.
3. Use `index/GENESIS_HASH.txt` to resolve the canonical genesis root.

Changes inside historical snapshots must never change the interpretation of active protocol authority.

---

## Operational consequence

A file located under `release-history/v1/` must never be treated as defining current VERIFRAX protocol authority unless explicitly reintroduced by a canonical active repository surface.
