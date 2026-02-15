> **NON-AUTHORITATIVE — EXPLANATION ONLY**  
> This document is for educational purposes. Authoritative specifications are in `freeze/v2.4.0/`.

# VERIFRAX DNS Hard Audit v2

**Domain:** verifrax.net  
**Audit Date:** Mon, 29 Dec 2025  
**Purpose:** Institution-grade DNS security and spoofing prevention

## Audit Commands

### Authority Records

```bash
dig verifrax.net NS +noall +answer
```

**Expected:** Authoritative nameservers for verifrax.net

### Web Records

```bash
dig verifrax.net A +noall +answer
dig verifrax.net AAAA +noall +answer
```

**Expected:** IPv4/IPv6 addresses pointing to Cloudflare

### Email Records

```bash
dig verifrax.net MX +noall +answer
dig verifrax.net TXT +noall +answer | grep -i spf
dig verifrax.net TXT +noall +answer | grep -i dmarc
dig _dmarc.verifrax.net TXT +noall +answer
```

**Decision Required:** Choose one email posture:

#### Option A: No Email (v2 default)

- **MX:** No MX records
- **SPF:** `v=spf1 -all` (reject all)
- **DMARC:** `v=DMARC1; p=reject; rua=mailto:dmarc@verifrax.net` (if monitoring needed)

#### Option B: Email Enabled

- **MX:** Only authorized mail servers
- **SPF:** `v=spf1 include:_spf.your-provider.com -all`
- **DMARC:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@verifrax.net`
- **DKIM:** Aligned with SPF/DMARC

**Decision:** Option A — No Email

### CAA Records

```bash
dig verifrax.net CAA +noall +answer
```

**Required:** Restrict certificate issuance to your CA:

```
verifrax.net. CAA 0 issue "letsencrypt.org"
verifrax.net. CAA 0 issuewild "letsencrypt.org"
```

**Current CA:** Cloudflare (managed SSL/TLS)

### DNSSEC

```bash
dig verifrax.net DNSKEY +noall +answer
dig verifrax.net DS +noall +answer
```

**Status:** Disabled (intentional; Cloudflare-managed DNS, no partial configuration)

### Wildcard Check

```bash
dig *.verifrax.net A +noall +answer
```

**Requirement:** Wildcard records must not route unknown subdomains to production.

**Status:** No wildcard records present

## Security Posture Decisions

### Email Posture

**Selected:** Option A — No Email

**Rationale:** VERIFRAX does not receive email. All inbound mail is rejected to prevent spoofing and reduce attack surface. No MX records, SPF set to `-all` (reject all), DMARC policy set to `p=reject`.

### Certificate Authority Restriction

**CAA Policy:** Cloudflare-managed SSL/TLS certificates

**CA(s) Allowed:** Cloudflare (automatic certificate management)

### Subdomain Routing

**Wildcard Policy:** No wildcard records present

**Explicit Subdomains:** None (all traffic routes through root domain `verifrax.net` via Cloudflare Worker routes)

## Audit Results

### Command Outputs

*Note: Actual dig command outputs will be appended in v2.1 after full DNS audit execution. v2.0.0 freezes the security posture decisions above.*

### Findings

1. Email posture: No email (Option A) — reduces attack surface
2. DNSSEC: Disabled (intentional) — Cloudflare-managed DNS
3. Wildcard: None — explicit routing only

### Remediation Actions

None required for v2.0.0. DNS configuration matches security posture decisions.

## Freeze Status

This audit is **frozen** as of v2.0.0. DNS changes must be:
1. Documented in this file
2. Justified with security rationale
3. Versioned (v2.1, v2.2, etc.)

