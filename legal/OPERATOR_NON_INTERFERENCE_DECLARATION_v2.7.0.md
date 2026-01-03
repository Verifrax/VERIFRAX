# VERIFRAX OPERATOR NON-INTERFERENCE DECLARATION — v2.7.0

**Version:** v2.7.0  
**Date:** 2026-01-03  
**Status:** FINAL  
**Authority:** VERIFRAX_AUTHORITY.lock

---

## OPERATOR CAPABILITY LIMITATIONS

The VERIFRAX operator (the entity operating the VERIFRAX service) **cannot**:

1. Alter executions after initiation
2. Revoke certificates after issuance
3. Recover lost execution tokens
4. Modify certificate content
5. Delete certificates from storage
6. Overwrite existing certificates
7. Grant execution rights without payment
8. Bypass payment requirements
9. Modify execution results
10. Interfere with certificate validity

---

## DETAILED PROVISIONS

### 1. Execution Alteration Prohibition

**Operator cannot alter executions.**

- Execution process is deterministic and automated
- Execution inputs (evidence bundle, profile) determine outputs
- No manual intervention path exists in execution code
- No operator override mechanism exists
- Execution results cannot be modified by operator action

### 2. Certificate Revocation Prohibition

**Operator cannot revoke certificates.**

- Certificates are stored in immutable storage (Cloudflare R2)
- Certificate storage has no delete operation
- Certificate storage has no overwrite operation
- No revocation mechanism exists in system code
- Certificates remain valid regardless of operator status

### 3. Token Recovery Prohibition

**Operator cannot recover lost tokens.**

- Tokens are cryptographically signed and single-use
- Token state is stored in KV (key-value store)
- Token state transitions are one-way: `issued` → `burned`
- No token regeneration mechanism exists
- No token recovery mechanism exists
- Lost tokens are permanently lost

### 4. Certificate Modification Prohibition

**Operator cannot modify certificate content.**

- Certificate content is determined deterministically from execution inputs
- Certificate hash is computed from certificate content
- Certificate storage path is derived from certificate hash
- No certificate modification mechanism exists
- Certificates are immutable by design

### 5. Payment Bypass Prohibition

**Operator cannot grant execution rights without payment.**

- Execution tokens are generated only upon successful payment confirmation
- Payment confirmation requires valid Stripe webhook signature
- Webhook signature verification cannot be forged by operator
- No payment bypass mechanism exists
- No free execution mechanism exists

### 6. Certificate Validity Independence

**Certificates remain valid regardless of operator status.**

- Certificates are independently verifiable (cryptographic self-sufficiency)
- Certificate validity does not depend on VERIFRAX service availability
- Certificate validity does not depend on operator existence
- Certificate validity does not depend on infrastructure availability
- Certificates are facts, not records dependent on system state

### 7. Infrastructure Provider Limitations

**Infrastructure provider (Cloudflare) cannot alter certificates.**

- Certificate storage (R2) is write-once by policy
- No delete operation exists for certificate objects
- No overwrite operation exists for certificate objects
- Infrastructure provider cannot modify certificate content
- Infrastructure provider cannot revoke certificates

---

## OPERATOR CAPABILITIES (WHAT OPERATOR CAN DO)

The operator **can**:

1. **Operate the service** — Deploy, maintain, and operate the VERIFRAX service
2. **Monitor operations** — Observe system behavior, logs, and metrics
3. **Respond to system failures** — Address infrastructure issues, bugs, or service disruptions
4. **Process refunds** — Issue refunds for system execution failures (as per refund policy)
5. **Discontinue service** — Cease operating the service (certificates remain valid)

The operator **cannot**:

- Interfere with execution determinism
- Modify certificate content or validity
- Recover lost tokens
- Grant execution rights without payment
- Revoke or delete certificates

---

## LEGAL PROTECTION

This declaration protects the operator by:

1. **Establishing clear boundaries** — Defining what the operator cannot do
2. **Preventing liability claims** — Demonstrating that operator cannot interfere with execution or certificate validity
3. **Clarifying system behavior** — Making explicit that system behavior is deterministic and automated
4. **Limiting operator responsibility** — Establishing that operator is not responsible for certificate interpretation or third-party acceptance

This declaration protects users by:

1. **Guaranteeing system integrity** — Certificates cannot be modified or revoked
2. **Ensuring payment value** — Execution rights cannot be granted without payment
3. **Providing certainty** — System behavior is deterministic and predictable
4. **Establishing independence** — Certificates remain valid regardless of operator status

---

## TECHNICAL ENFORCEMENT

These limitations are enforced by:

1. **Cryptographic signatures** — Tokens and webhooks are cryptographically signed
2. **Immutable storage** — Certificates stored in write-once storage
3. **Deterministic execution** — Execution results determined by inputs, not operator action
4. **No override mechanisms** — System code contains no operator override paths
5. **Content-addressed storage** — Certificate paths derived from content, preventing modification

---

## QUOTABLE STATEMENT

**"The VERIFRAX operator cannot alter executions, revoke certificates, recover tokens, or interfere with certificate validity. Certificates remain valid regardless of operator status, service availability, or infrastructure provider actions."**

---

**END OF OPERATOR NON-INTERFERENCE DECLARATION**

