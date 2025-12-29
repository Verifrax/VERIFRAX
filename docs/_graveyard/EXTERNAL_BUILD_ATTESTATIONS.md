# External Build Attestations

**Third-Party Attested Builds**

## Requirement

Two independent external builders must:
- Build `verifrax-verifier-min`
- Publish binary hash + statement
- Attest to reproducibility

## Builder 1: [TBD]

**Organization**: [TBD]  
**Builder**: [TBD]  
**Date**: [TBD]

### Build Statement

```
I, [BUILDER NAME], attest that I built verifrax-verifier-min
from source commit [COMMIT] on [DATE] using [ENVIRONMENT].

Binary Hashes:
- Linux: sha256:[HASH]
- macOS: sha256:[HASH]
- Windows: sha256:[HASH]

These hashes match the expected hashes in build.provenance.json.

[Signature]
```

### Binary Hashes

- **Linux**: `sha256:TBD`
- **macOS**: `sha256:TBD`
- **Windows**: `sha256:TBD`

## Builder 2: [TBD]

**Organization**: [TBD]  
**Builder**: [TBD]  
**Date**: [TBD]

### Build Statement

```
I, [BUILDER NAME], attest that I built verifrax-verifier-min
from source commit [COMMIT] on [DATE] using [ENVIRONMENT].

Binary Hashes:
- Linux: sha256:[HASH]
- macOS: sha256:[HASH]
- Windows: sha256:[HASH]

These hashes match the expected hashes in build.provenance.json.

[Signature]
```

### Binary Hashes

- **Linux**: `sha256:TBD`
- **macOS**: `sha256:TBD`
- **Windows**: `sha256:TBD`

## Reproducibility Verification

Both builders must produce identical hashes for each platform.

## Status

**TODO**: Obtain two independent external builders

---

**External attestation removes single point of trust.**

