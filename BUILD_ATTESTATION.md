# Build Attestation

**Reproducible Build Proof**

## Requirement

Two independent machines must reproduce identical verifier hash.

## Build Environment

- **Compiler**: Rust stable (version pinned)
- **Target**: Deterministic builds with `RUSTFLAGS="-C link-arg=-fuse-ld=lld"`
- **Reproducibility**: Enabled via `Cargo.lock` and deterministic linker

## Build Command

```bash
cargo build --release --target <target>
```

## Expected Hashes

### Linux (x86_64-unknown-linux-gnu)
- **Binary**: `verifrax-verifier-min-linux`
- **Expected Hash**: `sha256:...` (to be computed)

### macOS (x86_64-apple-darwin)
- **Binary**: `verifrax-verifier-min-macos`
- **Expected Hash**: `sha256:...` (to be computed)

### Windows (x86_64-pc-windows-msvc)
- **Binary**: `verifrax-verifier-min-windows.exe`
- **Expected Hash**: `sha256:...` (to be computed)

## Verification

1. Build on Machine A
2. Build on Machine B (independent)
3. Compare SHA-256 hashes
4. Hashes must match byte-for-byte

## Build Provenance

See `build.provenance.json` for complete build provenance.

---

**Reproducibility is REQUIRED for finality.**

