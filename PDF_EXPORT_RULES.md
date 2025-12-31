# PDF Export Rules (Optional, Non-Authoritative)

## If PDF Generated

PDF must embed:
- Raw JSON certificate
- Hashes (bundle hash, certificate hash)
- Version information

## Required Statement (Verbatim)

```
This PDF is a rendering.
The JSON certificate is authoritative.
```

## PDF Authority

**PDF is NEVER authoritative.**

Only JSON certificate is authoritative.

## Prohibited

- PDF-only certificates
- PDF as authoritative source
- PDF without embedded JSON

## Validation

PDFs must:
- Embed raw JSON
- Embed hashes
- State non-authoritative status
- Reference JSON as authoritative

## Usage

PDFs are for human readability only. They are not authoritative.

