#!/usr/bin/env node
/**
 * VERIFRAX Package Verifier
 * 
 * Validates evidence package:
 * - Validates hashes
 * - Validates certificate hash
 * - Validates version == v2.4.0
 * 
 * Output: VALID or INVALID only
 */

const fs = require('fs');
const path = require('path');
const { verifyCertificate } = require('./src/verify');
const { sha256 } = require('./src/hash');
const { canonicalStringify } = require('./src/canonical_stringify');

function verifyPackage(packagePath) {
  try {
    // Check package exists
    if (!fs.existsSync(packagePath)) {
      return 'INVALID';
    }

    const certPath = path.join(packagePath, 'certificate.v2.4.0.json');
    const bundleHashPath = path.join(packagePath, 'bundle_hash.txt');
    const verifierVersionPath = path.join(packagePath, 'verifier_version.txt');
    const sha256sumsPath = path.join(packagePath, 'SHA256SUMS.txt');

    // Check required files exist
    if (!fs.existsSync(certPath) || 
        !fs.existsSync(bundleHashPath) || 
        !fs.existsSync(verifierVersionPath) ||
        !fs.existsSync(sha256sumsPath)) {
      return 'INVALID';
    }

    // Load certificate
    const certificate = JSON.parse(fs.readFileSync(certPath, 'utf8'));

    // Validate version == v2.4.0
    const verifierVersion = fs.readFileSync(verifierVersionPath, 'utf8').trim();
    if (verifierVersion !== 'v2.4.0' && certificate.verifier_version !== '2.4.0') {
      return 'INVALID';
    }

    // Validate certificate hash
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

    const certificateCanonical = canonicalStringify(certificateObject);
    const computedCertificateHash = sha256(certificateCanonical);

    if (computedCertificateHash !== certificate.certificate_hash) {
      return 'INVALID';
    }

    // Validate bundle hash matches
    const bundleHash = fs.readFileSync(bundleHashPath, 'utf8').trim();
    if (bundleHash !== certificate.bundle_hash) {
      return 'INVALID';
    }

    // Validate SHA256SUMS
    const sha256sums = fs.readFileSync(sha256sumsPath, 'utf8');
    const lines = sha256sums.split('\n').filter(l => l.trim());
    
    // Verify certificate hash in SHA256SUMS
    const certHashLine = lines.find(l => l.includes('certificate.v2.4.0.json'));
    if (certHashLine) {
      const expectedHash = certHashLine.split(/\s+/)[0];
      const certFileHash = sha256(fs.readFileSync(certPath, 'utf8'));
      if (certFileHash.replace('sha256:', '') !== expectedHash) {
        return 'INVALID';
      }
    }

    return 'VALID';

  } catch (error) {
    return 'INVALID';
  }
}

// CLI
if (require.main === module) {
  const packagePath = process.argv[2];
  if (!packagePath) {
    process.exit(1);
  }
  const result = verifyPackage(packagePath);
  console.log(result);
  process.exit(result === 'VALID' ? 0 : 1);
}

module.exports = { verifyPackage };

