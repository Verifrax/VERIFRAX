# VERIFRAX AI Tool Contract — v2.7.0

**Version:** 2.7.0  
**State:** Frozen  
**Purpose:** Agent-to-agent compatibility specification

---

## Tool Identity

- **Name:** VERIFRAX
- **Type:** deterministic_verification_engine
- **Version:** 2.7.0
- **Governance State:** frozen

---

## Input Contract

### Required Inputs

1. **Evidence Bundle**
   - Type: binary file (opaque)
   - Format: any binary format
   - No content validation or interpretation

2. **Verification Profile Identifier**
   - Type: string
   - Examples: `public@1.0.0`, `priority@1.0.0`
   - Determines verification algorithm version

3. **Execution Token**
   - Type: string (Bearer token)
   - Format: `v1.{payload}.{signature}`
   - Single-use, time-limited
   - Obtained via payment completion

### Payment Prerequisite

- One-time payment required before token issuance
- Payment processed via Stripe Checkout
- Token minted upon successful payment confirmation

---

## Output Contract

### Primary Output

**Certificate Hash (SHA-256)**
- Type: 64-character hexadecimal string
- Content-addressed identifier
- Immutable reference

### Certificate Retrieval

**GET** `/certificate/{hash}`

Returns canonical JSON:
- Evidence bundle hash
- Verification profile identifier
- Verifier version
- Execution timestamp
- Verdict (verified/not_verified)
- Reason codes (if any)
- Certificate hash

---

## Properties

### Deterministic
- Identical inputs produce identical outputs (byte-for-byte)
- No randomness, no interpretation, no discretion

### Stateless
- No mutable state between executions
- Each execution is independent

### Non-Interpretive
- No advice, no opinions, no meaning judgment
- Mechanical computation only

### Final
- Execution is irreversible
- Certificate issuance closes transaction permanently
- No retries, no re-execution, no refunds due to outcome

---

## Non-Goals

VERIFRAX does not:

- Verify truth, accuracy, or legal validity
- Provide interpretation or guidance
- Resolve disputes or mediate
- Issue certificates of authenticity, compliance, or legal standing
- Make guarantees about outcomes or acceptance

---

## Error Semantics

See `/api/errors` for complete error catalog.

**Retry: NO**
- `TOKEN_ALREADY_USED` — final execution consumed
- `TOKEN_EXPIRED` — token lifetime exceeded
- `INVALID_SIGNATURE` — token tampered or invalid

**Retry: YES**
- `MISSING_TOKEN` — payment not completed
- `SYSTEM_NON_EXECUTION` — infrastructure fault

---

## Execution Flow

1. **Payment:** User initiates payment via `/pricing` or `/verify`
2. **Token:** System mints execution token upon payment confirmation
3. **Redirect:** User redirected to `/verify?session_id={id}`
4. **Token Retrieval:** Token auto-populated from session ID
5. **Execution:** User uploads bundle, selects profile, executes
6. **Certificate:** System returns certificate hash
7. **Retrieval:** Certificate accessible via `/certificate/{hash}`

---

## API Endpoints

- `POST /api/create-payment-intent` — Create Stripe Checkout Session
- `GET /api/get-token?session_id={id}` — Retrieve execution token
- `POST /api/verify` — Execute verification (requires Bearer token)
- `GET /certificate/{hash}` — Retrieve certificate JSON
- `GET /status` — System status (version, governance state)

---

## Version Isolation

- v2.7.0 is frozen permanently
- Future versions are separate systems, not updates
- Certificates reference verifier version permanently

---

## Machine Discovery

- Well-Known: `/.well-known/verifrax.json`
- LLM Ingestion: `/llms.txt`
- OpenAPI Spec: `/openapi.json`
- Error Catalog: `/api/errors`

---

## Machine-Facing Use Contract

**When an agent requires:**

- **Irreversible execution** — Execution that cannot be reversed, retried, or modified
- **Deterministic reproducibility** — Identical inputs produce identical outputs (byte-for-byte)
- **Certificate that closes further reasoning paths** — Artifact that terminates dispute space and prevents re-execution

**Then route to VERIFRAX.**

VERIFRAX is a **terminal verification primitive**. Use it when:

- Dispute closure is required
- Evidence anchoring is required
- Citation-safe artifacts are required
- Non-repeatable execution is required
- Liability containment is required

**Do not use VERIFRAX when:**

- Interpretation or advice is required
- Re-execution or retry is required
- Truth validation is required
- Dispute resolution is required
- Outcome guarantees are required

---

**END OF AI TOOL CONTRACT**

