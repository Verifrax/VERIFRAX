/**
 * Failure Class Taxonomy (v2.5.0)
 * 
 * CRITICAL: Failure classes are taxonomic only, not enforcement.
 * Failure classes do not affect verification logic or certificate hash.
 * 
 * No network calls. No external dependencies. Deterministic.
 */

/**
 * Map reason code to failure class
 * 
 * @param {string} reasonCode - Reason code (e.g., "VFX-EVIDENCE-0100")
 * @returns {Object|null} Failure class object or null if not mappable
 */
function mapReasonCodeToFailureClass(reasonCode) {
  if (!reasonCode || typeof reasonCode !== 'string') {
    return null;
  }

  // Parse reason code: VFX-<CATEGORY>-<NUMBER>
  const match = reasonCode.match(/^VFX-([A-Z]+)-([0-9]{4})$/);
  if (!match) {
    return null;
  }

  const category = match[1].toLowerCase();
  const number = match[2];

  // Map category to failure class category
  const categoryMap = {
    'EVIDENCE': 'evidence',
    'CLAIM': 'claims',
    'CONTRADICTION': 'contradiction',
    'PROFILE': 'profile',
    'SIGNATURE': 'signature',
    'SCHEMA': 'schema',
    'INVALIDATION': 'invalidation'
  };

  const failureCategory = categoryMap[category] || 'unknown';

  // Determine severity based on category and number
  // This is deterministic mapping, not interpretation
  let severity = 'info';
  if (category === 'EVIDENCE' && number.startsWith('01')) {
    severity = 'verification_blocking';
  } else if (category === 'CLAIM' && number.startsWith('01')) {
    severity = 'error';
  } else if (category === 'CONTRADICTION') {
    severity = 'verification_blocking';
  } else if (category === 'PROFILE') {
    severity = 'error';
  } else if (category === 'SIGNATURE') {
    severity = 'error';
  } else if (category === 'SCHEMA') {
    severity = 'error';
  } else if (category === 'INVALIDATION') {
    severity = 'verification_blocking';
  }

  return {
    category: failureCategory,
    severity: severity,
    code: reasonCode,
    description: `Failure class for ${reasonCode}`
  };
}

/**
 * Extract failure classes from certificate
 * 
 * @param {Object} certificate - Certificate object
 * @returns {Array} Array of failure class objects
 */
function extractFailureClasses(certificate) {
  if (!certificate.reason_codes || !Array.isArray(certificate.reason_codes)) {
    return [];
  }

  const failureClasses = [];
  for (const reasonCode of certificate.reason_codes) {
    const failureClass = mapReasonCodeToFailureClass(reasonCode);
    if (failureClass) {
      failureClasses.push(failureClass);
    }
  }

  return failureClasses;
}

module.exports = { mapReasonCodeToFailureClass, extractFailureClasses };

