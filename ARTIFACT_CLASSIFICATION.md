# VERIFRAX Artifact Classification

**Purpose:** Classify all non-code artifacts into three buckets for access control.

**Rule:** Only bucket (1) remains public by default. Buckets (2) and (3) should be restricted.

---

## (1) VERIFIABILITY-CRITICAL

**Definition:** Artifacts required for independent verification of certificates and system behavior. These must remain public for verifiability.

### Root Level
- `README.md` - Main README (contains authority statements - verifiability-critical)
- `AUTHORITATIVE_SCOPE.md` - Defines what is authoritative for verification
- `AUTHORITY.md` - Authority boundaries (if exists)
- `BUILD_ATTESTATION.md` - Build reproducibility requirements
- `BUILD_HASH.txt` - Cryptographic build hash
- `CERTIFICATE_CANONICAL_RULES.md` - Certificate format rules (critical for verification)
- `CANONICAL_HASHES_v1.txt` - Canonical hash registry
- `EVIDENCE_FINALITY.md` - Evidence immutability rules
- `EVIDENCE_PACKAGE_FORMAT.md` - Evidence bundle format specification
- `IMMUTABILITY_SEAL_v1.txt` - Immutability proof
- `SYSTEM_IDENTITY.json` - System identity declaration
- `SYSTEM_IDENTITY.txt` - System identity declaration
- `SCOPE_HASH.txt` - Scope hash
- `SCRIPTS_HASHES_v1.txt` - Script hashes for reproducibility
- `SURVIVAL_ARCHIVE_HASH.txt` - Archive hash
- `VERSION.txt` - Version identifier
- `build.provenance.json` - Build provenance data

### Freeze Directory
- `freeze/v2.7.0/` - All files (frozen artifacts)
- `freeze/v2.5.0/` - All files (frozen artifacts)
- `freeze/v2.4.0/` - All files (frozen artifacts)
- `freeze/v2.3.0/` - All files (frozen artifacts)
- `freeze/v2/` - All files (frozen artifacts)
- `freeze/certificate.v1.json` - Certificate template
- `freeze/core.dist.hash` - Core distribution hash
- `freeze/ENGINE.json` - Engine specification

### Documentation (Specifications Only)
- `docs/EVIDENCE_BUNDLE_SPEC_v1.md` - Evidence bundle specification
- `docs/DNS_AUDIT_v2.md` - DNS audit specification (if verification-critical)
- `docs/V2_EDGE_API.md` - API specification for verification
- `docs/V2_VERIFY_API.md` - Verification API specification
- `docs/GOVERNANCE_DISPUTE_FINALITY.md` - Dispute finality rules (verification-critical)
- `docs/GOVERNANCE_VERSION_FINALITY.md` - Version finality rules (verification-critical)
- `docs/PRICING_RISK_TIERS.md` - Pricing tiers (if affects verification outcomes)

### Index Directory
- `index/` - All files (verification index)

### Public Directory (Verification Artifacts)
- `public/CANONICAL_HASHES_v1.txt` - Public canonical hashes
- `public/IMMUTABILITY_SEAL_v1.txt` - Public immutability seal
- `public/robots.txt` - Public access rules
- `public/index.txt` - Public index
- `public/verify/index.txt` - Verification endpoint index
- `public/status/index.txt` - Status endpoint index
- `public/conformance/golden/` - Conformance test data (verification-critical)

### Reference Verifier
- `verifrax-reference-verifier/REFERENCE_AUTHORITY.md` - Reference verifier authority
- `verifrax-reference-verifier/README.md` - Reference verifier documentation (verifiability-critical)
- `verifrax-verifier-min/README.md` - Minimal verifier documentation (verifiability-critical)

### Product (Specifications Only)
- `product/delivery/DELIVERY_CERTIFICATE_SPEC.md` - Delivery certificate specification
- `product/delivery/DELIVERY_CERTIFICATE_SKU.md` - Delivery certificate SKU (if verification-critical)

### Examples
- `examples/real-world-certificate/` - Real certificate examples (verification-critical)

---

## (2) GOVERNANCE/META

**Definition:** Governance documents, policies, legal positions, terms, and organizational metadata. These define how the system is governed but are not required for verification.

