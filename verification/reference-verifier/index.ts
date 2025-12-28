/**
 * Reference Verifier for Delivery Evidence Bundles
 * 
 * Binary-only output: { "verdict_id": "...", "bundle_hash": "..." }
 */

import fs from 'fs';
import path from 'path';
import { verify } from '../../core/engine/verifier';
import { computeBundleHash } from '../../core/engine/bundle_hash';

export interface VerifierOptions {
  bundlePath: string;
  profileId?: string;
}

/**
 * Verify delivery evidence bundle
 * 
 * Output: Binary-only { "verdict_id": "...", "bundle_hash": "..." }
 */
export function verifyBundle(options: VerifierOptions): { verdict_id: string; bundle_hash: string } {
  const { bundlePath, profileId = 'delivery_v1@1.0.0' } = options;
  
  if (!fs.existsSync(bundlePath)) {
    throw new Error(`Bundle path not found: ${bundlePath}`);
  }
  
  // Run verification
  const verdict = verify({ bundlePath, profileId });
  
  // Compute bundle hash
  const bundleHash = computeBundleHash(bundlePath);
  
  // Return binary-only output
  return {
    verdict_id: verdict.verdict_id,
    bundle_hash: bundleHash
  };
}

/**
 * CLI entry point
 */
if (require.main === module) {
  const bundlePath = process.argv[2] || '.';
  const profileId = process.argv[3] || 'delivery_v1@1.0.0';
  
  try {
    const result = verifyBundle({ bundlePath, profileId });
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

