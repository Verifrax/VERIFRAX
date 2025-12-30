/**
 * VERIFRAX Reference Verifier
 * 
 * This verifier independently validates VERIFRAX certificates without
 * requiring any VERIFRAX infrastructure, services, or availability.
 * 
 * Algorithm (authoritative):
 * 1. Recompute bundle_hash from bundle.bin
 * 2. Rebuild certificate object (without certificate_hash field)
 * 3. Canonical-stringify the certificate object
 * 4. Recompute certificate_hash
 * 5. Compare with certificate.json.certificate_hash
 * 
 * If hashes match → VALID
 * If hashes mismatch → INVALID
 * 
 * No network calls. No timestamps. No side effects.
 */

const fs = require('fs');
const path = require('path');
const { canonicalStringify } = require('./canonical_stringify');
const { sha256, sha256File } = require('./hash');

/**
 * Verify a VERIFRAX certificate
 * 
 * @param {Object} options
 * @param {string} options.bundlePath - Path to bundle.bin file
 * @param {string} options.certificatePath - Path to certificate.json file
 * @param {string} options.profileId - Profile ID (e.g., "public@1.0.0")
 * @returns {Object} Verification result
 */
function verifyCertificate(options) {
  const { bundlePath, certificatePath, profileId } = options;

  // Validate inputs
  if (!bundlePath || !certificatePath || !profileId) {
    return {
      status: 'INVALID',
      reason: 'MISSING_INPUTS',
      message: 'bundlePath, certificatePath, and profileId are required'
    };
  }

  // Check files exist
  if (!fs.existsSync(bundlePath)) {
    return {
      status: 'INVALID',
      reason: 'BUNDLE_NOT_FOUND',
      message: `Bundle file not found: ${bundlePath}`
    };
  }

  if (!fs.existsSync(certificatePath)) {
    return {
      status: 'INVALID',
      reason: 'CERTIFICATE_NOT_FOUND',
      message: `Certificate file not found: ${certificatePath}`
    };
  }

  try {
    // Step 1: Load certificate
    const certificateData = fs.readFileSync(certificatePath, 'utf8');
    const certificate = JSON.parse(certificateData);

    // Validate certificate structure
    if (!certificate.certificate_hash) {
      return {
        status: 'INVALID',
        reason: 'INVALID_CERTIFICATE_STRUCTURE',
        message: 'Certificate missing certificate_hash field'
      };
    }

    const expectedCertificateHash = certificate.certificate_hash;

    // Step 2: Recompute bundle_hash from bundle.bin
    const computedBundleHash = sha256File(bundlePath, fs);

    // Verify bundle_hash matches certificate
    if (certificate.bundle_hash && certificate.bundle_hash !== computedBundleHash) {
      return {
        status: 'INVALID',
        reason: 'BUNDLE_HASH_MISMATCH',
        message: `Computed bundle hash (${computedBundleHash}) does not match certificate bundle_hash (${certificate.bundle_hash})`
      };
    }

    // Step 3: Rebuild certificate object (without certificate_hash)
    // This must match the exact structure used during certificate issuance
    // CRITICAL: Use certificate.bundle_hash (not computedBundleHash) because
    // the certificate hash was computed using the certificate's bundle_hash value.
    // We've already verified that computedBundleHash matches certificate.bundle_hash above.
    const certificateObject = {
      upload_id: certificate.upload_id,
      bundle_hash: certificate.bundle_hash,
      profile_id: certificate.profile_id,
      verifier_version: certificate.verifier_version,
      version_hash: certificate.version_hash,
      verdict: certificate.verdict,
      reason_codes: certificate.reason_codes,
      verdict_hash: certificate.verdict_hash,
      executed_at: certificate.executed_at,
      finality_statement: certificate.finality_statement
    };

    // Step 4: Canonical-stringify
    const certificateCanonical = canonicalStringify(certificateObject);

    // Step 5: Recompute certificate_hash
    const computedCertificateHash = sha256(certificateCanonical);

    // Step 6: Compare
    if (computedCertificateHash !== expectedCertificateHash) {
      return {
        status: 'INVALID',
        reason: 'CERTIFICATE_HASH_MISMATCH',
        message: `Computed certificate hash (${computedCertificateHash}) does not match certificate.certificate_hash (${expectedCertificateHash})`,
        computed_hash: computedCertificateHash,
        expected_hash: expectedCertificateHash
      };
    }

    // All checks passed
    return {
      status: 'VALID',
      certificate_hash: computedCertificateHash,
      verifier_version: certificate.verifier_version || '2.4.0',
      bundle_hash: computedBundleHash
    };

  } catch (error) {
    return {
      status: 'INVALID',
      reason: 'VERIFICATION_ERROR',
      message: error.message,
      error: error.stack
    };
  }
}

module.exports = { verifyCertificate };

