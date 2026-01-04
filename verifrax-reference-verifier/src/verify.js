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
 * Level-Up #3: Enhanced to accept profile manifest JSON
 * 
 * @param {Object} options
 * @param {string} options.bundlePath - Path to bundle.bin file
 * @param {string} options.certificatePath - Path to certificate.json file
 * @param {string} options.profileId - Profile ID (e.g., "public@1.0.0")
 * @param {string} [options.profileManifestPath] - Path to profile manifest JSON (optional)
 * @returns {Object} Verification result
 */
function verifyCertificate(options) {
  const { bundlePath, certificatePath, profileId, profileManifestPath } = options;

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

    // Level-Up #3: Verify profile manifest hash if profile manifest is provided
    if (profileManifestPath) {
      if (!fs.existsSync(profileManifestPath)) {
        return {
          status: 'INVALID',
          reason: 'PROFILE_MANIFEST_NOT_FOUND',
          message: `Profile manifest file not found: ${profileManifestPath}`
        };
      }

      const profileManifestData = fs.readFileSync(profileManifestPath, 'utf8');
      const profileManifest = JSON.parse(profileManifestData);
      const computedProfileManifestHash = sha256(profileManifestData);

      // Verify profile manifest hash matches certificate (if present)
      if (certificate.profile_manifest_hash && certificate.profile_manifest_hash !== computedProfileManifestHash) {
        return {
          status: 'INVALID',
          reason: 'PROFILE_MANIFEST_HASH_MISMATCH',
          message: `Computed profile manifest hash (${computedProfileManifestHash}) does not match certificate profile_manifest_hash (${certificate.profile_manifest_hash})`
        };
      }
    }

    // Step 3: Rebuild certificate object (without certificate_hash)
    // Support both v2.6.0 (legacy) and v2.7.0 (hardened) schemas
    let certificateObject;
    
    if (certificate.cert_schema === 1) {
      // v2.7.0 hardened schema (Level-Up #2)
      certificateObject = {
        cert_schema: certificate.cert_schema,
        verifrax_version: certificate.verifrax_version,
        certificate_version: certificate.certificate_version,
        tool_identity: certificate.tool_identity,
        bundle_hash: certificate.bundle_hash,
        profile_id: certificate.profile_id,
        profile_manifest_hash: certificate.profile_manifest_hash,
        evidence_size_bytes: certificate.evidence_size_bytes,
        hash_algorithms: certificate.hash_algorithms,
        execution_context: certificate.execution_context,
        verdict: certificate.verdict,
        reason_codes: certificate.reason_codes,
        executed_at: certificate.executed_at
      };
    } else {
      // Legacy v2.6.0 schema
      certificateObject = {
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
    }

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

// Export both v2.4.0 and v2.5.0 verifiers
const { verifyCertificate: verifyCertificateV2_5_0 } = require('./verify_v2_5_0');

module.exports = { 
  verifyCertificate,
  verifyCertificateV2_5_0
};

