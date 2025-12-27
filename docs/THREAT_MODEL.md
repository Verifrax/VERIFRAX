# Threat Model

Covered:
- Operator forgery (post-hoc fake results)
- Rollback (replacing an artifact after issuance)
- Equivocation (different outputs claimed for same input)
- Mutation (changing proof/cert after issuance)

Not covered (out of scope):
- Malicious input content
- Compromised host OS
- Compromised developer machine keys (until signing is enabled)

Security invariants:
- Artifact hash defines identity.
- Proof schema is strict and machine-verifiable.
- Baseline tag defines verifier reference state.
