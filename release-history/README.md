# VERIFRAX Release History

This directory preserves historical release materials for VERIFRAX.

It exists to retain lineage continuity, audit traceability, and earlier release-era repository surfaces without allowing historical materials to remain ambiguous with active repository authority.

This directory is historical only.

---

## Purpose

`release-history/` preserves historical repository surfaces that were once active during earlier protocol or repository release states.

These materials are retained so that:

* earlier repository states can be reconstructed
* protocol evolution remains auditable
* historical release boundaries remain inspectable
* previous freeze-era artifacts remain accessible
* long-horizon verification history can be preserved

The presence of a file inside `release-history/` does not imply that it remains active protocol authority.

---

## Active authority boundary

The active release-integrity authority surface is located at:

```
release-integrity/
```

The canonical declaration of frozen repository release surfaces is:

```
release-integrity/freeze-surfaces.json
```

All current release verification logic, manifests, and freeze declarations resolve from the active `release-integrity/` surface.

Historical freeze-era material inside `release-history/` must never be interpreted as the active source of release authority.

---

## Genesis historical mirror

A preserved mirror of the canonical genesis root exists in historical release material.

Historical mirror:

```
release-history/v1/freeze/v2/releases/v2.3.0/GENESIS_HASH.txt
```

Canonical genesis root:

```
index/GENESIS_HASH.txt
```

The historical mirror exists only to preserve the state of the repository at the time the release snapshot was created.

It must not be interpreted as defining a second genesis root.

The canonical genesis authority chain always resolves from:

```
index/GENESIS_HASH.txt
public/genesis/
release-integrity/genesis-lineage.json
```

---

## Versioned historical layout

Historical materials are preserved under versioned subdirectories such as:

```
release-history/v1/
```

Each versioned directory may contain a preserved snapshot of earlier repository structures, including:

* freeze surfaces
* release manifests
* verifier artifacts
* protocol conformance material
* historical registry records
* archived release documentation

These structures reflect the repository layout and release mechanics at the time the release snapshot was captured.

They are retained so that earlier releases remain reconstructable and verifiable.

---

## Freeze-era historical structures

Freeze-era material may appear inside historical snapshots under paths such as:

```
release-history/v1/freeze/
release-history/v1/freeze/v2/
release-history/v1/freeze-archive/
```

These directories may contain preserved artifacts such as:

* freeze manifests
* release-bound integrity declarations
* historical verification transcripts
* archived release-bound evidence

They represent earlier repository freeze mechanisms that have since been replaced by the active `release-integrity/` surface.

---

## Relationship to archive

`release-history/` and `archive/` serve different purposes.

`release-history/` preserves **historical release states** of the repository.

`archive/` preserves **superseded or deprecated repository material** that is not tied to a specific release snapshot.

Both directories are historical surfaces and do not define active protocol authority.

---

## Interpretation rule

The entire `release-history/` directory must be interpreted as historical lineage material.

It exists for:

* audit continuity
* lineage inspection
* repository reconstruction
* verification of earlier release states

It does **not** define:

* active protocol semantics
* active conformance authority
* maintained verifier execution surfaces
* active release-integrity manifests
* active freeze declarations

Active protocol authority resolves only from the canonical repository surfaces defined in:

```
AUTHORITY.md
```

---

## Maintainer guidance

Maintainers and auditors should treat this directory as a preserved record of repository evolution.

When investigating historical releases:

* use `release-history/` to reconstruct the repository state at the time of the historical release
* use `release-integrity/` to determine the active release-integrity authority surface

No modification inside `release-history/` should change the interpretation of active protocol semantics.

---

## Operational consequence

A file located under `release-history/` must never be treated as defining current VERIFRAX protocol authority unless explicitly reintroduced by a canonical active repository surface.
