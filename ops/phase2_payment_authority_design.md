# PHASE 2 — PAYMENT AUTHORITY DESIGN

**Version:** v2.5.0  
**Status:** DESIGN SPEC (NO CODE YET)  
**Purpose:** Legal + economic specification for Stripe payment integration

---

## STRIPE PRODUCT MODEL

### Product Definition

**Product Name:** `VERIFRAX_EXECUTION`  
**Product Type:** Digital Service (One-Time)  
**Billing Model:** One-time payment  
**Currency:** EUR (primary), USD (secondary)

### Product Characteristics

- **No subscriptions** — single execution only
- **No trials** — payment required before execution
- **No credits** — no balance or account system
- **No refunds** — except execution failure (see Refund Policy)

---

## PRICE TIERS (SINGLE EXECUTION ONLY)

### Tier 1: Standard Execution

**Price:** €500.00 EUR  
**Stripe Price ID:** `price_standard_execution_v2_5_0`  
**Description:** Single deterministic verification execution  
**Includes:**
- One evidence bundle upload
- One verification execution
- One certificate generation
- Certificate retrieval access

### Tier 2: High-Value Execution

**Price:** €2,500.00 EUR  
**Stripe Price ID:** `price_high_value_execution_v2_5_0`  
**Description:** Single deterministic verification execution (high-value tier)  
**Includes:** Same as Standard Execution  
**Use Case:** Higher-value evidence or regulatory submissions

### Tier 3: Enterprise Execution

**Price:** €5,000.00 EUR  
**Stripe Price ID:** `price_enterprise_execution_v2_5_0`  
**Description:** Single deterministic verification execution (enterprise tier)  
**Includes:** Same as Standard Execution  
**Use Case:** Enterprise or institutional submissions

### Price Selection Rule

- User selects tier at payment intent creation
- No automatic tier assignment
- No tier upgrades or downgrades after payment
- Price is fixed per execution

---

## METADATA CONTRACT (MANDATORY)

### Payment Intent Metadata (Required Fields)

```json
{
  "purpose": "verifrax_execution",
  "verifrax_version": "2.5.0",
  "execution_type": "single_final",
  "price_tier": "standard|high_value|enterprise",
  "non_refundable": "true"
}
```

### Metadata Rules

1. **Immutable After Creation** — metadata cannot be modified post-creation
2. **Required Fields** — all fields must be present
3. **Version Lock** — `verifrax_version` must match active version
4. **Execution Type** — always `single_final` (no batch, no subscription)

### Metadata Validation

- Stripe webhook must validate metadata before execution authorization
- Missing or invalid metadata → execution blocked
- Version mismatch → execution blocked

---

## FAILURE MODES

### Payment Intent Creation Failure

**Scenario:** Stripe API returns error during payment intent creation

**Response:**
- Return HTTP `500` to client
- Log error (no PII)
- Do NOT create partial payment records
- Client must retry

**Allowed:** Client retry with same parameters  
**Forbidden:** Automatic retry by system

---

### Payment Confirmation Failure

**Scenario:** Payment succeeds in Stripe but confirmation webhook fails

**Response:**
- Stripe webhook retry mechanism applies
- System must be idempotent (duplicate webhooks safe)
- If webhook permanently fails → manual intervention required
- Payment remains valid in Stripe

**Allowed:** Webhook retry (Stripe standard)  
**Forbidden:** Automatic execution without webhook confirmation

---

### Payment Timeout

**Scenario:** Payment intent created but not confirmed within timeout window

**Timeout:** 24 hours from creation

**Response:**
- Payment intent expires in Stripe
- No execution authorization granted
- Client must create new payment intent
- No partial charges

**Allowed:** New payment intent creation  
**Forbidden:** Execution with expired payment intent

---

### Execution Failure After Payment

**Scenario:** Payment confirmed but verification execution fails

**Response:**
- Certificate NOT generated
- Execution marked as failed
- Refund policy applies (see Refund Policy)
- Evidence bundle retained for audit

**Allowed:** Refund (see Refund Policy)  
**Forbidden:** Retry execution without new payment

---

### Chargeback or Dispute

**Scenario:** Customer disputes charge via card issuer

**Response:**
- Stripe handles dispute process
- Execution remains valid if already completed
- Certificate validity unaffected by dispute
- No automatic refund on dispute

**Allowed:** Stripe dispute resolution process  
**Forbidden:** Certificate invalidation due to dispute

---

## REFUND POLICY (ALMOST ALWAYS NO)

### No Refund Scenarios (Default)

