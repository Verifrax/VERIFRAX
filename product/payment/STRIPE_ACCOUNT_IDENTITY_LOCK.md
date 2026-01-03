# STRIPE ACCOUNT IDENTITY LOCK — FINAL BLOCKER

**Status:** REQUIRED · INSTITUTION-SAFE  
**Type:** Stripe Dashboard Configuration (NOT code)  
**Priority:** CRITICAL

---

## PROBLEM STATEMENT

Stripe Checkout currently displays **personal name** instead of **VERIFRAX** because:

- Stripe account is classified as **Individual / Personal**
- Stripe **always displays the legal account holder name** on Checkout
- Product names do **not** override account identity

This creates an institutional mismatch:
- Public system name: **VERIFRAX**
- Payment merchant name: **private individual**

**This must be corrected before Stripe review approval.**

---

## REQUIRED STRIPE CONFIGURATION

### Step 1: Convert Account to Business

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Settings → Business details**
3. Click **"Switch to business account"** or **"Update business information"**
4. Select account type:
   - **Sole Proprietorship** (fastest, acceptable for now)
   - OR **Company / Legal Entity** (if incorporated)

**Note:** Sole Proprietorship is sufficient and court-safe for institutional purposes.

---

### Step 2: Set Business Name (CRITICAL)

In **Settings → Business → Business details**, set:

#### Business name (public):
```
VERIFRAX
```

#### Legal business name:
```
VERIFRAX
```
*(Even if sole proprietor — Stripe allows this)*

#### Statement descriptor:
```
VERIFRAX
```

**What this controls:**
- Checkout page header
- Credit card statements
- Receipts
- Dispute records
- Regulator review documents

---

### Step 3: Owner Information (Hidden)

Stripe still requires:
- **Owner / Representative:** *[Your personal information]*
- This is **internal only**
- This **never appears publicly**
- This is compliant and acceptable

---

## VERIFICATION CHECKLIST

After making changes, verify:

- [ ] Stripe Checkout header shows **"VERIFRAX"** (not personal name)
- [ ] Product description shows **"Deterministic Verification — One Execution"**
- [ ] Card receipt shows **"VERIFRAX"** as merchant
- [ ] Statement descriptor shows **"VERIFRAX"**
- [ ] All product links still resolve correctly
- [ ] `/pricing`, `/terms`, `/privacy`, `/refunds` pages unchanged (no code changes needed)

**Important:** Old Stripe Checkout sessions may cache the old name. Create a new checkout session to verify the change.

---

## BEFORE vs AFTER

### BEFORE (Current — NOT Acceptable)
```
[Your personal name]
VERIFRAX Deterministic Verification — One Execution
```

### AFTER (Required — Acceptable)
```
VERIFRAX
Deterministic Verification — One Execution
```

---

## WHY THIS MATTERS

If **NOT** fixed:
- ❌ Stripe may freeze payouts
- ❌ Stripe may reject review
- ❌ Banks may flag transactions
- ❌ Courts may question provenance
- ❌ Counterparties may challenge authenticity

If **FIXED**:
- ✅ Stripe approval probability → **HIGH**
- ✅ Payment legitimacy → **LOCKED**
- ✅ Institutional credibility → **MAXIMAL**
- ✅ No further identity questions

---

## PRODUCT CONFIG (ALREADY CORRECT — DO NOT CHANGE)

These are already configured correctly:

- **Product name:** `VERIFRAX Deterministic Verification — One Execution`
- **Category:** Digital services / Technical processing
- **No advisory language**
- **No legal services claims**

**Do not modify these.**

---

## EXACT ACTION LIST

1. [ ] Open Stripe Dashboard
2. [ ] Navigate to **Settings → Business details**
3. [ ] Switch account to **Business** (Sole Proprietorship acceptable)
4. [ ] Set **Business name (public) = VERIFRAX**
5. [ ] Set **Legal business name = VERIFRAX**
6. [ ] Set **Statement descriptor = VERIFRAX**
7. [ ] Save changes
8. [ ] Create new test checkout session to verify header shows "VERIFRAX"
9. [ ] Verify card statement descriptor shows "VERIFRAX"

---

## NO CODE CHANGES REQUIRED

This is **purely a Stripe Dashboard configuration change**.

- No code modifications needed
- No redeployment required
- No legal document updates
- No API changes

---

## COMPLETION STATUS

When all verification items are checked:

**VERIFRAX payment surface = institution-clean.**

**Status:** ✅ **FINISHED**

---

**Last Updated:** 2026-01-03  
**Authority:** VERIFRAX v2.7.0 Payment Identity Lock

