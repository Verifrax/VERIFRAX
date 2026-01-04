# VERIFRAX v2.7.0 Operational Checklist

**Version:** v2.7.0  
**Purpose:** Daily/weekly operational verification

---

## DAILY CHECKS

### 1. Status Endpoint
```bash
curl https://verifrax.net/status
```
**Expected:** JSON with `version: "v2.7.0"`, `governance_state: "frozen"`, `do_not_route_when` array

### 2. Well-Known Endpoint
```bash
curl https://verifrax.net/.well-known/verifrax.json
```
**Expected:** JSON with routing signals and system metadata

### 3. Profile Manifest Availability
```bash
curl https://verifrax.net/profiles/public@1.0.0.json
```
**Expected:** Valid JSON with `profile_manifest_hash` field

### 4. Error Catalog
```bash
curl https://verifrax.net/api/errors
```
**Expected:** JSON with errors including `class` and `operator_action` fields

---

## WEEKLY CHECKS

### 1. DNS Resolution
```bash
dig verifrax.net +short
dig www.verifrax.net +short
```

### 2. TLS Certificate
```bash
curl -I https://verifrax.net/
```
**Expected:** Valid HTTPS connection

### 3. Legal Documents
```bash
curl https://verifrax.net/legal/CERTIFICATE_MEANING_STATEMENT_v2.7.0.md
curl https://verifrax.net/legal/NON_RELIANCE_AND_NON_ADVICE_STATEMENT_v2.7.0.md
```

### 4. Stripe Webhook Status
- Check Stripe dashboard for webhook delivery success rate
- Verify webhook events are being received

---

## MONTHLY CHECKS

### 1. Certificate Schema Validation
- Verify certificate schema v2 is accessible
- Check schema includes all Level-Up #2 fields

### 2. Reference Verifier
- Test offline verification with profile manifest
- Verify backward compatibility with v2.6.0 certificates

### 3. Security Audit
- Review DNS records
- Check certificate transparency logs
- Verify no unauthorized subdomains

---

## INCIDENT RESPONSE

### If Status Endpoint Fails
1. Check Cloudflare Workers dashboard
2. Verify secrets are set correctly
3. Check Worker logs for errors

### If Payment Processing Fails
1. Verify Stripe API credentials
2. Check webhook configuration
3. Review Stripe dashboard for errors

### If Certificate Retrieval Fails
1. Check R2 bucket access
2. Verify certificate storage path
3. Check certificate hash format

---

**END OF OPERATIONAL CHECKLIST**

