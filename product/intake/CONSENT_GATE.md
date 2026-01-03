# CLIENT INTAKE — CONSENT GATE

**MODE:** MANUAL · BYTE-FOR-BYTE

---

## Consent Message (EXACT TEXT)

Send this exact text to the client (byte-for-byte):

```
VERIFRAX — EXECUTION CONDITIONS

You are purchasing a single deterministic verification execution.

• One execution → one certificate
• No revision, re-run, or amendment
• No interpretation, advice, or opinion
• Certificate validity is independent of VERIFRAX availability

If you proceed, reply with "ACKNOWLEDGED".
```

---

## Consent Token

```
CONSENT_TOKEN="ACKNOWLEDGED"
```

---

## Rules

**RULE:**
No token → stop.

**RULE:**
Token received → proceed.

**RULE:**
No variations accepted.

**RULE:**
Exact match required: "ACKNOWLEDGED"

---

## Process

1. Send consent message (exact text)
2. Wait for client response
3. Check for exact token match: "ACKNOWLEDGED"
4. If match → proceed to payment
5. If no match → stop

---

## No Negotiation

- No explanation of terms
- No modification of conditions
- No alternative consent forms
- Exact token or stop

---

**AUTHORITY:** This document defines the consent gate process.

**UPDATES:** No updates without explicit version increment.

