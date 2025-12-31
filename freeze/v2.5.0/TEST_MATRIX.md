# VERIFRAX v2.5.0 Test Matrix

**Version:** 2.5.0  
**Status:** DRAFT  
**Purpose:** Comprehensive test coverage for v2.5.0

---

## Test Suites

### 1. Determinism Tests

**Objective:** Prove same input → identical output everywhere

#### Test Cases

1. **Same bundle + same certificate → same result**
   - Input: Fixed bundle.bin + certificate.json
   - Expected: Identical verification result across machines
   - Validation: Hash comparison, status comparison

2. **Same classification → same classification output**
   - Input: Certificate with classification
   - Expected: Identical classification extraction
   - Validation: Classification object comparison

3. **Same reason codes → same failure classes**
   - Input: Certificate with reason codes
   - Expected: Identical failure class mapping
   - Validation: Failure class array comparison

4. **Same TCB → same validation result**
   - Input: TCB object
   - Expected: Identical validation result
   - Validation: Validation status and hash comparison

5. **Same profiles → same sorted order**
   - Input: Multi-profile certificate
   - Expected: Identical profile result order
   - Validation: Profile ID order comparison

---

### 2. Negative / Adversarial Tests

**Objective:** Kill ambiguity before release

#### Invalid Bundles

1. **Corrupted bundle.bin**
   - Input: Corrupted bundle file
   - Expected: INVALID status, appropriate reason code
   - Validation: Bundle hash mismatch

2. **Missing bundle.bin**
   - Input: Non-existent bundle file
   - Expected: INVALID status, BUNDLE_NOT_FOUND
   - Validation: Error message check

3. **Invalid bundle hash**
   - Input: Certificate with mismatched bundle_hash
   - Expected: INVALID status, BUNDLE_HASH_MISMATCH
   - Validation: Hash comparison

#### Corrupted TCBs

1. **Invalid TCB schema**
   - Input: TCB with missing required fields
   - Expected: Validation failure, schema_invalid
   - Validation: Schema validation result

2. **Invalid TCB signature structure**
   - Input: TCB with malformed signature
   - Expected: Validation failure, signature_structure_invalid
   - Validation: Signature structure validation result

3. **Revoked TCB**
   - Input: TCB with revocation_status: "revoked"
   - Expected: Validation passes (schema + signature), revocation noted
   - Validation: Validation status check

#### Conflicting Profiles

1. **Multi-profile with duplicate profile IDs**
   - Input: Multi-profile with duplicate profile_id in results
   - Expected: Validation failure or warning
   - Validation: Structure validation result

2. **Multi-profile with mismatched profile count**
   - Input: Multi-profile with profiles.length != results.length
   - Expected: Validation failure
   - Validation: Structure validation result

3. **Multi-profile with unsorted results**
   - Input: Multi-profile with results not sorted by profile_id
   - Expected: Validation failure
   - Validation: Sorting validation result

---

### 3. Regression Tests

**Objective:** v2.4.0 bundles produce identical verification truth

#### Test Cases

1. **v2.4.0 certificate verification**
   - Input: v2.4.0 certificate + bundle
   - Expected: VALID status, identical to v2.4.0 verifier
   - Validation: Result comparison with v2.4.0 verifier

2. **v2.4.0 certificate hash computation**
   - Input: v2.4.0 certificate
   - Expected: Identical certificate_hash computation
   - Validation: Hash comparison

3. **v2.4.0 bundle hash computation**
   - Input: v2.4.0 bundle.bin
   - Expected: Identical bundle_hash computation
   - Validation: Hash comparison

4. **v2.4.0 reason codes**
   - Input: v2.4.0 certificate with reason codes
   - Expected: Identical reason code handling
   - Validation: Reason code array comparison

---

### 4. Misuse Resistance Tests

**Objective:** Ensure labels do not change verification result

#### Test Cases

1. **Classification does not affect verdict**
   - Input: Certificate with classification, same bundle
   - Expected: Same verdict with or without classification
   - Validation: Verdict comparison

2. **Failure classes do not affect verdict**
   - Input: Certificate with failure classes, same bundle
   - Expected: Same verdict with or without failure classes
   - Validation: Verdict comparison

3. **TCB refs do not affect certificate hash**
   - Input: Certificate with TCB refs, same bundle
   - Expected: Same certificate_hash with or without TCB refs
   - Validation: Hash comparison

4. **Multi-profile does not affect single-profile hash**
   - Input: Certificate with multi-profile, same bundle
   - Expected: Certificate hash includes multi-profile (if present)
   - Validation: Hash computation check

5. **Invalid classification does not break verification**
   - Input: Certificate with invalid classification
   - Expected: Verification proceeds, classification validation noted
   - Validation: Status check, classification validation result

6. **Invalid TCB refs do not break verification**
   - Input: Certificate with invalid TCB refs
   - Expected: Verification proceeds, TCB validation noted
   - Validation: Status check, TCB validation result

---

## Test Artifacts

### Test Vectors

1. **v2.4.0 test vectors**
   - Valid v2.4.0 certificate + bundle
   - Invalid v2.4.0 certificate + bundle
   - Edge cases

2. **v2.5.0 test vectors**
   - Valid v2.5.0 certificate with all features
   - Valid v2.5.0 certificate with partial features
   - Invalid v2.5.0 certificate (various failure modes)

3. **Adversarial test vectors**
   - Corrupted bundles
   - Malformed certificates
   - Invalid TCBs
   - Conflicting profiles

### Reproducibility Report

- Test execution environment
- Test results (deterministic)
- Hash values for all test vectors
- Machine-independent validation

### Failure Catalog

- All failure modes documented
- Reason codes mapped
- Failure classes assigned
- No ambiguous failures

---

## Exit Gate

**All failures classified, none ambiguous:**

- ✅ Determinism tests pass
- ✅ Negative/adversarial tests pass
- ✅ Regression tests pass
- ✅ Misuse resistance tests pass
- ✅ All failures classified
- ✅ No ambiguous failures

**Status:** READY FOR TEST IMPLEMENTATION

---

## Next Steps

1. Create test implementation files
2. Generate test vectors
3. Execute test suites
4. Generate reproducibility report
5. Document failure catalog

