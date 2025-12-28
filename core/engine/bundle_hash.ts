/**
 * Canonical Bundle Hash
 * 
 * Rules:
 * - Exclude verdict.json
 * - Deterministic file ordering
 * - Merkle root required
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface BundleFile {
  relativePath: string;
  hash: string;
}

/**
 * Compute SHA-256 hash of file content
 */
function sha256(data: Buffer | string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Get all files in bundle directory (excluding verdict.json)
 * Returns files in deterministic order (alphabetical by relative path)
 */
function getAllFiles(bundleDir: string, excludePatterns: string[] = ['verdict.json']): BundleFile[] {
  const files: BundleFile[] = [];
  
  function walkDir(dir: string, baseDir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      // Skip excluded files
      if (excludePatterns.some(pattern => relativePath.includes(pattern))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        walkDir(fullPath, baseDir);
      } else if (entry.isFile()) {
        const content = fs.readFileSync(fullPath);
        const contentHash = sha256(content);
        const normalizedPath = relativePath.replace(/\\/g, '/'); // Normalize to forward slashes
        
        // CRITICAL: Bind path + content hash to prevent path substitution attacks
        // Leaf hash = sha256(normalizedPath + "\0" + contentHash)
        const leafHash = sha256(normalizedPath + '\0' + contentHash);
        
        files.push({
          relativePath: normalizedPath,
          hash: leafHash // This is the path-bound hash, not just content hash
        });
      }
    }
  }
  
  walkDir(bundleDir, bundleDir);
  
  // Sort by relative path for deterministic ordering
  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

/**
 * Compute Merkle root from file path+content hashes
 * 
 * CRITICAL: Each leaf hash MUST bind normalized relative path + file content hash
 * This prevents path substitution attacks and semantic relocation.
 */
function merkleRoot(leafHashes: string[]): string {
  if (leafHashes.length === 0) {
    return sha256(Buffer.from(''));
  }
  
  if (leafHashes.length === 1) {
    return leafHashes[0];
  }
  
  let level = leafHashes.map(h => sha256(Buffer.from(h)));
  
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const a = level[i];
      const b = level[i + 1] || level[i]; // Duplicate last if odd
      next.push(sha256(Buffer.from(a + b)));
    }
    level = next;
  }
  
  return level[0];
}

/**
 * Compute canonical bundle hash
 * 
 * Rules:
 * - Excludes verdict.json
 * - Deterministic file ordering (alphabetical by relative path)
 * - Uses Merkle root of all file hashes
 */
export function computeBundleHash(bundleDir: string): string {
  const files = getAllFiles(bundleDir, ['verdict.json']);
  
  if (files.length === 0) {
    throw new Error('Bundle directory is empty or contains only verdict.json');
  }
  
  // Each file.hash is already path-bound (sha256(path + "\0" + contentHash))
  const leafHashes = files.map(f => f.hash);
  const root = merkleRoot(leafHashes);
  
  return `sha256:${root}`;
}

/**
 * Verify bundle hash matches expected
 */
export function verifyBundleHash(bundleDir: string, expectedHash: string): boolean {
  const computed = computeBundleHash(bundleDir);
  return computed === expectedHash;
}

/**
 * Get bundle hash with file list (for debugging)
 */
export function getBundleHashWithFiles(bundleDir: string): {
  hash: string;
  files: BundleFile[];
} {
  const files = getAllFiles(bundleDir, ['verdict.json']);
  const leafHashes = files.map(f => f.hash);
  const root = merkleRoot(leafHashes);
  
  return {
    hash: `sha256:${root}`,
    files
  };
}

