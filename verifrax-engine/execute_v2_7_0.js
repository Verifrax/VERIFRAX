#!/usr/bin/env node
/**
 * VERIFRAX Execution Engine v2.7.0
 * 
 * Deterministic execution pipeline that produces certificates.
 * 
 * Usage:
 *   node execute_v2.7.0.js --bundle <path> --profile <profile_id> [--output <path>]
 * 
 * If --output is omitted, certificate is written to stdout.
 */

const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

const VERIFRAX_VERSION = '2.6.0';
const CERTIFICATE_VERSION = '1.0.0';

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
 * Fields must be in this exact order:
 * verifrax_version, certificate_version, bundle_hash, profile_id,
 * verdict, reason_codes, executed_at
 */
function canonicalStringify(obj) {
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
 * Generate RFC3339 timestamp with millisecond precision (UTC)
 */
function generateTimestamp() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hour = String(now.getUTCHours()).padStart(2, '0');
  const minute = String(now.getUTCMinutes()).padStart(2, '0');
  const second = String(now.getUTCSeconds()).padStart(2, '0');
  const millisecond = String(now.getUTCMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`;
}

/**
 * Load published profile hashes
 */
function loadProfileHashes() {
  const hashesPath = path.join(__dirname, '..', 'freeze', 'v2.7.0', 'PROFILE_HASHES.txt');
  
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
 * Load profile and verify hash (mandatory for v2.7.0)
 */
function loadProfile(profileId) {
  // Profile file location: verifrax-reference-verifier/profiles/{profileId}.json
  const profilePath = path.join(__dirname, '..', 'verifrax-reference-verifier', 'profiles', `${profileId}.json`);
  
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
 * Execute the pipeline
 */
function execute(bundlePath, profileId, outputPath = null) {
  // Step 1: Validate inputs
  if (!fs.existsSync(bundlePath)) {
    throw new Error(`Bundle file not found: ${bundlePath}`);
  }
  
  // Validate profile ID format
  const profileIdPattern = /^[a-z_]+@[0-9]+\.[0-9]+\.[0-9]+$/;
  if (!profileIdPattern.test(profileId)) {
    throw new Error(`Invalid profile ID format: ${profileId}`);
  }
  
  // Step 2: Read bundle and compute hash
  const bundleData = fs.readFileSync(bundlePath);
  const bundleHash = sha256(bundleData);
  
  // Step 3: Load profile
  const profile = loadProfile(profileId);
  
  // Step 4: Execute deterministic verification (profile-driven)
  const verificationResult = executeVerificationRules(bundleData, profile);
  
  // Step 5: Generate timestamp
  const executedAt = generateTimestamp();
  
  // Step 6: Build certificate object (without hash)
  const certificateWithoutHash = {
    verifrax_version: VERIFRAX_VERSION,
    certificate_version: CERTIFICATE_VERSION,
    bundle_hash: bundleHash,
    profile_id: profileId,
    verdict: verificationResult.verdict,
    reason_codes: verificationResult.reasonCodes,
    executed_at: executedAt
  };
  
  // Step 7: Canonical serialization
  const canonical = canonicalStringify(certificateWithoutHash);
  
  // Step 8: Compute certificate hash
  const certificateHash = sha256(canonical);
  
  // Step 9: Build final certificate
  const certificate = {
    ...certificateWithoutHash,
    certificate_hash: certificateHash
  };
  
  // Step 10: Serialize final certificate
  const finalCertificate = JSON.stringify(certificate);
  
  // Step 11: Output
  if (outputPath) {
    fs.writeFileSync(outputPath, finalCertificate, 'utf8');
  } else {
    console.log(finalCertificate);
  }
  
  return certificate;
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--bundle' && i + 1 < args.length) {
      options.bundlePath = args[++i];
    } else if (arg === '--profile' && i + 1 < args.length) {
      options.profileId = args[++i];
    } else if (arg === '--output' && i + 1 < args.length) {
      options.outputPath = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
VERIFRAX Execution Engine v2.7.0

Usage:
  node execute_v2.7.0.js --bundle <path> --profile <profile_id> [--output <path>]

Options:
  --bundle <path>    Path to evidence bundle binary file
  --profile <id>     Profile identifier (e.g., "public@1.0.0")
  --output <path>    Output path for certificate (default: stdout)
  --help, -h         Show this help message

Example:
  node execute_v2.7.0.js --bundle test/bundle.bin --profile public@1.0.0
      `);
      process.exit(0);
    }
  }
  
  return options;
}

/**
 * Main entry point
 */
function main() {
  try {
    const options = parseArgs();
    
    if (!options.bundlePath || !options.profileId) {
      console.error('Error: --bundle and --profile are required');
      console.error('Use --help for usage information');
      process.exit(1);
    }
    
    const certificate = execute(
      options.bundlePath,
      options.profileId,
      options.outputPath
    );
    
    // Exit successfully
    process.exit(0);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { execute };

