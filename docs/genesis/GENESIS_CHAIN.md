# VERIFRAX Genesis Chain

## Purpose

This document defines the canonical genesis authority chain for the VERIFRAX protocol repository.

The goal of this file is to provide a human-readable map of the genesis authority surfaces and to clearly separate:

* the immutable protocol genesis root
* the public attestation artifacts
* the release-integrity lineage pointers
* historical mirrors preserved only for audit continuity

This file does not introduce new authority. It documents the existing authority surfaces defined elsewhere in the repository.

---

# Authority Chain

The active genesis authority chain inside the repository is defined by the following surfaces.

```
index/GENESIS_HASH.txt
        ↓
public/genesis/certificate.json
        ↓
release-integrity/genesis-lineage.json
        ↓
release-integrity/freeze-surfaces.json
        ↓
release-integrity/release-sha256-manifest.json
```

Each element plays a distinct role.

---

# 1 — Genesis Root

Path:

```
index/GENESIS_HASH.txt
```

Canonical value:

```
sha256:bc0fcaa6ebc886345e1cc222aafcbfbf7bcbbe369e36431bab026238839626cb
```

This value is the immutable genesis root for the VERIFRAX protocol lineage.

Properties:

* exactly one genesis root exists
* it must never change
* it must never be replaced
* no alternative genesis value may appear in the repository

The genesis root represents the starting anchor of the entire verification protocol lineage.

---

# 2 — Genesis Certificate

Path:

```
public/genesis/certificate.json
```

This file publishes the attestation for the first paid production execution of the VERIFRAX verifier.

Key fields:

* `bundle_hash`
* `certificate_hash`
* `certificate_version`
* `profile_id`
* `verdict`
* `reason_codes`
* `executed_at`

The certificate proves that a specific evidence bundle was evaluated and verified under the declared verification profile.

Important distinction:

The certificate **does not define the genesis root**.

The certificate attests to a verification execution that occurred after the genesis root was already defined.

---

# 3 — Genesis Lineage Record

Path:

```
release-integrity/genesis-lineage.json
```

This file binds the genesis root to the active release-integrity surface.

Responsibilities:

* identifies the genesis protocol lineage
* binds the genesis root to the current release manifest
* ensures the genesis root remains the origin for the active repository release lineage

This file allows future releases to trace their lineage back to the genesis anchor.

---

# 4 — Freeze Surfaces Declaration

Path:

```
release-integrity/freeze-surfaces.json
```

This file defines which repository surfaces are frozen for a given release.

Examples of frozen surfaces include:

* protocol conformance data
* reference verifiers
* release manifests
* release-integrity records

Freeze surfaces ensure that once a release is finalized, the corresponding verification artifacts remain immutable.

---

# 5 — Release SHA256 Manifest

Path:

```
release-integrity/release-sha256-manifest.json
```

This manifest lists the SHA‑256 hashes of all files included in the active release surface.

Purpose:

* guarantees byte‑level integrity of release artifacts
* ensures the repository release can be independently verified
* allows deterministic validation of release contents

The manifest is the cryptographic integrity layer for the repository release.

---

# Hash Semantics

Three hashes appear in the genesis chain and they must not be confused.

---

## Genesis Hash

Defined in:

```
index/GENESIS_HASH.txt
```

Meaning:

The immutable protocol lineage root.

This value is the unique genesis identifier for VERIFRAX.

---

## Bundle Hash

Defined in:

```
public/genesis/certificate.json
```

Value:

```
6844deb82bb6806be4b70db7e97ef8c0e6a52d689e2dc51ee77fe810c34e21a8
```

Meaning:

The SHA‑256 hash of the evidence bundle that was evaluated during the first paid production execution.

The bundle itself contains the structured evidence evaluated by the verifier.

---

## Certificate Hash

Defined in:

```
public/genesis/certificate.json
```

Value:

```
d7c23b65887c0ef554555b231c59935f6e2717586b54a68da8dc49b0bc61731b
```

Meaning:

The SHA‑256 hash of the canonical certificate object.

Important:

The certificate hash **is not** the raw SHA‑256 hash of the `certificate.json` file.

It is derived from the canonical certificate object **without the `certificate_hash` field**.

Canonical field order used for hashing:

1. `verifrax_version`
2. `certificate_version`
3. `bundle_hash`
4. `profile_id`
5. `verdict`
6. `reason_codes`
7. `executed_at`

This ensures deterministic certificate identity independent of file formatting.

---

# Historical Mirrors

Historical mirrors of the genesis root exist only for archival purposes.

Example mirror:

```
release-history/v1/freeze/v2/releases/v2.3.0/GENESIS_HASH.txt
```

These files exist to preserve the historical release environment.

They **must never** be interpreted as alternative genesis definitions.

The authoritative genesis root always resolves from:

```
index/GENESIS_HASH.txt
```

---

# Current Repository Publication State

The repository currently publishes:

* the canonical genesis root
* the public genesis certificate
* lineage records
* release-integrity declarations

However, the repository currently **does not publish the exact genesis evidence bundle** whose SHA‑256 equals the recorded bundle hash.

Recorded bundle hash:

```
6844deb82bb6806be4b70db7e97ef8c0e6a52d689e2dc51ee77fe810c34e21a8
```

As a consequence:

* the certificate structure is verifiable
* the certificate hash is reproducible
* the genesis root is authoritative

But the bundle-to-certificate chain cannot yet be recomputed from repository artifacts alone.

This condition reflects an incomplete public publication of the genesis evidence bundle.

---

# Interpretation Boundary

Only the following repository surfaces define genesis semantics:

```
index/GENESIS_HASH.txt
public/genesis/
release-integrity/genesis-lineage.json
```

All other files that reference genesis material exist for documentation, tooling, or historical purposes.

They must not redefine or override the canonical genesis root.

---

# Governance Principle

VERIFRAX enforces a strict rule:

```
One protocol lineage → one immutable genesis root
```

A new genesis root would require:

* a separate protocol lineage
* a separate repository lineage

This rule ensures that the verification protocol remains cryptographically anchored to a single immutable origin.

---

# Summary

The VERIFRAX genesis chain is a layered authority structure.

At its foundation lies the immutable genesis root.

Above that root sit the public certificate, the lineage record, and the release integrity surfaces.

Together they ensure that:

* the protocol origin is immutable
* verification executions are publicly attestable
* repository releases are cryptographically reproducible
* historical records remain auditable without redefining authority.
