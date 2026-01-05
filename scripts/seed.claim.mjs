#!/usr/bin/env node
/**
 * VERIFRAX Seed Claim Generator
 * 
 * Generates build-time claims for authority non-reentry enforcement.
 * Part of CI authority guardrail.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const [,, command, sha, ...args] = process.argv;

if (command === 'build-provenance' && sha) {
  // Parse assertions from args if provided
  let assertions = [];
  const assertionsArg = args.find(arg => arg.startsWith('--assertions='));
  if (assertionsArg) {
    try {
      assertions = JSON.parse(assertionsArg.split('=')[1]);
    } catch (e) {
      console.error('Failed to parse assertions:', e);
      process.exit(1);
    }
  }
  
  // Create claim object
  const claim = {
    claim_id: `build-${sha.substring(0, 8)}-${Date.now()}`,
    claim_type: 'build-provenance',
    subject: {
      identifier: sha,
      type: 'git-commit'
    },
    assertions: assertions,
    issued_at: new Date().toISOString(),
    verifrax_version: process.env.VERIFRAX_VERSION || '2.7.0',
    profile_id: process.env.VERIFRAX_PROFILE_ID || 'public@1.0.0'
  };
  
  // Ensure output directory exists
  const outDir = path.join(__dirname, '..', 'out', 'claims');
  fs.mkdirSync(outDir, { recursive: true });
  
  // Write claim file
  const claimFile = path.join(outDir, `${claim.claim_id}.json`);
  fs.writeFileSync(claimFile, JSON.stringify(claim, null, 2));
  
  console.log(`Created claim: ${claimFile}`);
  process.exit(0);
} else {
  console.error('Usage: node scripts/seed.claim.mjs build-provenance <sha> run [--assertions=...]');
  process.exit(1);
}

