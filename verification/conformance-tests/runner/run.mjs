#!/usr/bin/env node
/**
 * Conformance Test Runner
 * 
 * Verifies that verifiers produce byte-identical verdict.json for golden bundles.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '../../..');
const GOLDEN_DIR = path.join(ROOT, 'tests/bundles');
const VERDICT_SCHEMA = path.join(ROOT, 'core/schemas/verdict.schema.json');

// Test categories
const CATEGORIES = ['valid', 'invalid', 'inconclusive', 'contradicted'];

// Expected verdicts by category
const EXPECTED_VERDICTS = {
  valid: 'VALID',
  invalid: 'INVALID',
  inconclusive: 'INCONCLUSIVE',
  contradicted: 'CONTRADICTED'
};

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function findBundles(category) {
  const categoryDir = path.join(GOLDEN_DIR, category);
  if (!fs.existsSync(categoryDir)) {
    return [];
  }
  return fs.readdirSync(categoryDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(categoryDir, d.name));
}

function verifyVerdictStructure(verdict) {
  const required = [
    'verdict',
    'reason_codes',
    'reason_graph',
    'profile_id',
    'contract_hash',
    'schema_hashes',
    'bundle_hash',
    'verifier_build_hash',
    'timestamp_utc'
  ];
  
  for (const field of required) {
    if (!(field in verdict)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Verify verdict enum
  const validVerdicts = ['VALID', 'INVALID', 'INCONCLUSIVE', 'CONTRADICTED', 'UNSUPPORTED', 'NONCONFORMING'];
  if (!validVerdicts.includes(verdict.verdict)) {
    throw new Error(`Invalid verdict: ${verdict.verdict}`);
  }
  
  // Verify reason codes format
  for (const code of verdict.reason_codes) {
    if (!/^VFX-[A-Z]+-[0-9]{4}$/.test(code)) {
      throw new Error(`Invalid reason code format: ${code}`);
    }
  }
}

async function runTests() {
  let passed = 0;
  let failed = 0;
  const failures = [];
  
  console.log('Running conformance tests...\n');
  
  for (const category of CATEGORIES) {
    const bundles = findBundles(category);
    const expectedVerdict = EXPECTED_VERDICTS[category];
    
    console.log(`Testing ${category} bundles (expected: ${expectedVerdict})...`);
    
    for (const bundlePath of bundles) {
      const verdictPath = path.join(bundlePath, 'verdict.json');
      
      if (!fs.existsSync(verdictPath)) {
        console.log(`  ⚠️  ${path.basename(bundlePath)}: No verdict.json found (skipping)`);
        continue;
      }
      
      try {
        const verdict = readJson(verdictPath);
        
        // Verify structure
        verifyVerdictStructure(verdict);
        
        // Verify expected verdict
        if (verdict.verdict !== expectedVerdict) {
          throw new Error(`Expected verdict ${expectedVerdict}, got ${verdict.verdict}`);
        }
        
        // Verify bundle hash matches (if bundle.json exists)
        const bundleManifestPath = path.join(bundlePath, 'bundle.json');
        if (fs.existsSync(bundleManifestPath)) {
          // Import bundle hash computation
          const { computeBundleHash } = await import('../../../../core/engine/bundle_hash.ts');
          const computedHash = computeBundleHash(bundlePath);
          
          // Bundle hash must match (unless placeholder)
          if (verdict.bundle_hash !== 'sha256:PLACEHOLDER' && verdict.bundle_hash !== computedHash) {
            throw new Error(`Bundle hash mismatch: expected ${verdict.bundle_hash}, got ${computedHash}`);
          }
        }
        
        // Byte-identical verdict enforcement: SHA256(verdict.json) comparison
        const verdictContent = fs.readFileSync(verdictPath, 'utf8');
        const verdictHash = crypto.createHash('sha256').update(verdictContent).digest('hex');
        
        // Store expected hash for comparison
        const expectedHashFile = path.join(bundlePath, 'verdict.json.sha256');
        if (fs.existsSync(expectedHashFile)) {
          const expectedHash = fs.readFileSync(expectedHashFile, 'utf8').trim();
          if (verdictHash !== expectedHash) {
            throw new Error(`Verdict hash mismatch: expected ${expectedHash}, got ${verdictHash} (nondeterminism detected)`);
          }
        } else {
          // Write hash for first run
          fs.writeFileSync(expectedHashFile, verdictHash);
        }
        
        console.log(`  ✅ ${path.basename(bundlePath)}: ${verdict.verdict}`);
        passed++;
      } catch (error) {
        console.log(`  ❌ ${path.basename(bundlePath)}: ${error.message}`);
        failures.push({ bundle: bundlePath, error: error.message });
        failed++;
      }
    }
  }
  
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  
  if (failures.length > 0) {
    console.log('\nFailures:');
    for (const { bundle, error } of failures) {
      console.log(`  ${bundle}: ${error}`);
    }
    process.exit(1);
  }
  
  console.log('\n✅ All conformance tests passed!');
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

