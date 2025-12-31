#!/usr/bin/env node
/**
 * VERIFRAX Reference Verifier CLI
 * 
 * Command-line interface for independently verifying VERIFRAX certificates.
 * 
 * Usage:
 *   node cli.js --bundle bundle.bin --certificate certificate.json --profile public@1.0.0
 * 
 * Output: Machine-readable JSON (no prose, no interpretation)
 */

const { verifyCertificate } = require('./src/verify');
const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  // Minimal CLI: verify certificate.json
  if (args.length === 1 && !args[0].startsWith('--')) {
    const certPath = args[0];
    // Try to infer bundle and profile from certificate location
    const certDir = path.dirname(path.resolve(certPath));
    const bundlePath = path.join(certDir, 'bundle.bin');
    if (fs.existsSync(bundlePath)) {
      options.certificatePath = path.resolve(certPath);
      options.bundlePath = bundlePath;
      // Default profile if not specified
      options.profileId = 'public@1.0.0';
      return options;
    }
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--bundle' && i + 1 < args.length) {
      options.bundlePath = args[++i];
    } else if (arg === '--certificate' && i + 1 < args.length) {
      options.certificatePath = args[++i];
    } else if (arg === '--profile' && i + 1 < args.length) {
      options.profileId = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
VERIFRAX Reference Verifier v2.4.0

Usage:
  verify <certificate.json>
  node cli.js --bundle <path> --certificate <path> --profile <profile_id>

Options:
  <certificate.json>     Minimal: verify certificate (infers bundle.bin from same directory)
  --bundle <path>        Path to bundle.bin file
  --certificate <path>   Path to certificate.json file
  --profile <profile>   Profile ID (e.g., "public@1.0.0", default: public@1.0.0)
  --help, -h            Show this help message

Output:
  Machine-readable JSON to stdout:
  {
    "status": "VALID" | "INVALID",
    "certificate_hash": "sha256:...",
    "verifier_version": "2.4.0",
    ...
  }

Exit codes:
  0 - Certificate is VALID
  1 - Certificate is INVALID or error occurred
      `);
      process.exit(0);
    }
  }

  return options;
}

function main() {
  const options = parseArgs();

  // Validate required arguments
  if (!options.bundlePath || !options.certificatePath || !options.profileId) {
    console.error(JSON.stringify({
      status: 'INVALID',
      reason: 'MISSING_ARGUMENTS',
      message: '--bundle, --certificate, and --profile are required'
    }));
    process.exit(1);
  }

  // Resolve absolute paths
  const bundlePath = path.resolve(options.bundlePath);
  const certificatePath = path.resolve(options.certificatePath);

  // Verify certificate
  const result = verifyCertificate({
    bundlePath,
    certificatePath,
    profileId: options.profileId
  });

  // Output result as JSON
  console.log(JSON.stringify(result, null, 2));

  // Exit with appropriate code
  if (result.status === 'VALID') {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(JSON.stringify({
      status: 'INVALID',
      reason: 'INTERNAL_ERROR',
      message: error.message,
      error: error.stack
    }));
    process.exit(1);
  }
}

module.exports = { main };

