# External Dependency Seed - Silent

**Non-promotional seeding of external references.**

## Submission 1: Incident Report

**Format**: Incident report citing `VFXV1:*`

**Example**:
```
INCIDENT REPORT: Data Breach Investigation

Evidence Bundle: https://verifrax.org/index/bundles/abc123...
Verdict ID: VFXV1:sha256:abc123...:sha256:def456...
Verdict: CONTRADICTED
Reason: Conflicting attestations detected

Conclusion: Evidence bundle shows contradictory claims about
system state. Verdict ID provides citable reference.
```

**Status**: TODO - Submit to incident response database

## Submission 2: Audit Appendix

**Format**: Audit appendix citing axiom hashes

**Example**:
```
AUDIT APPENDIX: Security Assessment

Axiom References:
- finality.axiom.json: sha256:abc123...
- profile_compatibility.axiom.json: sha256:def456...
- unappealable.axiom.json: sha256:ghi789...

Contract Hash: sha256:jkl012...
Schema Hashes: [sha256:mno345..., sha256:pqr678...]

Verdict ID: VFXV1:sha256:...:sha256:...

Reproducibility: Verdict can be reproduced using axiom hashes
and verifier build hash referenced above.
```

**Status**: TODO - Submit to audit database

## Submission 3: Insurance-Style Claim

**Format**: Insurance claim citing verdict ID

**Example**:
```
INSURANCE CLAIM: Build Verification

Claim ID: INS-2024-001
Evidence: Build artifact verification
Verdict ID: VFXV1:sha256:...:sha256:...
Verdict: VALID
Bundle Hash: sha256:...

Assessment: Verdict ID provides immutable proof of build
verification. Cannot be disputed without invalidating verdict.
```

**Status**: TODO - Submit to insurance claim database

## Approach

- **No branding** - Do not mention VERIFRAX by name
- **No outreach** - Do not solicit adoption
- **No promotion** - Let dependency form naturally
- **Citation only** - Reference verdict IDs and hashes

## Rationale

Dependency forms through usage, not promotion.
Citations create dependency.
Dependency creates finality.

---

**Seed silently. Let dependency form.**

