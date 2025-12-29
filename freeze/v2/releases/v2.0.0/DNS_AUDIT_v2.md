# VERIFRAX DNS Hard Audit v2

**Domain:** verifrax.net  
**Audit Date:** 2025-01-XX  
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

#### Option A: No Email (Recommended for v2)

- **MX:** No MX records
- **SPF:** `v=spf1 -all` (reject all)
- **DMARC:** `v=DMARC1; p=reject; rua=mailto:dmarc@verifrax.net` (if monitoring needed)

#### Option B: Email Enabled

- **MX:** Only authorized mail servers
- **SPF:** `v=spf1 include:_spf.your-provider.com -all`
- **DMARC:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@verifrax.net`
- **DKIM:** Aligned with SPF/DMARC

**Decision:** [TO BE FILLED: Option A or B]

### CAA Records

```bash
dig verifrax.net CAA +noall +answer
```

**Required:** Restrict certificate issuance to your CA:

```
verifrax.net. CAA 0 issue "letsencrypt.org"
verifrax.net. CAA 0 issuewild "letsencrypt.org"
```

**Current CA:** [TO BE FILLED: e.g., Let's Encrypt, Cloudflare]

### DNSSEC

```bash
dig verifrax.net DNSKEY +noall +answer
dig verifrax.net DS +noall +answer
```

**Status:** [TO BE FILLED: Enabled/Disabled]

### Wildcard Check

```bash
dig *.verifrax.net A +noall +answer
```

**Requirement:** No wildcard record should route unknown subdomains to production.

**Status:** [TO BE FILLED: No wildcard / Wildcard exists]

## Security Posture Decisions

### Email Posture

**Selected:** [TO BE FILLED]

**Rationale:** [TO BE FILLED]

### Certificate Authority Restriction

**CAA Policy:** [TO BE FILLED]

**CA(s) Allowed:** [TO BE FILLED]

### Subdomain Routing

**Wildcard Policy:** [TO BE FILLED]

**Explicit Subdomains:** [TO BE FILLED: e.g., api.verifrax.net, www.verifrax.net]

## Audit Results

### Command Outputs

[TO BE FILLED: Paste actual dig command outputs]

### Findings

1. [TO BE FILLED]
2. [TO BE FILLED]
3. [TO BE FILLED]

### Remediation Actions

[TO BE FILLED: Any required DNS changes]

## Freeze Status

This audit is **frozen** as of v2.0.0. DNS changes must be:
1. Documented in this file
2. Justified with security rationale
3. Versioned (v2.1, v2.2, etc.)

