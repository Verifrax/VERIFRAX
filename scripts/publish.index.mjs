#!/usr/bin/env node
/**
 * Publish to Truth Index
 * 
 * Usage: node scripts/publish.index.mjs <bundle_path> [options]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function appendNDJSON(filePath, data) {
  const line = JSON.stringify(data) + '\n';
  fs.appendFileSync(filePath, line);
}

function publishBundle(bundlePath, indexDir) {
  const bundleManifestPath = path.join(bundlePath, 'bundle.json');
  if (!fs.existsSync(bundleManifestPath)) {
    throw new Error(`Bundle manifest not found: ${bundleManifestPath}`);
  }

  const bundle = JSON.parse(fs.readFileSync(bundleManifestPath, 'utf8'));
  
  // Publish to bundles.ndjson
  const bundlesFile = path.join(indexDir, 'bundles.ndjson');
  appendNDJSON(bundlesFile, {
    bundle_hash: bundle.bundle_hash || 'TBD',
    bundle_id: bundle.bundle_id,
    created_at: bundle.created_at,
    profile_id: bundle.profile_id
  });

  // Publish claims
  if (bundle.claims) {
    const claimsFile = path.join(indexDir, 'claims.ndjson');
    for (const claimRef of bundle.claims) {
      const claimPath = path.join(bundlePath, claimRef.file);
      if (fs.existsSync(claimPath)) {
        const claim = JSON.parse(fs.readFileSync(claimPath, 'utf8'));
        appendNDJSON(claimsFile, claim);
      }
    }
  }

  // Publish edges
  const edgesFile = path.join(indexDir, 'edges.ndjson');
  if (bundle.claims) {
    for (const claimRef of bundle.claims) {
      const claimPath = path.join(bundlePath, claimRef.file);
      if (fs.existsSync(claimPath)) {
        const claim = JSON.parse(fs.readFileSync(claimPath, 'utf8'));
        
        // Claim -> Evidence edges
        for (const evidenceRef of claim.evidence_refs || []) {
          appendNDJSON(edgesFile, {
            from: claim.claim_id,
            to: evidenceRef.evidence_id,
            relationship: 'supports',
            type: 'claim-evidence'
          });
        }
      }
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node scripts/publish.index.mjs <bundle_path> [index_dir]');
    process.exit(1);
  }

  const bundlePath = path.resolve(args[0]);
  const indexDir = args[1] ? path.resolve(args[1]) : path.join(ROOT, 'index');

  if (!fs.existsSync(bundlePath)) {
    console.error(`Bundle path not found: ${bundlePath}`);
    process.exit(1);
  }

  fs.mkdirSync(indexDir, { recursive: true });

  try {
    publishBundle(bundlePath, indexDir);
    console.log(`Published bundle to index: ${indexDir}`);
  } catch (error) {
    console.error(`Error publishing bundle: ${error.message}`);
    process.exit(1);
  }
}

main();

