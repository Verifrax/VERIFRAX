/**
 * Multi-Profile Support (v2.5.0)
 * 
 * CRITICAL: Multi-profile results are parallel, non-collapsing, non-authoritative.
 * Multi-profile does not imply compliance verification or dispute resolution.
 * 
 * No network calls. No external dependencies. Deterministic.
 */

const { canonicalStringify } = require('./canonical_stringify');
const { sha256 } = require('./hash');

/**
 * Validate multi-profile structure
 * 
 * @param {Object} multiProfile - Multi-profile object
 * @returns {Object} Validation result
 */
function validateMultiProfileStructure(multiProfile) {
  if (!multiProfile) {
    return { valid: true, reason: null }; // Multi-profile is optional
  }

  if (!multiProfile.profiles || !Array.isArray(multiProfile.profiles)) {
    return {
      valid: false,
      reason: 'Multi-profile profiles must be an array'
    };
  }

  if (multiProfile.profiles.length === 0) {
    return {
      valid: false,
      reason: 'Multi-profile profiles array cannot be empty'
    };
  }

  // Validate profile IDs
  for (const profileId of multiProfile.profiles) {
    if (typeof profileId !== 'string' || !profileId.match(/^[a-z_]+@[0-9]+\.[0-9]+\.[0-9]+$/)) {
      return {
        valid: false,
        reason: `Invalid profile ID format: ${profileId}`
      };
    }
  }

  if (!multiProfile.results || !Array.isArray(multiProfile.results)) {
    return {
      valid: false,
      reason: 'Multi-profile results must be an array'
    };
  }

  if (multiProfile.results.length !== multiProfile.profiles.length) {
    return {
      valid: false,
      reason: 'Multi-profile results length must match profiles length'
    };
  }

  // Validate each result has profile_id and verdict
  for (const result of multiProfile.results) {
    if (!result.profile_id || typeof result.profile_id !== 'string') {
      return {
        valid: false,
        reason: 'Multi-profile result missing profile_id'
      };
    }

    if (!result.verdict || typeof result.verdict !== 'string') {
      return {
        valid: false,
        reason: 'Multi-profile result missing verdict'
      };
    }

    // Verify profile_id is in profiles array
    if (!multiProfile.profiles.includes(result.profile_id)) {
      return {
        valid: false,
        reason: `Multi-profile result profile_id ${result.profile_id} not in profiles array`
      };
    }
  }

  // Verify execution_mode
  if (multiProfile.execution_mode && multiProfile.execution_mode !== 'parallel') {
    return {
      valid: false,
      reason: `Multi-profile execution_mode must be 'parallel'`
    };
  }

  return { valid: true, reason: null };
}

/**
 * Sort profile results deterministically (by profile_id)
 * 
 * @param {Array} results - Array of profile results
 * @returns {Array} Sorted array of profile results
 */
function sortProfileResults(results) {
  return [...results].sort((a, b) => {
    if (a.profile_id < b.profile_id) return -1;
    if (a.profile_id > b.profile_id) return 1;
    return 0;
  });
}

/**
 * Validate multi-profile results are sorted correctly
 * 
 * @param {Object} multiProfile - Multi-profile object
 * @returns {Object} Validation result
 */
function validateMultiProfileSorting(multiProfile) {
  if (!multiProfile || !multiProfile.results) {
    return { valid: true, reason: null };
  }

  const sorted = sortProfileResults(multiProfile.results);
  const current = multiProfile.results;

  // Check if current order matches sorted order
  if (sorted.length !== current.length) {
    return {
      valid: false,
      reason: 'Multi-profile results length mismatch after sorting'
    };
  }

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].profile_id !== current[i].profile_id) {
      return {
        valid: false,
        reason: 'Multi-profile results are not sorted by profile_id'
      };
    }
  }

  return { valid: true, reason: null };
}

/**
 * Extract multi-profile information from certificate
 * 
 * @param {Object} certificate - Certificate object
 * @returns {Object|null} Multi-profile object or null
 */
function extractMultiProfile(certificate) {
  if (!certificate.multi_profile) {
    return null;
  }

  return {
    profiles: certificate.multi_profile.profiles || [],
    execution_mode: certificate.multi_profile.execution_mode || 'parallel',
    results: certificate.multi_profile.results || []
  };
}

module.exports = {
  validateMultiProfileStructure,
  sortProfileResults,
  validateMultiProfileSorting,
  extractMultiProfile
};

