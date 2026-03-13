# VERIFRAX Genesis Certificate

## Canonical genesis anchor

The canonical VERIFRAX genesis root is:

`sha256:bc0fcaa6ebc886345e1cc222aafcbfbf7bcbbe369e36431bab026238839626cb`

Authoritative file:

* `index/GENESIS_HASH.txt`

Historical mirror:

* `release-history/v1/freeze/v2/releases/v2.3.0/GENESIS_HASH.txt`

No other file defines the genesis root.

---

## Published genesis certificate

Executed at:

* `2026-01-24T12:21:29.434Z`

Published certificate:

* `public/genesis/certificate.json`

Recorded fields:

* `bundle_hash`: `6844deb82bb6806be4b70db7e97ef8c0e6a52d689e2dc51ee77fe810c34e21a8`
* `certificate_hash`: `d7c23b65887c0ef554555b231c59935f6e2717586b54a68da8dc49b0bc61731b`
* `certificate_version`: `1.1.0`
* `profile_id`: `public@1.0.0`
* `verdict`: `verified`
* `verifrax_version`: `2.8.0`

---

## Relationship between the genesis artifacts

The genesis authority chain is:

1. `index/GENESIS_HASH.txt`

   * immutable genesis root for the protocol lineage

2. `public/genesis/certificate.json`

   * public attestation for the first paid production execution

3. `release-integrity/genesis-lineage.json`

   * active lineage record tying the genesis lineage to the active release-integrity surface

4. `release-integrity/freeze-surfaces.json`

   * active declaration of frozen release-integrity surfaces

5. `release-integrity/release-sha256-manifest.json`

   * active hashed release manifest

---

## Important hash semantics

Three distinct hashes appear in the genesis chain and they are not interchangeable.

### Genesis hash

The genesis hash is the protocol root:

`sha256:bc0fcaa6ebc886345e1cc222aafcbfbf7bcbbe369e36431bab026238839626cb`

It is the only genesis anchor.

---

### Bundle hash

The bundle hash recorded in `public/genesis/certificate.json` is:

`6844deb82bb6806be4b70db7e97ef8c0e6a52d689e2dc51ee77fe810c34e21a8`

It refers to the evidence bundle bytes used for the first paid production execution.

---

### Certificate hash

The certificate hash recorded in `public/genesis/certificate.json` is:

`d7c23b65887c0ef554555b231c59935f6e2717586b54a68da8dc49b0bc61731b`

This value is **not** the raw SHA‑256 of the committed `certificate.json` file.

It is computed from the canonical certificate object **without** the `certificate_hash` field, using the verifier rule implemented in the repository execution and verification logic.

Canonical field order for hash derivation:

1. `verifrax_version`
2. `certificate_version`
3. `bundle_hash`
4. `profile_id`
5. `verdict`
6. `reason_codes`
7. `executed_at`

---

## Current repository publication boundary

The repository currently publishes:

* the canonical genesis root
* the public genesis certificate
* the human‑readable genesis documentation

The repository does **not** currently publish the exact genesis bundle bytes corresponding to:

`bundle_hash = 6844deb82bb6806be4b70db7e97ef8c0e6a52d689e2dc51ee77fe810c34e21a8`

That means the certificate can be checked for canonical certificate‑hash integrity from repository contents, but the recorded bundle hash cannot yet be recomputed from a canonical bundle artifact published in `public/genesis/`.

Until that exact bundle artifact is published, the repository genesis publication remains incomplete as a fully self‑contained bundle‑to‑certificate chain.

---

## Verification

Inspect the canonical genesis root:

```bash
cat index/GENESIS_HASH.txt
```

Inspect the public genesis certificate:

```bash
cat public/genesis/certificate.json
```

Verify certificate‑hash semantics against the canonical rule implemented by the verifier:

```bash
node - <<'NODE'
const fs = require("fs");
const crypto = require("crypto");

const cert = JSON.parse(fs.readFileSync("public/genesis/certificate.json", "utf8"));

const canonical = JSON.stringify({
  verifrax_version: cert.verifrax_version,
  certificate_version: cert.certificate_version,
  bundle_hash: cert.bundle_hash,
  profile_id: cert.profile_id,
  verdict: cert.verdict,
  reason_codes: cert.reason_codes,
  executed_at: cert.executed_at
});

const computed = crypto
  .createHash("sha256")
  .update(canonical, "utf8")
  .digest("hex");

console.log(JSON.stringify({
  recorded_certificate_hash: cert.certificate_hash,
  computed_certificate_hash: computed,
  matches: computed === cert.certificate_hash
}, null, 2));
NODE
```

Inspect the lineage record:

```bash
cat release-integrity/genesis-lineage.json
```

Inspect the active freeze declaration:

```bash
cat release-integrity/freeze-surfaces.json
```

Inspect the active release manifest:

```bash
cat release-integrity/release-sha256-manifest.json
```
