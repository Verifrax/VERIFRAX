# Payment → Execution Boundary

## Enforcement

Code enforces:

1. **Payment confirmed BEFORE upload:**
   - Line 89-92: Requires `x-payment-intent-id` header
   - Returns 402 if missing

2. **Payment confirmed BEFORE execution:**
   - Lines 237-276: Verifies payment status with Stripe
   - Checks `paymentIntent.status === "succeeded"`
   - Returns 402 if not confirmed

3. **No retry path without new payment:**
   - Each execution requires verified payment
   - No automatic retries
   - Each upload requires new payment intent

## Verification

- Payment authorization required at upload (header check)
- Payment confirmation verified at execution (Stripe API check)
- One payment = one execution authorization

