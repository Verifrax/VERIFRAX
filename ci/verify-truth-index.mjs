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
const GENESIS_HASH_PATH = join(process.cwd(), 'index/GENESIS_HASH.txt');

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

  // Check for genesis hash anchor
  if (existsSync(GENESIS_HASH_PATH)) {
    console.log('Genesis hash anchor detected - verifying against immutable root...');
    const genesisHash = readFileSync(GENESIS_HASH_PATH, 'utf8').trim();
    
    if (!genesisHash.startsWith('sha256:')) {
      console.error('\n❌ FAIL: Invalid genesis hash format');
      process.exit(1);
    }

    // Find the number of entries that were present at genesis
    // We need to determine this by checking git history or counting from genesis
    // For now, we'll verify that the genesis hash matches the current file hash
    // if the file hasn't been appended to since genesis
    
    // Try to get the genesis version from git
    let genesisContent = null;
    try {
      // Find the commit that added GENESIS_HASH.txt
      const genesisCommit = execSync(
        `git log --diff-filter=A --format="%H" -- index/GENESIS_HASH.txt | head -1`,
        { encoding: 'utf8', stdio: 'pipe' }
      ).trim();
      
      if (genesisCommit) {
        genesisContent = execSync(
          `git show ${genesisCommit}:index/truth.ndjson 2>/dev/null || echo ""`,
          { encoding: 'utf8', stdio: 'pipe' }
        ).trim();
      }
    } catch (error) {
      // Genesis commit not found, use current content if it matches genesis hash
      genesisContent = currentContent;
    }

    if (genesisContent) {
      const genesisContentHash = 'sha256:' + sha256(genesisContent);
      if (genesisContentHash !== genesisHash) {
        console.error('\n❌ FAIL: Genesis content hash mismatch');
        console.error(`  Genesis file hash: ${genesisContentHash}`);
        console.error(`  Expected: ${genesisHash}`);
        process.exit(1);
      }
      
      // Verify that current content starts with genesis content (append-only)
      if (!currentContent.startsWith(genesisContent)) {
        console.error('\n❌ FAIL: Genesis segment was modified');
        console.error('  The genesis portion of the index must remain unchanged');
        process.exit(1);
      }
      
      console.log('  ✓ Genesis segment verified (immutable)');
      
      // Count genesis entries
      const genesisLines = genesisContent.split('\n').filter(line => line.trim() !== '');
      console.log(`  Genesis entries: ${genesisLines.length}`);
      console.log(`  Current entries: ${currentLines.length}`);
      console.log(`  New entries: ${currentLines.length - genesisLines.length}\n`);
    } else {
      // If we can't find genesis in git, verify current file matches genesis hash
      const currentHash = 'sha256:' + sha256(currentContent);
      if (currentHash === genesisHash) {
        console.log('  ✓ Current file matches genesis hash (no appends yet)\n');
      } else {
        // File has been appended to - verify genesis segment
        // We need to find where genesis ends by checking git
        console.log('  ⚠ Genesis segment verification requires git history');
        console.log('  Verifying append-only via git comparison...\n');
      }
    }
  }

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

  // Final genesis hash check
  if (existsSync(GENESIS_HASH_PATH)) {
    const genesisHash = readFileSync(GENESIS_HASH_PATH, 'utf8').trim();
    
    // Verify genesis hash file itself hasn't changed
    try {
      const previousGenesisHash = execSync(
        `git show HEAD:index/GENESIS_HASH.txt 2>/dev/null || echo ""`,
        { encoding: 'utf8', stdio: 'pipe' }
      ).trim();
      
      if (previousGenesisHash && previousGenesisHash !== genesisHash) {
        console.error('\n❌ FAIL: GENESIS_HASH.txt was modified');
        console.error('  Genesis hash is immutable and cannot be changed');
        process.exit(1);
      }
    } catch (error) {
      // First commit with genesis hash - allow
    }
    
    console.log('  - Genesis hash anchor verified (immutable root)');
  }

  console.log('\n✅ PASS: Truth index integrity verified');
  console.log('  - No existing entries modified');
  console.log('  - No existing entries removed');
  console.log('  - Only appends at end (if any)');
  if (existsSync(GENESIS_HASH_PATH)) {
    console.log('  - Genesis segment immutable (cryptographic root)');
  }
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

