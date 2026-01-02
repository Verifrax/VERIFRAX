#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

const VERIFRAX_VERSION = '2.7.0';
const CERTIFICATE_VERSION = '1.0.0';

function sha256(data) {
  const hash = createHash('sha256');
  if (Buffer.isBuffer(data)) {
    hash.update(data);
  } else {
    hash.update(data, 'utf8');
  }
  return hash.digest('hex');
}

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

function canonicalStringifyFinal(certificate) {
  const parts = [
    `"verifrax_version":${JSON.stringify(certificate.verifrax_version)}`,
    `"certificate_version":${JSON.stringify(certificate.certificate_version)}`,
    `"bundle_hash":${JSON.stringify(certificate.bundle_hash)}`,
    `"profile_id":${JSON.stringify(certificate.profile_id)}`,
    `"verdict":${JSON.stringify(certificate.verdict)}`,
    `"reason_codes":${JSON.stringify(certificate.reason_codes)}`,
    `"executed_at":${JSON.stringify(certificate.executed_at)}`,
    `"certificate_hash":${JSON.stringify(certificate.certificate_hash)}`
  ];
  return `{${parts.join(',')}}`;
}

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

function loadProfile(profileId) {
  const profilePath = path.join(__dirname, '..', 'verifrax-reference-verifier', 'profiles', `${profileId}.json`);
  
  if (!fs.existsSync(profilePath)) {
    throw new Error(`Profile not found: ${profileId}`);
  }
  
  const profileData = fs.readFileSync(profilePath, 'utf8');
  const profile = JSON.parse(profileData);
  
  const canonical = canonicalStringifyProfile(profile);
  const computedHash = sha256(canonical);
  
  const publishedHashes = loadProfileHashes();
  const expectedHash = publishedHashes[`${profileId}.json`];
  
  if (!expectedHash) {
    throw new Error(`Profile hash not found in PROFILE_HASHES.txt: ${profileId}`);
  }
  
  if (computedHash !== expectedHash) {
    throw new Error(`Profile hash mismatch for ${profileId}. Expected: ${expectedHash}, Computed: ${computedHash}. Profile may be corrupted or tampered.`);
  }
  
  return profile;
}

function executeVerificationRules(bundleData, profile) {
  const reasonCodes = [];
  
  if (!profile.verification_rules || !Array.isArray(profile.verification_rules)) {
    throw new Error('Profile missing verification_rules array');
  }
  
  for (const rule of profile.verification_rules) {
    if (!rule.check) {
      throw new Error('Verification rule missing check field');
    }
    
    if (!rule.failure_reason) {
      throw new Error('Verification rule missing failure_reason field');
    }
    
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
    
    if (!checkPassed) {
      reasonCodes.push(rule.failure_reason);
    }
  }
  
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

function execute(bundlePath, profileId, outputPath = null) {
  if (!fs.existsSync(bundlePath)) {
    throw new Error(`Bundle file not found: ${bundlePath}`);
  }
  
  const profileIdPattern = /^[a-z_]+@[0-9]+\.[0-9]+\.[0-9]+$/;
  if (!profileIdPattern.test(profileId)) {
    throw new Error(`Invalid profile ID format: ${profileId}`);
  }
  
  const bundleData = fs.readFileSync(bundlePath);
  const bundleHash = sha256(bundleData);
  
  const profile = loadProfile(profileId);
  
  const verificationResult = executeVerificationRules(bundleData, profile);
  
  const executedAt = generateTimestamp();
  
  const certificateWithoutHash = {
    verifrax_version: VERIFRAX_VERSION,
    certificate_version: CERTIFICATE_VERSION,
    bundle_hash: bundleHash,
    profile_id: profileId,
    verdict: verificationResult.verdict,
    reason_codes: verificationResult.reasonCodes,
    executed_at: executedAt
  };
  
  const canonical = canonicalStringify(certificateWithoutHash);
  const certificateHash = sha256(canonical);
  
  const certificate = {
    ...certificateWithoutHash,
    certificate_hash: certificateHash
  };
  
  const finalCertificate = canonicalStringifyFinal(certificate);
  
  if (outputPath) {
    fs.writeFileSync(outputPath, finalCertificate, 'utf8');
  } else {
    console.log(finalCertificate);
  }
  
  return certificate;
}

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
  node execute_v2_7_0.js --bundle <path> --profile <profile_id> [--output <path>]

Options:
  --bundle <path>    Path to evidence bundle binary file
  --profile <id>     Profile identifier (e.g., "public@1.0.0")
  --output <path>    Output path for certificate (default: stdout)
  --help, -h         Show this help message

Example:
  node execute_v2_7_0.js --bundle test/bundle.bin --profile public@1.0.0
      `);
      process.exit(0);
    }
  }
  
  return options;
}

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
    
    process.exit(0);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { execute };

