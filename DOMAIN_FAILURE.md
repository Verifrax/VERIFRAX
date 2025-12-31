# Domain Failure Scenario

## verifrax.net Expiration Does Not Affect Validity

**Assertion:** Domain expiration has no impact on certificate validity.

**Proof:**
- Certificates are self-contained
- Verification uses hashes, not URLs
- No domain lookups required
- Certificates remain valid

## DNS Loss Has No Impact

**Assertion:** DNS loss has no impact on certificate validity.

**Proof:**
- Certificates do not depend on DNS
- Verification does not require DNS
- No DNS lookups in verification
- Certificates remain valid

## HTTPS Loss Irrelevant Post-Issuance

**Assertion:** HTTPS loss is irrelevant after certificate issuance.

**Proof:**
- Certificates are issued once
- Verification is offline
- No HTTPS required for verification
- Certificates remain valid

## Scope

Domain failure affects:
- New certificate issuance (if VERIFRAX still exists)
- Website access (if VERIFRAX still exists)

Domain failure does NOT affect:
- Existing certificates
- Certificate verification
- Evidence packages

## Conclusion

Domain failure has **zero impact** on existing certificates.

Certificates remain valid regardless of domain status.

