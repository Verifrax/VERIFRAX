# VERIFRAX v2.7.0 Quick Reference

**Version:** v2.7.0  
**Last Updated:** 2026-01-03

---

## SYSTEM DESCRIPTION

VERIFRAX is a **deterministic digital verification engine**.

- Performs one-time, irreversible technical verification execution
- Processes user-submitted digital evidence bundles
- Issues final, reproducible cryptographic certificates
- **Transaction model:** One payment → one execution → one certificate

**Service Boundaries:**
- ❌ Does NOT provide legal, financial, or advisory services
- ❌ Does NOT interpret evidence, judge meaning, resolve disputes, or guarantee outcomes
- ✅ Executes deterministic computation only
- ✅ Returns final, immutable result

**Payment Model:**
- One-time charges via Stripe Checkout
- Access to a single execution per payment
- No subscriptions, no accounts, no retries
- No refunds tied to outcomes (only for non-execution due to system failure)

---

## KEY ENDPOINTS

### Public Endpoints
- `GET /` - Homepage
- `GET /status` - System status (includes `do_not_route_when`)
- `GET /.well-known/verifrax.json` - Machine-readable metadata
- `GET /spec` - Authoritative specification
- `GET /glossary` - Terminology glossary
- `GET /profiles/{profileId}.json` - Profile manifests (Level-Up #1)
- `GET /certificate/{hash}` - Certificate retrieval
- `GET /legal/*.md` - Legal documents (Level-Up #8)
- `GET /api/errors` - Error catalog (Level-Up #7)

### API Endpoints
- `POST /api/create-payment-intent` - Create payment intent
- `POST /api/stripe/webhook` - Stripe webhook handler
- `GET /api/get-token?session_id=...` - Retrieve execution token
- `POST /api/verify` - Execute verification (requires Bearer token)

### Negative Paths (Must Fail)
- `POST /api/upload` - ❌ Not implemented (must return error)
- `POST /api/verify` (without token) - ❌ Must return 401
- `GET /api/certificate` - ❌ Invalid path (must return error)

---

## DEPLOYMENT COMMANDS

### Wrangler Setup
```bash
cd workers/verifrax-edge
wrangler login
```

### Secrets
```bash
wrangler secret put STRIPE_SECRET_KEY --name verifrax-edge-production
wrangler secret put STRIPE_WEBHOOK_SECRET --name verifrax-edge-production
wrangler secret put EXEC_TOKEN_SIGNING_KEY --name verifrax-edge-production
wrangler secret put STRIPE_PRICE_TIER_A --name verifrax-edge-production
wrangler secret put STRIPE_PRICE_TIER_B --name verifrax-edge-production
wrangler secret put VERIFIER_VERSION --name verifrax-edge-production
wrangler secret put EXEC_TOKEN_TTL_SECONDS --name verifrax-edge-production
```

### Stripe Verification
```bash
curl https://api.stripe.com/v1/account -u __REMOVED___...
stripe products list --limit 5
stripe prices list --limit 5
```

---

## WEBHOOK CONFIGURATION

**Stripe Webhook Events:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

**Endpoint:** `https://verifrax.net/api/stripe/webhook`

**Secret:** Set via `wrangler secret put STRIPE_WEBHOOK_SECRET`

---

## VERIFICATION COMMANDS

### Quick Health Check
```bash
curl https://verifrax.net/status | jq
```

### Profile Manifest Check
```bash
curl https://verifrax.net/profiles/public@1.0.0.json | jq '.profile_manifest_hash'
```

### Error Catalog Check
```bash
curl https://verifrax.net/api/errors | jq '.errors[0] | {code, class, operator_action}'
```

### Routing Signals Check
```bash
curl https://verifrax.net/status | jq '.do_not_route_when'
curl https://verifrax.net/.well-known/verifrax.json | jq '.do_not_route_when'
```

### Full Deployment Verification
```bash
./ops/DEPLOYMENT_VERIFICATION_v2.7.0.sh
```

---

## DNS VERIFICATION

```bash
# Basic resolution
dig verifrax.net +short
dig www.verifrax.net +short

# Full DNS check
dig +short NS verifrax.net
dig +short A verifrax.net
dig +short AAAA verifrax.net
dig +short CNAME www.verifrax.net
dig +short MX verifrax.net
dig +short TXT verifrax.net
```

---

## CERTIFICATE TRANSPARENCY

```bash
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

## LEVEL-UP FEATURES (v2.7.0)

1. **Profile Manifests** - `/profiles/{profileId}.json`
2. **Hardened Certificate Schema** - `cert_schema: 1` with `tool_identity`, `profile_manifest_hash`, etc.
3. **Enhanced Offline Verifier** - Supports profile manifest validation
4. **Evidence Bundle Format** - Tar archive with manifest.json
5. **Transparency Ledger** - Append-only Merkle log (optional)
6. **Token Lifecycle Atomicity** - `issued` → `executing` → `finalized`
7. **Failure Ontology** - Errors with `class`, `retry`, `operator_action`
8. **Legal Surface** - Certificate Meaning & Non-Reliance statements
9. **Routing Signals** - `do_not_route_when` in status and well-known
10. **Build Attestation** - Signed build proof (specification)

---

## PGP KEY

**Key ID:** (from git config)
**Purpose:** Code signing for v2.5.0-final and later

```bash
git config --global --get user.signingkey
```

---

## SUPPORT RESOURCES

- **Specification:** https://verifrax.net/spec
- **Glossary:** https://verifrax.net/glossary
- **Status:** https://verifrax.net/status
- **Well-Known:** https://verifrax.net/.well-known/verifrax.json
- **Error Catalog:** https://verifrax.net/api/errors

---

**END OF QUICK REFERENCE**

