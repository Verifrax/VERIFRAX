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

---

## Production Deployment Attestation

### Deployment: 2026-01-24

**Worker Version ID**: `a8d0be87-7e81-4fa3-bc2d-659ed00df7c8`

**Endpoint**: `api.verifrax.net/*`

**Status**: LIVE

### Bug Fix Applied

- **Issue**: Worker canonical redirect logic redirected ALL non-www traffic, including `api.verifrax.net`
- **Root cause**: Line 798 in `worker.js` — condition `host !== CANONICAL` matched API subdomain
- **Fix**: Added `API_HOST` exception to bypass redirect for `api.verifrax.net`
- **Location**: `verifrax-freeze/v2.8.0/source/VERIFRAX/freeze/v2.8.0/worker.js`

### Verification

```
curl -i https://api.verifrax.net/
HTTP/2 200
x-payment-status: enabled
x-verifrax-version: 2.8.0
```

### Authority

- DNS: Cloudflare (verifrax.net zone)
- Worker: `verifrax-edge` bound to `api.verifrax.net/*`
- Payment: Stripe integration active
- Redirect rule: Apex only (`http.host eq "verifrax.net"`)

**This deployment is authoritative.**