1. **Successful Execution** — certificate generated successfully
2. **User Error** — wrong evidence bundle, wrong profile selection
3. **User Cancellation** — user cancels after payment but before execution
4. **Dispute After Execution** — chargeback after certificate generation
5. **Interpretation Disagreement** — user disagrees with certificate content

**Rule:** Payment authorizes execution, not outcome satisfaction.

---

### Refund Allowed Scenarios (Exception Only)

1. **System Execution Failure** — verification fails due to system error (not user error)
2. **Infrastructure Failure** — AWS/Cloudflare outage prevents execution
3. **Version Mismatch** — system version changed between payment and execution
4. **Metadata Corruption** — payment intent metadata corrupted or invalid

**Refund Process:**
- Manual review required
- Evidence bundle must be retained
- Refund issued via Stripe API
- Refund reason logged

**Refund Timeline:** 7-14 business days after review

---

### Refund Forbidden Scenarios

1. **Certificate Content Disagreement** — user doesn't like certificate result
2. **Evidence Quality** — user realizes evidence was insufficient
3. **Profile Selection Error** — user selected wrong profile
4. **Timing Issues** — user needed certificate faster
5. **Third-Party Rejection** — certificate rejected by third party (court, regulator, etc.)

**Rule:** VERIFRAX provides execution, not outcome guarantee.

---

## WHAT IS ALLOWED

1. **One-time payment per execution** — single payment authorizes single execution
2. **Price tier selection** — user chooses tier at payment intent creation
3. **Payment confirmation required** — execution blocked until payment confirmed
4. **Metadata storage** — payment intent metadata stored in Stripe
5. **Refund on system failure** — refund allowed only for system execution failures

---

## WHAT IS FORBIDDEN

1. **Subscriptions** — no recurring payments
2. **Trials** — no free executions
3. **Credits or balances** — no account balance system
4. **Refunds for user error** — no refunds for wrong evidence/profile selection
5. **Refunds for outcome dissatisfaction** — no refunds for certificate content
6. **Payment modification** — payment intent cannot be modified after creation
7. **Automatic retries** — no automatic payment retry on failure
8. **Payment without execution** — payment must authorize execution (no standalone payments)

---

## WHAT HAPPENS ON FAILURE

### Payment Intent Creation Fails

- Client receives HTTP `500`
- No payment record created
- Client must retry
- No partial state

### Payment Confirmation Fails

- Webhook retry (Stripe standard)
- Execution blocked until confirmation
- If permanent failure → manual intervention
- Payment remains in Stripe

### Execution Fails After Payment

- Certificate NOT generated
- Execution marked failed
- Refund review triggered (if system failure)
- Evidence bundle retained

### Chargeback Occurs

- Stripe dispute process
- Certificate validity unaffected
- No automatic refund
- Execution remains valid

---

## WHAT CANNOT BE APPEALED

1. **No refund for successful execution** — certificate generated = no refund
2. **No refund for user error** — wrong evidence/profile = no refund
3. **No refund for outcome dissatisfaction** — certificate content = no refund
4. **Payment required before execution** — no exceptions
5. **One payment = one execution** — no batch or multi-execution discounts
6. **Metadata immutability** — payment intent metadata cannot be changed
7. **Version lock** — payment must match active system version

---

## STRIPE CONFIGURATION REQUIREMENTS

### Product Setup

1. Create product: `VERIFRAX_EXECUTION`
2. Create three prices (Standard, High-Value, Enterprise)
3. Set billing to "One-time"
4. Disable subscriptions
5. Disable trials

### Webhook Configuration

1. Endpoint: `https://www.verifrax.net/api/stripe-webhook`
2. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Secret: Store in Cloudflare Workers secrets
4. Idempotency: Handle duplicate webhooks safely

### API Keys

1. Publishable key: Public (client-side)
2. Secret key: Server-side only (Cloudflare Workers secrets)
3. Webhook secret: Server-side only

---

## LEGAL BOUNDARIES

### Terms of Service

Payment authorizes:
- One verification execution
- Certificate generation (if execution succeeds)
- Certificate retrieval access

Payment does NOT authorize:
- Outcome satisfaction guarantee
- Refund for user error
- Refund for outcome disagreement
- Multiple executions

### Liability

- VERIFRAX liability limited to execution process
- No liability for certificate interpretation
- No liability for third-party reliance
- No liability for user error

---

## VERSION EVOLUTION (v2.6+)

### Future Versions

- v2.6.0 may re-enable Stripe (currently disabled in v2.5.0)
- v2.6.0 may add new price tiers
- v2.6.0 may add payment methods

### Backward Compatibility

- v2.5.0 payments remain valid for v2.5.0 executions only
- New versions require new payment intents
- Old certificates unaffected by new payment models

---

**END OF DESIGN SPEC**

