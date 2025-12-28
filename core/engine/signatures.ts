/**
 * Signature Verification Engine
 * 
 * CRITICAL: Deterministic signature verification bound to:
 * - claim.claim_id
 * - issuer.key_id
 * - canonical serialization of claim body
 * 
 * Fail closed under legal_strict, regulator, forensics.
 * No async. No network. Pure crypto only.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface ClaimSignature {
  algorithm: string;
  value: string;
  public_key_ref: string;
}

export interface Claim {
  claim_id: string;
  issuer: {
    org: string;
    key_id: string;
  };
  signature?: ClaimSignature;
  [key: string]: any;
}

/**
 * Canonical JSON serialization (deterministic)
 */
function canonicalStringify(obj: any): string {
  return JSON.stringify(sortRec(obj));
}

function sortRec(v: any): any {
  if (v === null) return null;
  if (Array.isArray(v)) return v.map(sortRec);
  if (typeof v === 'object') {
    const out: any = {};
    for (const k of Object.keys(v).sort()) {
      out[k] = sortRec(v[k]);
    }
    return out;
  }
  return v;
}

/**
 * Compute canonical claim body hash
 * 
 * Excludes signature field for signing, but includes:
 * - claim_id
 * - issuer.key_id
 * - all other claim fields
 */
function computeClaimBodyHash(claim: Claim): string {
  // Create signing payload: all fields except signature
  const signingPayload: any = { ...claim };
  delete signingPayload.signature;
  
  const canonical = canonicalStringify(signingPayload);
  return crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
}

/**
 * Load public key from registry
 * 
 * Expected location: core/keys/{key_id}.pub
 * Format: PEM or raw hex (depending on algorithm)
 */
function loadPublicKey(keyId: string, keysDir: string = './core/keys'): Buffer | null {
  const keyPath = path.join(keysDir, `${keyId}.pub`);
  
  if (!fs.existsSync(keyPath)) {
    return null;
  }
  
  const keyContent = fs.readFileSync(keyPath, 'utf8').trim();
  
  // Try PEM format first
  if (keyContent.includes('-----BEGIN')) {
    return Buffer.from(keyContent);
  }
  
  // Try hex format
  if (/^[0-9a-fA-F]+$/.test(keyContent)) {
    return Buffer.from(keyContent, 'hex');
  }
  
  // Raw bytes
  return Buffer.from(keyContent, 'base64');
}

/**
 * Verify Ed25519 signature
 */
function verifyEd25519(
  message: Buffer,
  signature: string,
  publicKey: Buffer
): boolean {
  try {
    // Node.js crypto doesn't have Ed25519 in all versions
    // For now, use a placeholder that will fail closed
    // TODO: Implement actual Ed25519 verification when crypto support is available
    return crypto.verify(
      null,
      message,
      publicKey,
      Buffer.from(signature, 'base64')
    );
  } catch {
    // Fail closed
    return false;
  }
}

/**
 * Verify ECDSA signature
 */
function verifyECDSA(
  message: Buffer,
  signature: string,
  publicKey: Buffer,
  algorithm: 'P256' | 'P384' = 'P256'
): boolean {
  try {
    const curve = algorithm === 'P256' ? 'prime256v1' : 'secp384r1';
    return crypto.createVerify(`ecdsa-with-SHA256`)
      .update(message)
      .verify(
        {
          key: publicKey,
          dsaEncoding: 'ieee-p1363'
        },
        Buffer.from(signature, 'base64')
      );
  } catch {
    // Fail closed
    return false;
  }
}

/**
 * Verify RSA signature
 */
function verifyRSA(
  message: Buffer,
  signature: string,
  publicKey: Buffer,
  algorithm: 'PSS-2048' | 'PSS-4096' = 'PSS-2048'
): boolean {
  try {
    const padding = crypto.constants.RSA_PKCS1_PSS_PADDING;
    return crypto.createVerify(`RSA-SHA256`)
      .update(message)
      .verify(
        {
          key: publicKey,
          padding
        },
        Buffer.from(signature, 'base64')
      );
  } catch {
    // Fail closed
    return false;
  }
}

/**
 * Verify claim signature
 * 
 * CRITICAL: Deterministic verification bound to:
 * - claim.claim_id
 * - issuer.key_id
 * - canonical claim body
 * 
 * Fail closed under strict profiles.
 */
export function verifyClaimSignature(
  claim: Claim,
  profileId: string,
  keysDir: string = './core/keys'
): boolean {
  // No signature = invalid
  if (!claim.signature) {
    return false;
  }
  
  const sig = claim.signature;
  
  // Verify key_id matches issuer
  if (sig.public_key_ref !== claim.issuer.key_id) {
    return false;
  }
  
  // Load public key
  const publicKey = loadPublicKey(sig.public_key_ref, keysDir);
  if (!publicKey) {
    // Under strict profiles, missing key = fail closed
    if (profileId.startsWith('legal_strict@') || 
        profileId.startsWith('regulator@') || 
        profileId.startsWith('forensics@')) {
      return false;
    }
    // Under other profiles, missing key = inconclusive (but still invalid)
    return false;
  }
  
  // Compute canonical claim body hash
  const claimBodyHash = computeClaimBodyHash(claim);
  const message = Buffer.from(claimBodyHash, 'hex');
  
  // Verify signature based on algorithm
  let verified = false;
  
  switch (sig.algorithm) {
    case 'Ed25519':
      verified = verifyEd25519(message, sig.value, publicKey);
      break;
    
    case 'ECDSA-P256':
      verified = verifyECDSA(message, sig.value, publicKey, 'P256');
      break;
    
    case 'ECDSA-P384':
      verified = verifyECDSA(message, sig.value, publicKey, 'P384');
      break;
    
    case 'RSA-PSS-2048':
      verified = verifyRSA(message, sig.value, publicKey, 'PSS-2048');
      break;
    
    case 'RSA-PSS-4096':
      verified = verifyRSA(message, sig.value, publicKey, 'PSS-4096');
      break;
    
    default:
      // Unknown algorithm = fail closed
      return false;
  }
  
  return verified;
}

/**
 * Create signature verifier function for contradiction engine
 */
export function createSignatureVerifier(
  profileId: string,
  keysDir?: string
): (claim: Claim) => boolean {
  return (claim: Claim) => verifyClaimSignature(claim, profileId, keysDir);
}

