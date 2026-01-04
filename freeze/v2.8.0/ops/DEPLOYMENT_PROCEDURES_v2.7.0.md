# VERIFRAX v2.7.0 Deployment Procedures

**Version:** v2.7.0  
**Date:** 2026-01-03  
**Status:** OPERATIONAL

---

## PRE-DEPLOYMENT CHECKLIST

### 1. Git Tag Verification

```bash
# Verify v2.7.0 tag exists
git ls-remote https://github.com/Verifrax/VERIFRAX refs/tags/v2.7.0

# Verify backward compatibility tags
git ls-remote https://github.com/Verifrax/VERIFRAX refs/tags/v2.4.0
```

### 2. DNS Resolution

```bash
# Verify DNS resolution
dig verifrax.net +short
dig www.verifrax.net +short

# Verify NS records
dig +short NS verifrax.net
dig +short A verifrax.net
dig +short AAAA verifrax.net
dig +short CNAME www.verifrax.net
```

### 3. TLS/HTTPS Verification

```bash
# Verify HTTPS connectivity
curl -I https://verifrax.net/
curl -I https://www.verifrax.net/
```

### 4. Certificate Transparency

```bash
# Check certificate transparency logs
curl -s "https://crt.sh/?q=%25.verifrax.net&output=json" \
| python3 - <<'PY'
import sys, json
data=json.load(sys.stdin)
names=set()
for r in data:
    for n in r.get("name_value","").split("\n"):
        if n.endswith("verifrax.net"):
            names.add(n.strip())
print("\n".join(sorted(names)))
PY
```

---

## CLOUDFLARE WORKERS DEPLOYMENT

### 1. Wrangler Authentication

```bash
cd /Users/midiakiasat/Desktop/VERIFRAX/workers/verifrax-edge
wrangler login
```

### 2. Secret Management

```bash
# Set Stripe secrets
wrangler secret put STRIPE_SECRET_KEY \
  --name verifrax-edge-production \
  --env=""

wrangler secret put STRIPE_WEBHOOK_SECRET \
  --name verifrax-edge-production \
  --env=""

wrangler secret put EXEC_TOKEN_SIGNING_KEY \
  --name verifrax-edge-production \
  --env=""

# Set price tier IDs
wrangler secret put STRIPE_PRICE_TIER_A \
  --name verifrax-edge-production \
  --env=""

wrangler secret put STRIPE_PRICE_TIER_B \
  --name verifrax-edge-production \
  --env=""

# Set verifier version
wrangler secret put VERIFIER_VERSION \
  --name verifrax-edge-production \
  --env=""

# Set token TTL
wrangler secret put EXEC_TOKEN_TTL_SECONDS \
  --name verifrax-edge-production \
  --env=""
```

### 3. Verify Stripe Account

```bash
# Test Stripe API access
curl https://api.stripe.com/v1/account \
  -u __REMOVED___REAL_KEY_FROM_DASHBOARD:

# List products
stripe products list --limit 5

# List prices
stripe prices list --limit 5
```

---

## WEBHOOK CONFIGURATION

### Stripe Webhook Setup

**Webhook Events (VERIFRAX snapshot finality):**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

**Configuration:**
- **Destination name:** `verifrax-snapshot-finality`
- **Endpoint URL:** `https://verifrax.net/api/stripe/webhook`
- **Description:** `Authoritative snapshot webhook for VERIFRAX v2.7.0. Immutable payment finality trigger.`

### Webhook Secret

```bash
# Set webhook secret from Stripe dashboard
wrangler secret put STRIPE_WEBHOOK_SECRET \
  --name verifrax-edge-production \
  --env=""
# Paste: <STRIPE_WEBHOOK_SECRET>
```

---

## POST-DEPLOYMENT VERIFICATION

### 1. Run Deployment Verification Script

```bash
chmod +x ops/DEPLOYMENT_VERIFICATION_v2.7.0.sh
./ops/DEPLOYMENT_VERIFICATION_v2.7.0.sh
```

### 2. Manual Endpoint Verification

```bash
# Positive paths
curl -I https://verifrax.net/status
curl -I https://verifrax.net/.well-known/verifrax.json
curl https://verifrax.net/spec
curl https://verifrax.net/profiles/public@1.0.0.json

# Negative paths (must fail)
curl -i https://verifrax.net/api/upload
curl -i https://verifrax.net/api/verify
curl -i https://verifrax.net/api/certificate

# Payment intent creation
curl -X POST https://verifrax.net/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"tier":"A"}'
```

### 3. Level-Up Verification

