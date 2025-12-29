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
 * 
 * Implementation:
 * - Hash file minus last N lines
 * - Compare against previous commit
 * - Fail if hash mismatch (mutation detected)
 */

import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { execSync } from 'child_process';
import { join } from 'path';

const INDEX_PATH = join(process.cwd(), 'index/truth.ndjson');

/**
 * Compute SHA-256 hash
 */
function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Get file content minus last N lines
 */
function getContentMinusLastNLines(content, n) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  if (lines.length <= n) {
    return ''; // File is too short or empty
  }
  return lines.slice(0, -n).join('\n') + '\n';
}

/**
 * Main integrity check
 */
function main() {
  console.log('VERIFRAX Truth Index Integrity Check');
  console.log('====================================\n');

  // Check if index exists
  if (!existsSync(INDEX_PATH)) {
    console.log('✓ Index file does not exist (first commit)');
    process.exit(0);
  }

  const currentContent = readFileSync(INDEX_PATH, 'utf8');
  const currentLines = currentContent.split('\n').filter(line => line.trim() !== '');

  console.log(`Current index: ${currentLines.length} entries\n`);

  // Try to get previous version from git
  let previousContent = null;
  try {
    previousContent = execSync(
      `git show HEAD:index/truth.ndjson 2>/dev/null || echo ""`,
      { encoding: 'utf8', stdio: 'pipe' }
    ).trim();
  } catch (error) {
    // First commit or file didn't exist before
    previousContent = '';
  }

  const previousLines = previousContent ? previousContent.split('\n').filter(line => line.trim() !== '') : [];

  console.log(`Previous index: ${previousLines.length} entries`);

  // If no previous content, this is the first commit (allow)
  if (previousLines.length === 0) {
    console.log('\n✓ First commit - no previous entries to verify');
    process.exit(0);
  }

  // Check: previous entries must be unchanged
  const newLinesCount = currentLines.length - previousLines.length;

  if (newLinesCount < 0) {
    console.error('\n❌ FAIL: Entries were removed');
    console.error(`  Previous: ${previousLines.length} entries`);
    console.error(`  Current:  ${currentLines.length} entries`);
    process.exit(1);
  }

  // Verify all previous lines are identical
  for (let i = 0; i < previousLines.length; i++) {
    if (currentLines[i] !== previousLines[i]) {
      console.error('\n❌ FAIL: Existing entry was modified');
      console.error(`  Line ${i + 1}:`);
      console.error(`    Previous: ${previousLines[i]}`);
      console.error(`    Current:  ${currentLines[i]}`);
      process.exit(1);
    }
  }

  // Verify new lines are only at the end
  if (newLinesCount > 0) {
    console.log(`\n✓ ${newLinesCount} new entry/entries appended at end`);
    
    // Validate new entries are valid JSON
    for (let i = previousLines.length; i < currentLines.length; i++) {
      try {
        const entry = JSON.parse(currentLines[i]);
        // Validate required fields
        const required = ['verdict_hash', 'bundle_hash', 'profile_id', 'verifier_version', 'issued_at'];
        for (const field of required) {
          if (!(field in entry)) {
            console.error(`\n❌ FAIL: New entry missing required field: ${field}`);
            console.error(`  Line ${i + 1}: ${currentLines[i]}`);
            process.exit(1);
          }
        }
        console.log(`  ✓ Entry ${i + 1}: valid JSON with required fields`);
      } catch (error) {
        console.error(`\n❌ FAIL: Invalid JSON in new entry`);
        console.error(`  Line ${i + 1}: ${currentLines[i]}`);
        console.error(`  Error: ${error.message}`);
        process.exit(1);
      }
    }
  }

  // Hash-based verification: hash file minus new lines
  const contentMinusNew = getContentMinusLastNLines(currentContent, newLinesCount);
  const hashMinusNew = sha256(contentMinusNew);
  
  const previousHash = sha256(previousContent || '');
  
  if (hashMinusNew !== previousHash) {
    console.error('\n❌ FAIL: Hash mismatch - existing content was modified');
    console.error(`  Previous hash: ${previousHash}`);
    console.error(`  Current hash (minus new): ${hashMinusNew}`);
    process.exit(1);
  }

  console.log('\n✅ PASS: Truth index integrity verified');
  console.log('  - No existing entries modified');
  console.log('  - No existing entries removed');
  console.log('  - Only appends at end (if any)');
  process.exit(0);
}

// Run
try {
  main();
} catch (error) {
  console.error('\n❌ FAIL: Error during integrity check');
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}

