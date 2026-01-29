#!/usr/bin/env node
/**
 * Truth Index Integrity Verification (CI-only)
 *
 * Enforces append-only discipline on index/truth.ndjson.
 *
 * Rules:
 * - Existing entries MUST NOT be modified
 * - Existing entries MUST NOT be removed
 * - Only appends at end are allowed
 */

import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { execSync } from 'child_process';
import { join } from 'path';

const INDEX_PATH = join(process.cwd(), 'index/truth.ndjson');
const GENESIS_HASH_PATH = join(process.cwd(), 'index/GENESIS_HASH.txt');

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function getContentMinusLastNLines(content, n) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  if (lines.length <= n) return '';
  return lines.slice(0, -n).join('\n') + '\n';
}

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
}

function main() {
  console.log('VERIFRAX Truth Index Integrity Check');
  console.log('====================================\n');

  if (!existsSync(INDEX_PATH)) {
    console.log('✓ index/truth.ndjson not present (bootstrap)');
    process.exit(0);
  }

  const currentContent = readFileSync(INDEX_PATH, 'utf8');
  const currentLines = currentContent.split('\n').filter(line => line.trim() !== '');

  console.log(`Current index: ${currentLines.length} entries\n`);

  // Optional genesis anchor: if current file hash matches genesis, we can stop early.
  if (existsSync(GENESIS_HASH_PATH)) {
    const genesisHash = readFileSync(GENESIS_HASH_PATH, 'utf8').trim();
    if (!genesisHash.startsWith('sha256:')) {
      console.error('\n❌ FAIL: Invalid GENESIS_HASH.txt format (expected sha256:...)');
      process.exit(1);
    }
    const currentHash = 'sha256:' + sha256(currentContent);
    if (currentHash === genesisHash) {
      console.log('✓ Genesis hash verified (file matches immutable root)');
      process.exit(0);
    }
  }

  // Previous content from git (if exists). If missing, treat as first commit.
  let previousContent = '';
  try {
    previousContent = sh(`git show HEAD:index/truth.ndjson 2>/dev/null || echo ""`);
  } catch {
    previousContent = '';
  }

  const previousLines = previousContent
    ? previousContent.split('\n').filter(line => line.trim() !== '')
    : [];

  console.log(`Previous index: ${previousLines.length} entries`);

  if (previousLines.length === 0) {
    console.log('\n✓ First commit (or previously absent) - nothing to compare');
    process.exit(0);
  }

  const newLinesCount = currentLines.length - previousLines.length;

  if (newLinesCount < 0) {
    console.error('\n❌ FAIL: Entries were removed');
    console.error(`  Previous: ${previousLines.length}`);
    console.error(`  Current:  ${currentLines.length}`);
    process.exit(1);
  }

  for (let i = 0; i < previousLines.length; i++) {
    if (currentLines[i] !== previousLines[i]) {
      console.error('\n❌ FAIL: Existing entry was modified');
      console.error(`  Line ${i + 1}:`);
      console.error(`    Previous: ${previousLines[i]}`);
      console.error(`    Current:  ${currentLines[i]}`);
      process.exit(1);
    }
  }

  if (newLinesCount > 0) {
    console.log(`\n✓ ${newLinesCount} new entry/entries appended at end`);

    for (let i = previousLines.length; i < currentLines.length; i++) {
      let entry;
      try {
        entry = JSON.parse(currentLines[i]);
      } catch (e) {
        console.error('\n❌ FAIL: Invalid JSON in new entry');
        console.error(`  Line ${i + 1}: ${currentLines[i]}`);
        console.error(`  Error: ${e.message}`);
        process.exit(1);
      }

      const required = ['verdict_hash', 'bundle_hash', 'profile_id', 'verifier_version', 'issued_at'];
      for (const field of required) {
        if (!(field in entry)) {
          console.error(`\n❌ FAIL: New entry missing required field: ${field}`);
          console.error(`  Line ${i + 1}: ${currentLines[i]}`);
          process.exit(1);
        }
      }
      console.log(`  ✓ Entry ${i + 1}: valid JSON with required fields`);
    }
  }

  const contentMinusNew = getContentMinusLastNLines(currentContent, newLinesCount);
  const hashMinusNew = sha256(contentMinusNew);
  const previousHash = sha256(previousContent || '');

  if (hashMinusNew !== previousHash) {
    console.error('\n❌ FAIL: Hash mismatch - existing content was modified');
    console.error(`  Previous hash:        ${previousHash}`);
    console.error(`  Current hash (minus): ${hashMinusNew}`);
    process.exit(1);
  }

  console.log('\n✅ PASS: Truth index integrity verified');
  process.exit(0);
}

try {
  main();
} catch (error) {
  console.error('\n❌ FAIL: Error during integrity check');
  console.error(error?.message || String(error));
  console.error(error?.stack || '');
  process.exit(1);
}
