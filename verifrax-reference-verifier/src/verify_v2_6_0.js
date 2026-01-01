/**
 * VERIFRAX Reference Verifier v2.6.0
 * 
 * Implements verification for v2.6.0 certificate schema (8 fields, exact order).
 * 
 * Verification steps (order is law):
 * 1. Read certificate bytes as-is
 * 2. Recompute certificate_hash from canonical rules
 * 3. Recompute bundle_hash from bundle bytes
 * 4. Check profile_id equality
 * 5. Re-run deterministic verification logic
 * 6. If all match → VALID
 */

const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

/**
 * Compute SHA-256 hash (64 hex chars, no prefix)
 */
function sha256(data) {
  const hash = createHash('sha256');
  if (Buffer.isBuffer(data)) {
    hash.update(data);
  } else {
    hash.update(data, 'utf8');
  }
  return hash.digest('hex');
}

/**
 * Canonical JSON serialization with exact field order
 * 
 * For v2.6.0, fields must be in this exact order:
 * verifrax_version, certificate_version, bundle_hash, profile_id,
 * verdict, reason_codes, executed_at
 */
function canonicalStringifyV2_6_0(obj) {
  // Build string with fields in exact order
  const parts = [
    `"verifrax_version":${JSON.stringify(obj.verifrax_version)}`,
    `"certificate_version":${JSON.stringify(obj.certificate_version)}`,
    `"bundle_hash":${JSON.stringify(obj.bundle_hash)}`,
    `"profile_id":${JSON.stringify(obj.profile_id)}`,
    `"verdict":${JSON.stringify(obj.verdict)}`,
    `"reason_codes":${JSON.stringify(obj.reason_codes)}`,
    `"executed_at":${JSON.stringify(obj.executed_at)}`
  ];
  return `{${parts.join(',')}}`;
}

/**
 * Canonical JSON serialization for profiles (alphabetical keys)
 */
function canonicalStringifyProfile(obj) {
  if (obj === null) return 'null';
  if (Array.isArray(obj)) {
    const elements = obj.map(canonicalStringifyProfile);
    return `[${elements.join(',')}]`;
  }
  if (obj && typeof obj === 'object') {
    const keys = Object.keys(obj).sort();
    const pairs = keys.map(key => {
      const value = canonicalStringifyProfile(obj[key]);
      return `"${key}":${value}`;
    });
    return `{${pairs.join(',')}}`;
  }
  return JSON.stringify(obj);
}

/**
 * Load published profile hashes
 */
function loadProfileHashes() {
  const hashesPath = path.join(__dirname, '..', '..', 'freeze', 'v2.6.0', 'PROFILE_HASHES.txt');
  
  if (!fs.existsSync(hashesPath)) {
    throw new Error('PROFILE_HASHES.txt not found');
  }
  
  const hashesData = fs.readFileSync(hashesPath, 'utf8');
  const hashes = {};
  
  for (const line of hashesData.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      const hash = parts[0];
      const filename = parts[1];
      hashes[filename] = hash;
    }
  }
  
  return hashes;
}

/**
 * Load profile and verify hash (mandatory for v2.6.0)
 */
function loadProfile(profileId) {
  const profilePath = path.join(__dirname, '..', 'profiles', `${profileId}.json`);
  
  if (!fs.existsSync(profilePath)) {
    throw new Error(`Profile not found: ${profileId}`);
  }
  
  // Load profile JSON
  const profileData = fs.readFileSync(profilePath, 'utf8');
  const profile = JSON.parse(profileData);
  
  // Canonicalize profile
  const canonical = canonicalStringifyProfile(profile);
  
  // Compute hash
  const computedHash = sha256(canonical);
  
  // Load published hashes
  const publishedHashes = loadProfileHashes();
  const expectedHash = publishedHashes[`${profileId}.json`];
  
  if (!expectedHash) {
    throw new Error(`Profile hash not found in PROFILE_HASHES.txt: ${profileId}`);
  }
  
  // Verify hash match
  if (computedHash !== expectedHash) {
    throw new Error(`Profile hash mismatch for ${profileId}. Expected: ${expectedHash}, Computed: ${computedHash}. Profile may be corrupted or tampered.`);
  }
  
  return profile;
}

/**
 * Profile-rule interpreter
 * 
 * Executes verification rules defined in profile.verification_rules[]
 * Rules are data, not code. Engine interprets rules deterministically.
 */
