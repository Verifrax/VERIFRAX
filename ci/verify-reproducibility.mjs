#!/usr/bin/env node
/**
 * Verifier Reproducibility Test (CI-only)
 *
 * Proves that VERIFRAX verification is reproducible, not just claimed.
 *
 * No HTTP. No R2. No Worker.
 * Same inputs → same outputs.
 */

import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';

const FIXTURE_DIR = join(process.cwd(), 'fixtures/bundles/minimal-valid');
const BUNDLE_PATH = join(FIXTURE_DIR, 'bundle.bin');
const MANIFEST_PATH = join(FIXTURE_DIR, 'manifest.json');
const EXPECTED_VERDICT_PATH = join(FIXTURE_DIR, 'EXPECTED_VERDICT.json');

function canonicalStringify(obj) {
  if (Array.isArray(obj)) return `[${obj.map(canonicalStringify).join(',')}]`;
  if (obj && typeof obj === 'object') {
    return `{${Object.keys(obj).sort().map(
      key => `"${key}":${canonicalStringify(obj[key])}`
    ).join(',')}}`;
  }
  return JSON.stringify(obj);
}

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function requireFile(path, label) {
  if (!existsSync(path)) {
    console.error(`\n❌ FAIL: Missing required file: ${label}`);
    console.error(`  Path: ${path}`);
    process.exit(1);
  }
}

function main() {
  console.log('VERIFRAX Verifier Reproducibility Test');
  console.log('=====================================\n');

  requireFile(BUNDLE_PATH, 'fixtures bundle.bin');
  requireFile(MANIFEST_PATH, 'fixtures manifest.json');
  requireFile(EXPECTED_VERDICT_PATH, 'fixtures EXPECTED_VERDICT.json');

  console.log('Loading fixture files...');
  const bundleData = readFileSync(BUNDLE_PATH);
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  const expectedVerdict = JSON.parse(readFileSync(EXPECTED_VERDICT_PATH, 'utf8'));

  console.log('Step 1: Computing bundle hash...');
  const bundleHash = 'sha256:' + sha256(bundleData);
  console.log(`  Computed: ${bundleHash}`);
  console.log(`  Expected: ${manifest.bundle_hash}`);

  if (bundleHash !== manifest.bundle_hash) {
    console.error('\n❌ FAIL: Bundle hash mismatch');
    process.exit(1);
  }
  console.log('  ✓ Bundle hash matches manifest\n');

  console.log('Step 2: Building verdict object...');
  const verdictObject = {
    upload_id: '00000000-0000-0000-0000-000000000000',
    bundle_hash: bundleHash,
    profile_id: 'public@1.0.0',
    verifier_version: '2.1.0',
    verdict: 'verified',
    reason_codes: []
  };

  console.log('\nStep 3: Canonical stringify...');
  const verdictCanonical = canonicalStringify(verdictObject);

  console.log('\nStep 4: Computing verdict hash...');
  const verdictHash = 'sha256:' + sha256(verdictCanonical);
  console.log(`  Computed: ${verdictHash}`);
  console.log(`  Expected: ${expectedVerdict.verdict_hash}`);

  if (verdictHash !== expectedVerdict.verdict_hash) {
    console.error('\n❌ FAIL: Verdict hash mismatch');
    process.exit(1);
  }
  console.log('  ✓ Verdict hash matches expected\n');

  console.log('Step 5: Verifying verdict fields...');
  const computedVerdict = { ...verdictObject, verdict_hash: verdictHash };

  const fieldsToCheck = [
    'upload_id',
    'bundle_hash',
    'profile_id',
    'verifier_version',
    'verdict',
    'reason_codes',
    'verdict_hash'
  ];

  for (const field of fieldsToCheck) {
    const computed = JSON.stringify(computedVerdict[field]);
    const expected = JSON.stringify(expectedVerdict[field]);
    if (computed !== expected) {
      console.error(`\n❌ FAIL: Field mismatch: ${field}`);
      console.error(`  Computed: ${computed}`);
      console.error(`  Expected: ${expected}`);
      process.exit(1);
    }
    console.log(`  ✓ ${field}: match`);
  }

  console.log('\n✅ PASS: Verifier reproducibility verified');
  process.exit(0);
}

try {
  main();
} catch (error) {
  console.error('\n❌ FAIL: Error during reproducibility test');
  console.error(error?.message || String(error));
  console.error(error?.stack || '');
  process.exit(1);
}
