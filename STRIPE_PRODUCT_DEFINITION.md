# Stripe Product Definition

## Product

**Name:** VERIFRAX Verification (One-Time)  
**Type:** Digital service  
**Billing:** One-off

## Characteristics

- No subscriptions
- No balances
- No credits
- No refunds (except execution failure)

## Payment Intent Metadata (Mandatory)

- `service=verifrax_verification`
- `version=v2.4.0`
- `execution=one_time`

Metadata is immutable post-creation.

## Canonical Description

One-time execution of a deterministic software verification process.
Customer uploads a digital evidence bundle.
System executes a single deterministic verification run.
Output is a cryptographically verifiable, immutable certificate.
No subscriptions. No advisory services. No custody of funds.

