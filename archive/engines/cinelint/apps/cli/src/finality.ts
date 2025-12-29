/**
 * Finality-First CLI Commands
 * 
 * Commands:
 * - verifrax claim create
 * - verifrax bundle build
 * - verifrax verify
 * - verifrax contradict
 * - verifrax invalidate
 * - verifrax index publish
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function sha256(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function loadVerdict(bundlePath: string): any | null {
  const verdictPath = path.join(bundlePath, 'verdict.json');
  if (fs.existsSync(verdictPath)) {
    return JSON.parse(fs.readFileSync(verdictPath, 'utf8'));
  }
  return null;
}

// REMOVED: printVerdictSummary
// VERDICT-ONLY INTERFACE: Only verdict_id and bundle_hash allowed

export function handleVerify(args: string[]) {
  const bundlePath = args[0] || '.';
  
  if (!fs.existsSync(bundlePath)) {
    console.error(`Error: Bundle path not found: ${bundlePath}`);
    process.exit(1);
  }
  
  // Import verifier
  const { verify } = require('../../../../core/engine/verifier');
  
  // Finalize bundle (adjudicate)
  const verdict = verify({ bundlePath, profileId: 'public@1.0.0' });
  
  // VERDICT-ONLY OUTPUT (hardened)
  // Output only: verdict_id, bundle_hash
  console.log(JSON.stringify({
    verdict_id: verdict.verdict_id,
    bundle_hash: verdict.bundle_hash
  }));
  
  process.exit(verdict.verdict === 'VALID' ? 0 : 1);
}

export function handleClaimCreate(args: string[]) {
  // TODO: Implement claim creation
  console.log('claim create - TODO: Implement');
}

export function handleBundleBuild(args: string[]) {
  // TODO: Implement bundle building
  console.log('bundle build - TODO: Implement');
}

export function handleContradict(args: string[]) {
  // TODO: Implement contradiction detection
  console.log('contradict - TODO: Implement');
}

export function handleInvalidate(args: string[]) {
  // TODO: Implement invalidation
  console.log('invalidate - TODO: Implement');
}

export function handleIndexPublish(args: string[]) {
  // TODO: Implement index publishing
  console.log('index publish - TODO: Implement');
}

export function handleDeliveryRun(args: string[]) {
  // Parse arguments: --in <path> --out <dir> --profile <profile>
  let inputPath = '.';
  let outputDir = '.';
  let profileId = 'delivery_v1@1.0.0';
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--in' && i + 1 < args.length) {
      inputPath = args[i + 1];
      i++;
    } else if (args[i] === '--out' && i + 1 < args.length) {
      outputDir = args[i + 1];
      i++;
    } else if (args[i] === '--profile' && i + 1 < args.length) {
      profileId = args[i + 1];
      i++;
    }
  }
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input path not found: ${inputPath}`);
    process.exit(1);
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Import verifier
  const { verify } = require('../../../../core/engine/verifier');
  const { computeBundleHash } = require('../../../../core/engine/bundle_hash');
  
  // Run verification with delivery_v1 profile
  const verdict = verify({ bundlePath: inputPath, profileId });
  
  // Compute bundle hash
  const bundleHash = computeBundleHash(inputPath);
  
  // Create binary-only output
  const binaryVerdict = {
    verdict_id: verdict.verdict_id,
    bundle_hash: bundleHash
  };
  
  // Write verdict.json (binary-only)
  const verdictPath = path.join(outputDir, 'verdict.json');
  fs.writeFileSync(verdictPath, JSON.stringify(binaryVerdict, null, 2));
  
  // Create evidence bundle (copy input to output/evidence or create zip)
  const evidenceDir = path.join(outputDir, 'evidence');
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }
  
  // Copy bundle contents to evidence directory
  if (fs.statSync(inputPath).isDirectory()) {
    // Copy directory recursively
    function copyRecursive(src: string, dest: string) {
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    copyRecursive(inputPath, evidenceDir);
  } else {
    // If it's a file, copy it
    fs.copyFileSync(inputPath, path.join(evidenceDir, path.basename(inputPath)));
  }
  
  // Output binary verdict to stdout
  console.log(JSON.stringify(binaryVerdict));
  
  process.exit(verdict.verdict === 'VALID' ? 0 : 1);
}

