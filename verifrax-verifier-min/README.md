# VERIFRAX Verifier Minimal

**Single binary verifier. No config. No network. No plugins.**

## Input

Evidence bundle (directory or zip)

## Output

- Verdict enum
- Verdict ID (VFXV1 format)
- Bundle hash
- Verdict hash

## Constraints

- No configuration files
- No network access
- No plugin system
- No external dependencies (beyond crypto)

## Usage

```bash
verifrax-verifier-min <bundle_path>
```

Outputs to stdout:
```
VERDICT: <verdict>
VERDICT_ID: <verdict_id>
BUNDLE_HASH: <bundle_hash>
VERDICT_HASH: <verdict_hash>
```

## Status

**TODO**: Compile to single binary (Go/Rust implementation recommended)

