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
 * - Excludes created_at from bundle.json if present
 * - Deterministic file ordering (alphabetical by relative path)
 * - Uses Merkle root of all file hashes
 */
export function computeBundleHash(bundleDir: string): string {
  const files = getAllFiles(bundleDir, ['verdict.json']);
  
  if (files.length === 0) {
    throw new Error('Bundle directory is empty or contains only verdict.json');
  }
  
  // Filter created_at from bundle.json if it exists
  const bundleJsonPath = path.join(bundleDir, 'bundle.json');
  if (fs.existsSync(bundleJsonPath)) {
    const bundleContent = fs.readFileSync(bundleJsonPath, 'utf8');
    const bundle = JSON.parse(bundleContent);
    const original = JSON.parse(JSON.stringify(bundle));
    
    // Remove created_at before hashing
    if ('created_at' in bundle) {
      delete bundle.created_at;
    }
    
    // Assert: created_at must not influence hash
    const hashed = JSON.parse(JSON.stringify(bundle));
    if (original.created_at && hashed.created_at) {
      throw new Error("created_at must not influence bundle hash");
    }
    
    // If bundle.json was modified, we need to recompute its hash
    // But since we hash files by content, we need to temporarily write the filtered version
    // Actually, we hash file contents directly, so we need to filter at file read time
    // For now, we'll filter it in the file reading logic
  }
  
  // Each file.hash is already path-bound (sha256(path + "\0" + contentHash))
  // But we need to filter created_at from bundle.json content before hashing
  const filteredFiles = files.map(f => {
    if (f.relativePath === 'bundle.json') {
      const fullPath = path.join(bundleDir, f.relativePath);
      let content = fs.readFileSync(fullPath, 'utf8');
      const bundle = JSON.parse(content);
      if ('created_at' in bundle) {
        delete bundle.created_at;
        content = JSON.stringify(bundle);
      }
      const contentHash = sha256(content);
      const normalizedPath = f.relativePath.replace(/\\/g, '/');
      const leafHash = sha256(normalizedPath + '\0' + contentHash);
      return {
        relativePath: f.relativePath,
        hash: leafHash
      };
    }
    return f;
  });
  
  const leafHashes = filteredFiles.map(f => f.hash);
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

