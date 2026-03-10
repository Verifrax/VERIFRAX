# Evidence Package Format

## Format (Read-Only)

Evidence Package is format-agnostic: ZIP, TAR, or directory.

## Required Contents

```
/
  certificate.v2.4.0.json
  bundle_hash.txt
  verifier_version.txt
  profile_id.txt
  SHA256SUMS.txt
  README.txt
```

## README.txt (Verbatim)

```
This package contains a VERIFRAX v2.4.0 verification result.
Verification is deterministic and final.
VERIFRAX provides no legal, financial, or advisory conclusions.
```

## Prohibited

- Logos
- Branding
- Interpretation text
- Marketing language
- Forward-looking statements

## Format Agnostic

Package may be:
- ZIP archive
- TAR archive
- Directory structure

Format does not affect authority. Contents are authoritative.

## Authority

Package contents are authoritative. Package format is not.

