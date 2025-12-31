/**
 * Verification Classification (v2.5.0)
 * 
 * CRITICAL: Classification is informational only, not authoritative.
 * Classification does not affect verification logic or certificate hash.
 * 
 * No network calls. No external dependencies. Deterministic.
 */

/**
 * Determine classification types for a certificate
 * 
 * @param {Object} certificate - Certificate object
 * @returns {Object|null} Classification object or null if not applicable
 */
function classifyCertificate(certificate) {
  // Classification is optional - return null if not present
  if (!certificate.classification) {
    return null;
  }

  // Validate classification structure
  if (!certificate.classification.types || !Array.isArray(certificate.classification.types)) {
    return null;
  }

  // Return classification (informational only)
  return {
    types: certificate.classification.types,
    primary: certificate.classification.primary || null,
    scope: certificate.classification.scope || null
  };
}

/**
 * Validate classification structure
 * 
 * @param {Object} classification - Classification object
 * @returns {Object} Validation result
 */
function validateClassification(classification) {
  if (!classification) {
    return { valid: true, reason: null };
  }

  if (!classification.types || !Array.isArray(classification.types)) {
    return {
      valid: false,
      reason: 'Classification types must be an array'
    };
  }

  const validTypes = ['evidentiary_metadata', 'procedural_metadata', 'archival_metadata'];
  for (const type of classification.types) {
    if (!validTypes.includes(type)) {
      return {
        valid: false,
        reason: `Invalid classification type: ${type}`
      };
    }
  }

  if (classification.primary && !validTypes.includes(classification.primary)) {
    return {
      valid: false,
      reason: `Invalid primary classification type: ${classification.primary}`
    };
  }

  return { valid: true, reason: null };
}

module.exports = { classifyCertificate, validateClassification };

