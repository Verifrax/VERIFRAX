/**
 * Hash Utilities
 * 
 * Computes SHA-256 hashes in the format required by VERIFRAX:
 * "sha256:<64-hex-characters>"
 * 
 * This implementation uses Node.js crypto module (standard library).
 * No external dependencies.
 */

const { createHash } = require('crypto');

/**
 * Compute SHA-256 hash of input data
 * 
 * @param {string|Buffer} data - Input data to hash
 * @returns {string} Hash in format "sha256:<hex>"
 */
function sha256(data) {
  const hash = createHash('sha256');
  
  // Handle both string and Buffer inputs
  if (Buffer.isBuffer(data)) {
    hash.update(data);
  } else {
    hash.update(data, 'utf8');
  }
  
  const hex = hash.digest('hex');
  return `sha256:${hex}`;
}

/**
 * Compute hash of a file
 * 
 * @param {string} filePath - Path to file
 * @param {fs} fs - File system module (injected for testability)
 * @returns {string} Hash in format "sha256:<hex>"
 */
function sha256File(filePath, fs) {
  const data = fs.readFileSync(filePath);
  return sha256(data);
}

module.exports = { sha256, sha256File };

