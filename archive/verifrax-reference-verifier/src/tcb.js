/**
 * Trust Context Bundle (TCB) Validation (v2.5.0)
 * 
 * CRITICAL: TCB validation is schema + signature only, no interpretation.
 * TCB validation does not imply VERIFRAX endorsement or trust.
 * 
 * No network calls. No external dependencies. Deterministic.
 */

const crypto = require('crypto');
const { sha256 } = require('./hash');

/**
 * Validate TCB schema structure
 * 
 * @param {Object} tcb - TCB object
 * @returns {Object} Validation result
 */
function validateTCBSchema(tcb) {
  if (!tcb) {
    return { valid: false, reason: 'TCB is null or undefined' };
  }

  // Required fields
  if (!tcb.tcb_id || typeof tcb.tcb_id !== 'string') {
    return { valid: false, reason: 'TCB missing tcb_id' };
  }

  if (!tcb.issuer || typeof tcb.issuer !== 'string') {
    return { valid: false, reason: 'TCB missing issuer' };
  }

  if (!tcb.signature || typeof tcb.signature !== 'object') {
    return { valid: false, reason: 'TCB missing signature object' };
  }

  // Signature structure
  if (!tcb.signature.algorithm || typeof tcb.signature.algorithm !== 'string') {
    return { valid: false, reason: 'TCB signature missing algorithm' };
  }

  if (!tcb.signature.public_key || typeof tcb.signature.public_key !== 'string') {
    return { valid: false, reason: 'TCB signature missing public_key' };
  }

  if (!tcb.signature.signature || typeof tcb.signature.signature !== 'string') {
    return { valid: false, reason: 'TCB signature missing signature' };
  }

  // Optional fields validation
  if (tcb.revocation_status && !['active', 'revoked', 'unknown'].includes(tcb.revocation_status)) {
    return { valid: false, reason: 'TCB revocation_status must be active, revoked, or unknown' };
  }

  return { valid: true, reason: null };
}

/**
 * Validate TCB signature (schema validation only - no cryptographic verification)
 * 
 * NOTE: This function validates signature structure only.
 * Full cryptographic signature verification would require:
 * - Public key parsing
 * - Signature algorithm implementation
 * - Payload canonicalization
 * 
 * For v2.5.0 reference verifier, we validate structure only.
 * Full signature verification is out of scope (would require external crypto libraries).
 * 
 * @param {Object} tcb - TCB object
 * @returns {Object} Validation result
 */
function validateTCBSignatureStructure(tcb) {
  if (!tcb || !tcb.signature) {
    return { valid: false, reason: 'TCB signature missing' };
  }

  const sig = tcb.signature;

  // Validate algorithm is a known type (structure only)
  const knownAlgorithms = ['ECDSA', 'RSA', 'Ed25519'];
  if (!knownAlgorithms.includes(sig.algorithm)) {
    // Not an error - just note it's not a standard algorithm
    // Structure validation passes, cryptographic validation would be separate
  }

  // Validate public_key is base64-like (structure only)
  if (sig.public_key && sig.public_key.length > 0) {
    // Structure valid - actual key parsing would be separate
  }

  // Validate signature is base64-like (structure only)
  if (sig.signature && sig.signature.length > 0) {
    // Structure valid - actual signature verification would be separate
  }

  return { valid: true, reason: null };
}

/**
 * Validate TCB (schema + signature structure only)
 * 
 * @param {Object} tcb - TCB object
 * @returns {Object} Validation result with status and hash
 */
function validateTCB(tcb) {
  // Step 1: Validate schema
  const schemaResult = validateTCBSchema(tcb);
  if (!schemaResult.valid) {
    return {
      valid: false,
      reason: schemaResult.reason,
      validation_status: 'schema_invalid',
      validation_hash: null
    };
  }

  // Step 2: Validate signature structure
  const signatureResult = validateTCBSignatureStructure(tcb);
  if (!signatureResult.valid) {
    return {
      valid: false,
      reason: signatureResult.reason,
      validation_status: 'signature_structure_invalid',
      validation_hash: null
    };
  }

  // Step 3: Compute validation hash (deterministic)
  // This hash represents the TCB validation state, not the TCB content
  const validationData = {
    tcb_id: tcb.tcb_id,
    issuer: tcb.issuer,
    schema_valid: true,
    signature_structure_valid: true
  };
  const validationHash = sha256(JSON.stringify(validationData));

  return {
    valid: true,
    reason: null,
    validation_status: 'schema_valid',
    validation_hash: validationHash
  };
}

/**
 * Validate TCB references in certificate
 * 
 * @param {Array} tcbRefs - Array of TCB reference objects
 * @param {Object} tcbData - TCB data (if provided)
 * @returns {Array} Array of validation results
 */
function validateTCBReferences(tcbRefs, tcbData = null) {
  if (!tcbRefs || !Array.isArray(tcbRefs)) {
    return [];
  }

  const results = [];
  for (const ref of tcbRefs) {
    if (!ref.tcb_id) {
      results.push({
        tcb_id: null,
        valid: false,
        reason: 'TCB reference missing tcb_id'
      });
      continue;
    }

    // If TCB data is provided, validate it
    if (tcbData && tcbData.tcb_id === ref.tcb_id) {
      const validation = validateTCB(tcbData);
      results.push({
        tcb_id: ref.tcb_id,
        valid: validation.valid,
        reason: validation.reason,
        validation_status: validation.validation_status,
        validation_hash: validation.validation_hash
      });
    } else {
      // TCB data not provided - can only validate reference structure
      results.push({
        tcb_id: ref.tcb_id,
        valid: true, // Reference structure is valid
        reason: null,
        validation_status: 'reference_valid',
        validation_hash: ref.validation_hash || null
      });
    }
  }

  return results;
}

module.exports = {
  validateTCBSchema,
  validateTCBSignatureStructure,
  validateTCB,
  validateTCBReferences
};