### Root Level
- `GOVERNANCE.md` - System governance
- `VERSION_GOVERNANCE_AND_CHANGE_CONTROL.md` - Version governance policy
- `LEGAL_POSITION.md` - Legal position statement
- `TERMS.md` - Terms of service
- `PRIVACY.md` - Privacy policy
- `SECURITY.md` - Security policy
- `LICENSE` - License file
- `ISSUE_PR_POLICY.md` - Issue/PR policy
- `ORG_README.md` - Organization README
- `ORG_PINNED_REPOSITORIES.md` - Organization repository list
- `POSITION.md` - Position statement
- `POSITION_ON_STANDARDS.md` - Standards position
- `STANDARD_COMPATIBILITY.md` - Standards compatibility statement
- `FAQ_EXTERNAL.md` - External FAQ
- `PUBLIC_EXPLAINER.md` - Public explanation (meta, not verification-critical)

### Product (Governance)
- `product/legal/TERMS_OF_VERIFICATION.md` - Terms of verification
- `product/legal/LIMITATION_OF_LIABILITY.md` - Liability limitation
- `product/legal/JURISDICTION.md` - Jurisdiction statement
- `product/legal/ARTIFACT_LICENSE.md` - Artifact license
- `product/governance/PAYMENT_FINALITY_BINDING.md` - Payment finality governance
- `product/pricing/OUTCOME_PRICING.md` - Pricing policy
- `product/status/OPERATIONAL_TRUTH.md` - Operational status (governance)
- `product/VERSION.md` - Product version (governance)
- `product/SYSTEM_SURFACE_MANIFEST.md` - System surface manifest (governance)

### Documentation (Non-Spec)
- `docs/README.md` - Documentation README
- `docs/index.html` - Documentation index

### Releases
- `releases/RELEASE_v2.4.0.md` - Release notes (governance)

### Public Directory (Non-Verification)
- `public/legal/index.txt` - Legal index
- `public/pricing/index.txt` - Pricing index
- `public/docs/index.txt` - Documentation index
- `public/deliver/index.txt` - Delivery index

### Reference Verifier (Non-Authority)
- `verifrax-reference-verifier/LEGAL_USAGE.md` - Legal usage guidelines
- `verifrax-reference-verifier/VERIFY_WITHOUT_VERIFRAX.md` - Usage guide (non-authority)

### Examples (Non-Critical)
- `examples/README.md` - Examples README

### Mappings/Profiles (Authority Docs)
- `VERIFRAX-MAPPINGS-README.md` - Mappings README
- `VERIFRAX-PROFILES-AUTHORITY.md` - Profiles authority
- `VERIFRAX-PROFILES-README.md` - Profiles README
- `VERIFRAX-SPEC-AUTHORITY.md` - Spec authority
- `VERIFRAX-SPEC-README.md` - Spec README

---

## (3) INTERNAL DOCTRINE / CONTINGENCY

**Definition:** Internal defensive documents, contingency plans, dissolution scenarios, and operational doctrine. These are internal planning documents.

