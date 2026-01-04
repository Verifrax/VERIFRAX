# VERIFRAX v2.7.0 TLS Troubleshooting Guide

**Version:** v2.7.0  
**Purpose:** Diagnose and fix TLS/HTTPS connectivity issues

---

## QUICK DIAGNOSIS

### Step 1: Manual Ground Truth Check

```bash
# Check bare domain
curl -I https://verifrax.net/

# Check www subdomain
curl -I https://www.verifrax.net/
```

**What to look for:**
- ✅ TLS handshake succeeds (no SSL errors)
- ✅ HTTP status: `200`, `301`, or `302` (all are valid)
- ✅ HTTP version: `HTTP/1.1` or `HTTP/2` (both are valid)
- ✅ Server header: `server: cloudflare`

**If you see SSL errors, proceed to Hard Failure Cases below.**

---

## HARD FAILURE CASES

### A. SSL Certificate Problem

**Symptoms:**
```
curl: (60) SSL certificate problem: ...
```

**Causes & Fixes:**

1. **Cloudflare SSL Mode is "Flexible"**
   - **Fix:** Cloudflare Dashboard → SSL/TLS → Overview → Set to "Full" or "Full (strict)"
   - **Why:** Flexible mode only encrypts Cloudflare ↔ Browser, not Cloudflare ↔ Origin

2. **Missing Edge Certificate**
   - **Fix:** Cloudflare → SSL/TLS → Edge Certificates → Verify cert exists for `verifrax.net` and `www.verifrax.net`
   - **Why:** Cloudflare must have a valid certificate to terminate TLS

3. **Certificate Not Activated**
   - **Fix:** Cloudflare → SSL/TLS → Edge Certificates → Activate certificate
   - **Why:** Certificates must be active to serve traffic

### B. DNS Configuration Problem

**Symptoms:**
```
curl: (6) Could not resolve host: verifrax.net
```

**Causes & Fixes:**

1. **Wrong DNS Record Type**
   - **Fix:** Use `A` or `AAAA` records with Cloudflare proxy (orange cloud ON)
   - **Why:** Workers need proxied DNS records, not direct IPs

2. **Grey Cloud (DNS Only)**
   - **Fix:** Enable Cloudflare proxy (orange cloud) in DNS settings
   - **Why:** Workers require proxied traffic to function

3. **Missing DNS Records**
   - **Fix:** Add `A` record for `verifrax.net` and `CNAME` for `www.verifrax.net`
   - **Why:** DNS must resolve to Cloudflare for Workers to work

### C. Connection Timeout

**Symptoms:**
```
curl: (28) Connection timeout
```

**Causes & Fixes:**

1. **Worker Not Deployed**
   - **Fix:** Deploy Worker via `wrangler deploy`
   - **Why:** No Worker = no response

2. **Worker Route Not Configured**
   - **Fix:** Cloudflare Dashboard → Workers & Pages → Routes → Add route for `verifrax.net/*`
   - **Why:** Routes must be configured to route traffic to Worker

3. **Firewall Blocking**
   - **Fix:** Check Cloudflare Firewall rules, check origin firewall
   - **Why:** Firewall may be blocking legitimate traffic

---

## SCRIPT ACCEPTANCE CRITERIA

### What "Accessible" Actually Means

The deployment verification script accepts:

- **HTTP versions:** `HTTP/1.1` or `HTTP/2` (both valid)
- **Status codes:** `200`, `301`, `302` (all valid)
- **Redirects:** Acceptable (301/302 are valid perimeter behavior)

**Why this is correct:**
- Accessibility ≠ final landing page
- Redirects are acceptable perimeter behavior
- We validate **reachability**, not UX

### Script Check Pattern

```bash
# Correct check (accepts HTTP/1.1 or HTTP/2, and 200/301/302)
curl -I https://verifrax.net/ -s | grep -Eq 'HTTP/(1.1|2) (200|301|302)'

# Incorrect check (too narrow - only HTTP/2 200)
curl -I https://verifrax.net/ -s | grep -q 'HTTP/2 200'
```

---

## CLOUDFLARE-SPECIFIC BEHAVIOR

### Common Response Patterns

1. **Bare Domain → www Redirect**
   ```
   HTTP/2 301
   Location: https://www.verifrax.net/
   ```

2. **www → Final Destination**
   ```
   HTTP/2 200
   server: cloudflare
   ```

3. **HTTP/1.1 Fallback**
   ```
   HTTP/1.1 200
   server: cloudflare
   ```

**All of these are valid and acceptable.**

---

## VERIFICATION COMMANDS

### Test TLS Handshake

```bash
# Test TLS only (no HTTP)
openssl s_client -connect verifrax.net:443 -servername verifrax.net

# Check certificate chain
openssl s_client -connect verifrax.net:443 -servername verifrax.net | openssl x509 -noout -text
```

### Test HTTP Response

```bash
# Verbose output (see all headers)
curl -vI https://verifrax.net/

# Check specific header
curl -I https://verifrax.net/ | grep -i server

# Check redirect chain
curl -IL https://verifrax.net/
```

### Test DNS Resolution

```bash
# Check A record
dig verifrax.net +short A

# Check AAAA record
dig verifrax.net +short AAAA

# Check if proxied (should show Cloudflare IPs)
dig verifrax.net +short
```

---

## CLOUDFLARE DASHBOARD CHECKS

### SSL/TLS Settings

1. **SSL/TLS → Overview**
   - Mode: **Full** or **Full (strict)** (not Flexible)

2. **SSL/TLS → Edge Certificates**
   - Certificate exists for `verifrax.net`
   - Certificate exists for `www.verifrax.net`
   - Certificate status: **Active**

3. **SSL/TLS → Origin Server**
   - Certificate mode: **Full** or **Full (strict)**

### DNS Settings

1. **DNS → Records**
   - `verifrax.net` → `A` record with orange cloud ON
   - `www.verifrax.net` → `CNAME` record with orange cloud ON

2. **DNS → Settings**
   - Proxy status: **Proxied** (orange cloud)

### Workers & Pages Settings

1. **Workers & Pages → Routes**
   - Route exists: `verifrax.net/*`
   - Route exists: `www.verifrax.net/*`
   - Worker assigned: `verifrax-edge-production`

---

## EPISTEMIC HYGIENE

### What We're Actually Testing

- ✅ **TLS handshake succeeds** (certificate is valid)
- ✅ **HTTP response received** (endpoint is reachable)
- ✅ **Cloudflare is serving** (server header confirms)

### What We're NOT Testing

- ❌ Final landing page content (redirects are fine)
- ❌ Specific HTTP version (1.1 and 2 both work)
- ❌ Specific status code (200, 301, 302 all indicate reachability)

### Why This Matters

**Accessibility ≠ Final Destination**

A `301` redirect means:
- TLS works ✅
- DNS works ✅
- Endpoint is reachable ✅
- System is routing correctly ✅

This is **operational success**, not failure.

---

## QUICK FIX CHECKLIST

If script fails on TLS check:

1. ✅ Run manual `curl -I` to see actual response
2. ✅ Check Cloudflare SSL mode (must be Full/Full strict)
3. ✅ Verify edge certificates exist and are active
4. ✅ Check DNS records are proxied (orange cloud)
5. ✅ Verify Worker routes are configured
6. ✅ Update script acceptance criteria if needed

---

**END OF TLS TROUBLESHOOTING GUIDE**