function executeVerificationRules(bundleData, profile) {
  const reasonCodes = [];
  
  // Validate profile structure
  if (!profile.verification_rules || !Array.isArray(profile.verification_rules)) {
    throw new Error('Profile missing verification_rules array');
  }
  
  // Execute rules in profile-defined order
  for (const rule of profile.verification_rules) {
    if (!rule.check) {
      throw new Error('Verification rule missing check field');
    }
    
    if (!rule.failure_reason) {
      throw new Error('Verification rule missing failure_reason field');
    }
    
    // Execute check by name
    let checkPassed = false;
    
    switch (rule.check) {
      case 'bundle_non_empty':
        checkPassed = bundleData.length > 0;
        break;
        
      case 'bundle_size_limit':
        if (typeof rule.max_size_bytes !== 'number') {
          throw new Error('bundle_size_limit rule missing max_size_bytes');
        }
        checkPassed = bundleData.length <= rule.max_size_bytes;
        break;
        
      default:
        throw new Error(`Unknown verification check: ${rule.check}`);
    }
    
    // If check failed, collect reason code
    if (!checkPassed) {
      reasonCodes.push(rule.failure_reason);
    }
  }
  
  // Derive verdict
  if (reasonCodes.length === 0) {
    return {
      verdict: 'verified',
      reasonCodes: []
    };
  } else {
    return {
      verdict: 'not_verified',
      reasonCodes
    };
  }
}

/**
 * Verify v2.6.0 certificate
 */
function verifyCertificateV2_6_0(options) {
  const { bundlePath, certificatePath, profileId } = options;

  // Validate inputs
  if (!bundlePath || !certificatePath || !profileId) {
    return {
      status: 'INVALID',
      reason: 'MISSING_INPUTS'
    };
  }

  // Check files exist
  if (!fs.existsSync(bundlePath)) {
    return {
      status: 'INVALID',
      reason: 'BUNDLE_NOT_FOUND'
    };
  }

  if (!fs.existsSync(certificatePath)) {
    return {
      status: 'INVALID',
      reason: 'CERTIFICATE_NOT_FOUND'
    };
  }

  try {
    // Step 1: Read certificate bytes as-is
    const certificateData = fs.readFileSync(certificatePath, 'utf8');
    const certificate = JSON.parse(certificateData);

    // Validate structure (must have all 8 required fields)
    const requiredFields = [
      'verifrax_version',
      'certificate_version',
      'bundle_hash',
      'profile_id',
      'verdict',
      'reason_codes',
      'executed_at',
      'certificate_hash'
    ];

    for (const field of requiredFields) {
      if (!(field in certificate)) {
        return {
          status: 'INVALID',
          reason: 'MISSING_FIELD',
          field
        };
      }
    }

    const expectedCertificateHash = certificate.certificate_hash;

    // Step 2: Recompute certificate_hash from canonical rules
    const certificateWithoutHash = {
      verifrax_version: certificate.verifrax_version,
      certificate_version: certificate.certificate_version,
      bundle_hash: certificate.bundle_hash,
      profile_id: certificate.profile_id,
      verdict: certificate.verdict,
      reason_codes: certificate.reason_codes,
      executed_at: certificate.executed_at
    };

    const canonical = canonicalStringifyV2_6_0(certificateWithoutHash);
    const computedCertificateHash = sha256(canonical);

    if (computedCertificateHash !== expectedCertificateHash) {
      return {
        status: 'INVALID',
        reason: 'CERTIFICATE_HASH_MISMATCH'
      };
    }

    // Step 3: Recompute bundle_hash from bundle bytes
    const bundleData = fs.readFileSync(bundlePath);
    const computedBundleHash = sha256(bundleData);

    if (computedBundleHash !== certificate.bundle_hash) {
      return {
        status: 'INVALID',
        reason: 'BUNDLE_HASH_MISMATCH'
      };
    }

    // Step 4: Check profile_id equality
    if (certificate.profile_id !== profileId) {
      return {
        status: 'INVALID',
        reason: 'PROFILE_ID_MISMATCH'
      };
    }

    // Step 4.5: Verify profile hash (mandatory for v2.6.0)
    try {
      loadProfile(profileId);
    } catch (error) {
      return {
        status: 'INVALID',
        reason: 'PROFILE_HASH_MISMATCH',
        message: error.message
      };
    }

    // Step 5: Re-run deterministic verification logic (profile-driven)
    const profile = loadProfile(profileId);
    const verificationResult = executeVerificationRules(bundleData, profile);
    
    // Compare computed verdict with certificate verdict
    if (verificationResult.verdict !== certificate.verdict) {
      return {
        status: 'INVALID',
        reason: 'VERDICT_MISMATCH',
        computed_verdict: verificationResult.verdict,
        certificate_verdict: certificate.verdict
      };
    }
    
    // Compare computed reason codes with certificate reason codes
    const computedCodes = JSON.stringify(verificationResult.reasonCodes.sort());
    const certificateCodes = JSON.stringify(certificate.reason_codes.sort());
    if (computedCodes !== certificateCodes) {
      return {
        status: 'INVALID',
        reason: 'REASON_CODES_MISMATCH',
        computed_reason_codes: verificationResult.reasonCodes,
        certificate_reason_codes: certificate.reason_codes
      };
    }
    
    // All checks passed
    return {
      status: 'VALID'
    };

  } catch (error) {
    return {
      status: 'INVALID',
      reason: 'VERIFICATION_ERROR',
      message: error.message
    };
  }
}

module.exports = { verifyCertificateV2_6_0 };

