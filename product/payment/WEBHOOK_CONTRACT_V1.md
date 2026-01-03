# VERIFRAX WEBHOOK CONTRACT — V1 (HARD RULES)

VERSION: v2.7.0
STATE: LOCKED

## Webhook Endpoint

**URL:** `https://www.verifrax.net/api/stripe/webhook`  
**Purpose:** Authorization + execution-token binding  
**Mode:** LIVE (production)

## Accepted Events (WHITELIST ONLY)

The webhook handler **ONLY** accepts these events:

1. `checkout.session.completed`
2. `payment_intent.succeeded`
3. `payment_intent.payment_failed`

## Rejection Rules (IMMEDIATE)

The webhook handler **IMMEDIATELY REJECTS**:

1. **Any other event type** — not in whitelist above
2. **Invalid signature** — signature verification fails
3. **Replayed event ID** — event ID already processed (idempotency check)

## Implementation Requirements

- Signature verification using `STRIPE_WEBHOOK_SECRET`
- Event ID deduplication (idempotency)
- No business logic in webhook handler (authorization only)
- Return HTTP 200 on success, HTTP 400 on rejection

## Security

- Webhook secret stored in Cloudflare Workers secrets
- Never log webhook secret
- Never expose webhook secret in responses
- Validate signature before processing any event

