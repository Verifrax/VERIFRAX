# Stripe Payment Intent Setup

## Environment Variable

The Stripe secret key must be set as a Cloudflare Worker secret:

```bash
cd workers/verifrax-edge
npx wrangler secret put STRIPE_SECRET_KEY
```

When prompted, enter:
```
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
```

## Payment Product Definition

- **Product name:** VERIFRAX Verification Event
- **Currency:** EUR
- **Amount:** 12000 cents (€120)
- **Billing:** one-time
- **Refunds:** no

## Endpoint

**POST** `/api/create-payment-intent`

**Response:**
```json
{
  "client_secret": "pi_..."
}
```

## Testing

After deployment, test with:

```bash
curl -X POST https://verifrax.net/api/create-payment-intent \
  -H "Content-Type: application/json"
```

Expected: JSON response with `client_secret` field.

