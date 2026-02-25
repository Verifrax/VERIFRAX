# VERIFRAX Reference Verifier Interface — v2.7.0

**Version:** 2.6.0  
**Purpose:** Define exact CLI interface for independent certificate verification

---

## CLI Interface

### Command

```bash
node cli.js --certificate <path> --bundle <path> --profile <profile_id>
```

### Required Arguments

- `--certificate <path>` — Path to certificate JSON file
- `--bundle <path>` — Path to evidence bundle binary file
- `--profile <profile_id>` — Verification profile identifier (e.g., `public@1.0.0`)

### Output

**Valid Certificate:**
```
VALID
```

**Invalid Certificate:**
```
INVALID
```

No logs. No extra text. No JSON. Only `VALID` or `INVALID` to stdout.

### Exit Codes

- `0` — Certificate is VALID
- `1` — Certificate is INVALID or error occurred

---

## Verification Steps (Order Is Law)

The verifier performs these steps **exactly, in order**:

1. **Read certificate bytes as-is**
   - Load certificate file
   - Parse JSON
   - Validate structure (must have all 8 required fields)

2. **Recompute `certificate_hash` from canonical rules**
   - Extract `certificate_hash` from certificate
   - Build certificate object with all fields **except** `certificate_hash`
   - Serialize to canonical JSON (following `CANONICALIZATION.md` rules)
   - Compute SHA-256 hash of UTF-8 encoded string
   - Encode as 64-character lowercase hexadecimal (no prefix)
   - Compare with certificate's `certificate_hash`
   - **If mismatch → INVALID**

3. **Recompute `bundle_hash` from bundle bytes**
   - Read bundle file as binary
   - Compute SHA-256 hash
   - Encode as 64-character lowercase hexadecimal (no prefix)
   - Compare with certificate's `bundle_hash`
   - **If mismatch → INVALID**

4. **Check `profile_id` equality**
   - Compare provided `--profile` argument with certificate's `profile_id`
   - **If mismatch → INVALID**

5. **Re-run deterministic verification logic**
   - Execute verification algorithm using:
     - Bundle bytes
     - Profile identifier
     - Verifier version (from `verifrax_version`)
   - Compare computed `verdict` with certificate's `verdict`
   - Compare computed `reason_codes` with certificate's `reason_codes`
   - **If mismatch → INVALID**

6. **If all checks pass → VALID**

---

## No Shortcuts

- No caching
- No tolerance for mismatches
- No network calls
- No external dependencies (beyond standard library)
- No interpretation — exact byte comparison only

---

## Certificate Schema

The verifier expects certificates conforming to `CERTIFICATE_SCHEMA.json`:

- `verifrax_version` (string)
- `certificate_version` (string)
- `bundle_hash` (64 hex chars, no prefix)
- `profile_id` (string, pattern: `^[a-z_]+@[0-9]+\.[0-9]+\.[0-9]+$`)
- `verdict` (enum: `"verified"` | `"not_verified"`)
- `reason_codes` (array of strings)
- `executed_at` (RFC3339 with millisecond precision, UTC)
- `certificate_hash` (64 hex chars, no prefix)

---

## Example Usage

```bash
# Valid certificate
$ node cli.js --certificate test/certificate.sample.json --bundle test/bundle.bin --profile public@1.0.0
VALID

# Invalid certificate (tampered)
$ node cli.js --certificate test/certificate.tampered.json --bundle test/bundle.bin --profile public@1.0.0
INVALID
```

---

**END OF INTERFACE SPECIFICATION**

