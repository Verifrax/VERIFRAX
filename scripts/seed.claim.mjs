#!/usr/bin/env node
/**
 * Pre-Dispute Seeding: Create claim at build time
 * 
 * Usage: node scripts/seed.claim.mjs <claim_type> <subject_id> <subject_type> [options]
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function createClaim(claimType, subjectId, subjectType, options = {}) {
  const claim = {
    claim_id: generateUUID(),
    claim_type: claimType,
    subject: {
      identifier: subjectId,
      type: subjectType,
      metadata: options.subjectMetadata || {}
    },
    assertions: options.assertions || [],
    evidence_refs: options.evidenceRefs || [],
    profile_id: options.profileId || 'public@1.0.0',
    issuer: {
      org: options.org || process.env.VERIFRAX_ORG || 'unknown',
      key_id: options.keyId || process.env.VERIFRAX_KEY_ID || 'unknown',
      name: options.issuerName
    },
    issued_at: new Date().toISOString()
  };

  if (options.expiresAt) {
    claim.expires_at = options.expiresAt;
  }

  return claim;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node scripts/seed.claim.mjs <claim_type> <subject_id> <subject_type> [options]');
    console.error('Example: node scripts/seed.claim.mjs media-finality asset-123 artifact');
    process.exit(1);
  }

  const [claimType, subjectId, subjectType] = args;
  
  // Parse options from environment or args
  const options = {
    profileId: process.env.VERIFRAX_PROFILE_ID || 'public@1.0.0',
    org: process.env.VERIFRAX_ORG,
    keyId: process.env.VERIFRAX_KEY_ID,
    assertions: [],
    evidenceRefs: []
  };

  const claim = createClaim(claimType, subjectId, subjectType, options);

  // Write claim to claims directory
  const claimsDir = path.join(ROOT, 'out', 'claims');
  fs.mkdirSync(claimsDir, { recursive: true });
  
  const claimFile = path.join(claimsDir, `${claim.claim_id}.json`);
  fs.writeFileSync(claimFile, JSON.stringify(claim, null, 2));

  console.log(`Claim created: ${claimFile}`);
  console.log(`Claim ID: ${claim.claim_id}`);
  
  // Output claim ID for CI/CD pipelines
  console.log(`::set-output name=claim_id::${claim.claim_id}`);
}

main();

