# FIRST PAID EXECUTION — VERIFRAX_EXECUTION_V1

**MODE:** MANUAL · IRREVERSIBLE · SINGLE-SHOT

**STATUS:** ACTIVE

---

## A1 — PRODUCT DEFINITION (LOCK)

```
PRODUCT_ID=VERIFRAX_EXECUTION_V1

PRODUCT_DESCRIPTION:
"SINGLE deterministic verification execution.
ONE execution → ONE final certificate.
NO revision. NO re-run. NO dispute."
```

**RULE:**
If asked for more → respond with the same line. Nothing else.

---

## A2 — PRICE LOCK (HARD)

```
PRICE_EUR=650
CURRENCY=EUR
DISCOUNT=0
BUNDLES=DISABLED
NEGOTIATION=DISABLED
```

**RULE:**
Any counteroffer → terminate discussion.

---

## A3 — PAYMENT FLOW (NO STRIPE)

```
PAYMENT_METHOD=BANK_TRANSFER_ONLY
AUTOMATION=OFF
CHARGEBACK_SURFACE=ZERO
```

**INVOICE_SCHEMA (STRICT):**

```
SELLER=VERIFRAX
SERVICE="Deterministic verification execution (single-use)"
PRICE=€650
NOTE="Execution is final and irreversible upon payment."
```

**RULE:**
No payment → no execution.
Cleared funds only.

---

## A4 — CLIENT INTAKE (CONSENT GATE)

**SEND EXACT TEXT (BYTE-FOR-BYTE):**

```
VERIFRAX — EXECUTION CONDITIONS

You are purchasing a single deterministic verification execution.

• One execution → one certificate
• No revision, re-run, or amendment
• No interpretation, advice, or opinion
• Certificate validity is independent of VERIFRAX availability

If you proceed, reply with "ACKNOWLEDGED".
```

```
CONSENT_TOKEN="ACKNOWLEDGED"
```

**RULE:**
No token → stop.
Token received → proceed.

---

## A5 — EXECUTION PIPELINE

```
INPUT: Evidence bundle (opaque)
PROCESS: Deterministic verification
OUTPUT: Certificate
FINALITY: IRREVERSIBLE
```

**DELIVERABLES (ONLY):**

```
1. Certificate file
2. Certificate hash
3. /verify reference
```

**RULE:**
No explanation. No interpretation. No follow-ups.

---

## A6 — TARGET SELECTION (SINGLE CONTACT)

```
TARGET_COUNT=1
BROADCAST=DISABLED
CHANNEL=PRIVATE
```

**ALLOWED PROFILES (SELECT ONE):**

```
- Law firm partner (evidence-heavy)
- Compliance officer (audit trail)
- Investigative journalist (document integrity)
- Crypto dispute / forensic analyst
```

---

## A7 — OUTREACH MESSAGE (ONE SHOT)

**SEND EXACT TEXT:**

```
We operate a deterministic verification system.
One execution. Final certificate. No disputes.
€650.

If you have evidence that must survive scrutiny, reply INTERESTED.
```

```
FOLLOW_UPS=0
THREAD_EXTENSION=DISABLED
```

---

## A8 — SUCCESS CONDITION (STOP POINT)

```
SUCCESS_CRITERIA:
PAID_EXECUTIONS >= 1
```

When true:

```
PRICE=HARDEN
LEGAL_TEXT=FORMALIZE
AUTOMATION=CONSIDER
```

Until true:

```
NO EXPANSION
NO FEATURES
NO STRIPE
```

---

## A9 — GLOBAL RULES (NON-NEGOTIABLE)

```
FINALITY > SCALE
CLARITY > MARKETING
MANUAL > REVERSIBLE
ONE CLIENT > MANY LEADS
```

---

**AUTHORITY:** This document defines the FIRST PAID EXECUTION system.

**UPDATES:** No updates without explicit version increment.