### Root Level
- `ADVERSARIAL_AUDIT_DEFENSE.md` - Adversarial audit defense
- `AUTHORITY_CLOSURE_CERTIFICATE.md` - Authority closure certificate
- `AUDITOR_ENTRY.md` - Auditor entry guide
- `CHAIN_OF_CUSTODY_NOTE.md` - Chain of custody documentation
- `CI_LANGUAGE_CHECK.md` - CI language check (internal)
- `CLOUDFLARE_AUDIT_v2.4.0.md` - Cloudflare audit (internal)
- `COMPANY_DISSOLUTION.md` - Company dissolution plan
- `CRYPTO_INDEPENDENCE.md` - Cryptographic independence statement
- `DISAPPEARANCE_TEST.md` - Disappearance test scenario
- `DOMAIN_FAILURE.md` - Domain failure contingency
- `END_STATE_ASSERTION.md` - End state assertion
- `EXECUTION_SECRECY_VERIFICATION.md` - Execution secrecy verification
- `EXTERNAL_SIGNAL_CHECK.md` - External signal check
- `FINAL_TAG_ARCHIVE.md` - Final tag archive documentation
- `FREEZE_NOTICE.md` - Freeze notice
- `FREEZE_NOTICE.txt` - Freeze notice (text)
- `HOW_TO_REIMPLEMENT_VERIFRAX.md` - Reimplementation guide
- `MAINTAINER_ABSENCE.md` - Maintainer absence plan
- `MISINTERPRETATION_DEFENSE.md` - Misinterpretation defense
- `PAYMENT_AND_VALUE_BOUNDARY.md` - Payment boundary definition
- `PAYMENT_EXECUTION_BOUNDARY.md` - Payment execution boundary
- `PDF_EXPORT_RULES.md` - PDF export rules (internal)
- `PHASE3_FREEZE_CONFIRMATION.md` - Phase 3 freeze confirmation
- `PHASE7_END_STATE.md` - Phase 7 end state
- `PHASE8_END_STATE.md` - Phase 8 end state
- `PHASE9_END_STATE.md` - Phase 9 end state
- `POST_VERIFRAX_WORLD.md` - Post-VERIFRAX world planning
- `RECONSTRUCT_VERIFICATION.md` - Verification reconstruction guide
- `REGULATED_BUSINESS_DEFENSE.md` - Regulated business defense
- `REPO_AUDIT_CHECKLIST.md` - Repository audit checklist
- `STRIPE_FINAL_DEFENSIVE.md` - Stripe defensive posture
- `STRIPE_PRODUCT_DEFINITION.md` - Stripe product definition
- `STRIPE_REVIEW_TEXT.md` - Stripe review text
- `VALIDATION_REPORT_v2.4.0.md` - Validation report (internal)
- `ENVIRONMENT_FINGERPRINT.txt` - Environment fingerprint (internal)

### Documentation (Internal)
- `docs/_graveyard/` - All files (archived/internal)
- `docs/external-anchors/` - External anchor content (internal strategy)

### Product (Internal)
- `product/delivery/WORKED_SCENARIO_MEDIA_DELIVERY.md` - Worked scenario (internal)

### Operations
- `ops/` - All files (operational/internal)

### Archive
- `archive/` - All files (historical/internal)

### Freeze (Internal Documentation)
- `freeze/v2.8.0/` - Internal freeze documentation

### Design Documents
- `VERIFRAX-v2.5.0-design/` - All files (design/internal)

### Scripts (Internal)
- `scripts/` - All files (internal scripts)
- `complete-certificate-issuance.sh` - Internal script
- `final-anchor-execution.sh` - Internal script
- `final-issuance-pipeline.sh` - Internal script

### CI
- `ci/` - All files (internal CI)

### Terminal Authority
- `terminal_authority.asc` - Terminal authority (internal)

### Manifest
- `manifest.json` - Manifest (internal)

### Workspace
- `VERIFRAX.code-workspace` - Workspace file (internal)

### Archives
- `VERIFRAX_v2.7.0_SURVIVAL_ARCHIVE.tar.gz` - Survival archive (internal)
- `exhibit.tar.gz` - Exhibit archive (internal)

### Public (Internal Samples)
- `public/sample-certificate/` - Sample certificate (internal)

### Reference Verifier (Internal)
- `verifrax-reference-verifier/WHY_VERIFRAX_CANNOT_CHEAT.md` - Internal explanation

---

## Classification Summary

| Bucket | Count Estimate | Public by Default |
|--------|---------------|-------------------|
| (1) Verifiability-Critical | ~50-70 files | ✅ YES |
| (2) Governance/Meta | ~40-60 files | ❌ NO |
| (3) Internal Doctrine/Contingency | ~100-150 files | ❌ NO |

---

## Notes

- **Frozen artifacts** in `freeze/` directories are always verifiability-critical
- **Specifications** that define formats, APIs, or verification procedures are verifiability-critical
- **Hash files** and cryptographic artifacts are verifiability-critical
- **Legal/terms** documents are governance/meta
- **Defensive/contingency** documents are internal doctrine
- **Design documents** and **archives** are internal doctrine
- **Operational scripts** and **CI** are internal doctrine

---

**Last Updated:** Classification created for artifact access control
**Status:** Complete classification of all non-code artifacts