```bash
# Level-Up #1: Profile manifests
curl https://verifrax.net/profiles/public@1.0.0.json | jq '.profile_manifest_hash'

# Level-Up #2: Certificate schema (check in codebase)
grep -q 'cert_schema' core/schemas/certificate.v2.schema.json

# Level-Up #7: Error ontology
curl https://verifrax.net/api/errors | jq '.errors[0].class'

# Level-Up #8: Legal documents
curl https://verifrax.net/legal/CERTIFICATE_MEANING_STATEMENT_v2.7.0.md
curl https://verifrax.net/legal/NON_RELIANCE_AND_NON_ADVICE_STATEMENT_v2.7.0.md

# Level-Up #9: Routing signals
curl https://verifrax.net/status | jq '.do_not_route_when'
curl https://verifrax.net/.well-known/verifrax.json | jq '.do_not_route_when'
```

---

## SECURITY CHECKS

### 1. DNS Enumeration

```bash
# Check all subdomains
dig +short NS verifrax.net
dig +short A verifrax.net
dig +short AAAA verifrax.net
dig +short CNAME www.verifrax.net
dig +short MX verifrax.net
dig +short TXT verifrax.net

# Certificate transparency
curl -s "https://crt.sh/?q=%25.verifrax.net&output=json" | \
  python3 -c "import sys,json; [print(r['name_value']) for r in json.load(sys.stdin)]"
```

### 2. Path Discovery

```bash
# Check common paths
for p in / /pay /spec /glossary /status /api/upload /api/verify /api/certificate; do
  echo "== $p"
  curl -sS -o /dev/null -D - "https://verifrax.net$p" | head -n 5
done
```

### 3. Link Extraction

```python
# Extract internal links
python3 - <<'PY'
import requests, re
u="https://verifrax.net/"
r=requests.get(u,timeout=15)
links=set(re.findall(r'href=["\']([^"\']+)["\']', r.text))
print("\n".join(sorted([l for l in links if l.startswith("/") ])))
PY
```

---

## PGP KEY MANAGEMENT

### Current Signing Key

```bash
# Check current signing key
git config --global --get user.signingkey

# Set new signing key (if needed)
git config --global user.signingkey <NEW_KEY_ID>
```

### PGP Public Key (v2.5.0-final)

```
-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEaVWNCRYJKwYBBAHaRw8BAQdA8qI4RyaoEQJEWaq6Lvc8USzMeHPc8fCf0rlW
baTAJKG0LFZFUklGUkFYICh2Mi41LjAtZmluYWwpIDxsZWdhbEB2ZXJpZnJheC5u
ZXQ+iJMEExYKADsWIQS8erka6Smagr5BAlRELTWRk0JNJgUCaVWNCQIbAwULCQgH
AgIiAgYVCgkICwIEFgIDAQIeBwIXgAAKCRBELTWRk0JNJpFHAP9cvktOxS8BSoeo
fRWuQ917i0jswGr6Ty+bSyL98btapgD9GVIMlMbAerdyqpzOxrqw7EnSJcG7felS
Kl3fDKJaBgI=
=btPy
-----END PGP PUBLIC KEY BLOCK-----
```

---

## OPERATIONAL MONITORING

### Daily Checks

1. **Status Endpoint**
   ```bash
   curl https://verifrax.net/status
   ```

2. **Certificate Retrieval**
   ```bash
   # Test with known certificate hash
   curl https://verifrax.net/certificate/<hash>
   ```

3. **Error Rates**
   - Monitor `/api/errors` endpoint
   - Check error catalog for new error classes

### Weekly Checks

1. **DNS Resolution**
2. **TLS Certificate Validity**
3. **Stripe Webhook Delivery**
4. **Profile Manifest Integrity**

---

## SYSTEM DESCRIPTION

**VERIFRAX** is a deterministic digital verification engine.

The system performs a one-time, irreversible technical verification execution over a user-submitted digital evidence bundle and issues a final, reproducible cryptographic certificate.

**Transaction Model:**
- One payment → one execution → one certificate
- No subscriptions, no accounts, no retries
- No refunds tied to outcomes (only for non-execution due to system failure)

**Service Boundaries:**
- VERIFRAX does not provide legal, financial, or advisory services
- Does not interpret evidence, judge meaning, resolve disputes, or guarantee outcomes
- Executes deterministic computation only and returns a final, immutable result

**Payment Processing:**
- One-time charges via Stripe Checkout
- Access to a single execution per payment
- No subscriptions, no accounts, no retries

**Public Documentation:**
- Terms, privacy policy, refund policy, pricing, and execution surfaces are publicly available on the website

---

**END OF DEPLOYMENT PROCEDURES**

