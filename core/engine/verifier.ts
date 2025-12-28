/**
 * Main Verifier - Finality Oracle
 * 
 * Integrates:
 * - Contradiction detection
 * - Invalidation resolution
 * - Profile enforcement
 * - Finality lock
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { detectContradictions, buildContradictionReasonGraph } from './contradiction';
import { resolveInvalidations, applyInvalidations } from './invalidation';
import { loadProfile, enforceProfile } from './profile';
import { computeBundleHash } from './bundle_hash';
import { FinalityLock } from './finality_lock';
import { createSignatureVerifier } from './signatures';

/**
 * Compute verdict identifier: VFXV1:<bundle_hash>:<verdict_hash>
 */
function computeVerdictId(bundleHash: string, verdict: any): string {
  const canonical = JSON.stringify(verdict, Object.keys(verdict).sort());
  const verdictHash = crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
  return `VFXV1:${bundleHash}:sha256:${verdictHash}`;
}

export interface VerifierOptions {
  bundlePath: string;
  profileId?: string;
  indexDir?: string;
}

/**
 * Load claims from bundle
 */
function loadClaims(bundlePath: string): any[] {
  const claims: any[] = [];
  
  // Check bundle.json manifest
  const bundleManifestPath = path.join(bundlePath, 'bundle.json');
  if (fs.existsSync(bundleManifestPath)) {
    const bundle = JSON.parse(fs.readFileSync(bundleManifestPath, 'utf8'));
    if (bundle.claims) {
      for (const claimRef of bundle.claims) {
        const claimPath = path.join(bundlePath, claimRef.file);
        if (fs.existsSync(claimPath)) {
          claims.push(JSON.parse(fs.readFileSync(claimPath, 'utf8')));
        }
      }
    }
  }
  
  // Also check claims directory directly
  const claimsDir = path.join(bundlePath, 'claims');
  if (fs.existsSync(claimsDir)) {
    const files = fs.readdirSync(claimsDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const claimPath = path.join(claimsDir, file);
        const claim = JSON.parse(fs.readFileSync(claimPath, 'utf8'));
        // Avoid duplicates
        if (!claims.some(c => c.claim_id === claim.claim_id)) {
          claims.push(claim);
        }
      }
    }
  }
  
  return claims;
}


/**
 * Main verification function
 * 
 * CRITICAL: Finality is scoped to ONE epistemic evaluation.
 * Each verification gets its own FinalityLock instance.
 */
export function verify(options: VerifierOptions): any {
  const { bundlePath, profileId = 'public@1.0.0', indexDir = './index' } = options;
  
  // Per-verification-instance lock (not global)
  const lock = new FinalityLock();
  
  // Initialize verdict structure
  let verdict: any = {
    verdict: 'VALID',
    reason_codes: [],
    reason_graph: {
      claims: [],
      evidence: [],
      rules: [],
      failure_points: []
    },
    counterfactuals: [],
    profile_id: profileId,
    contract_hash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
    schema_hashes: [],
    bundle_hash: '',
    verifier_build_hash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
    timestamp_utc: new Date().toISOString()
  };
  
  try {
    // Compute bundle hash
    verdict.bundle_hash = computeBundleHash(bundlePath);
  } catch (e: any) {
    verdict.verdict = 'INVALID';
    verdict.reason_codes.push('VFX-EVIDENCE-0100'); // Bundle hash mismatch (fatal)
    verdict.reason_graph.failure_points.push({
      component: 'bundle',
      id: 'bundle_hash',
      reason_code: 'VFX-EVIDENCE-0100',
      description: `Failed to compute bundle hash: ${e.message}`
    });
    lock.setVerdict(verdict);
    return verdict;
  }
  
  // Load profile
  let profile;
  try {
    profile = loadProfile(profileId);
  } catch (e: any) {
    verdict.verdict = 'UNSUPPORTED';
    verdict.reason_codes.push('VFX-PROFILE-0001'); // Unsupported Profile
    lock.setVerdict(verdict);
    return verdict;
  }
  
  // Load bundle structure
  const bundleManifestPath = path.join(bundlePath, 'bundle.json');
  let bundle: any = {};
  if (fs.existsSync(bundleManifestPath)) {
    bundle = JSON.parse(fs.readFileSync(bundleManifestPath, 'utf8'));
  }
  
  // Enforce profile requirements
  const profileCheck = enforceProfile(profile, { bundle, bundlePath });
  if (profileCheck.violations.length > 0) {
    verdict.reason_codes.push(...profileCheck.reason_codes);
    if (profileCheck.verdict_override) {
      verdict.verdict = profileCheck.verdict_override;
    }
    
    // Add failure points
    for (const violation of profileCheck.violations) {
      verdict.reason_graph.failure_points.push({
        component: 'profile',
        id: profileId,
        reason_code: profileCheck.reason_codes[0] || 'VFX-POLICY-0001',
        description: violation
      });
    }
  }
  
  // Load claims
  const claims = loadClaims(bundlePath);
  
  // Create signature verifier (deterministic, no network)
  const verifySignature = createSignatureVerifier(profileId);
  
  // Detect contradictions (HARD-WIRED)
  // CRITICAL: Only validly signed claims can be contradicted
  // CRITICAL: Profile compatibility is axiomatic
  const contradictionResult = detectContradictions(claims, verifySignature);
  
  // Add axiom hash to schema_hashes if contradiction was checked
  if (contradictionResult.axiom_hash) {
    if (!verdict.schema_hashes.includes(contradictionResult.axiom_hash)) {
      verdict.schema_hashes.push(contradictionResult.axiom_hash);
    }
  }
  
  // CONTRADICTED overrides all except UNSUPPORTED
  if (contradictionResult.contradicted && verdict.verdict !== 'UNSUPPORTED') {
    verdict.verdict = 'CONTRADICTED';
    verdict.reason_codes.push(...contradictionResult.reason_codes);
    
    // Inject contradiction nodes into reason graph
    for (const contradiction of contradictionResult.contradictions) {
      const graphNode = buildContradictionReasonGraph(contradiction);
      verdict.reason_graph.failure_points.push(graphNode);
      
      // Add claim nodes
      verdict.reason_graph.claims.push({
        claim_id: contradiction.claim_a_id,
        claim_type: 'unknown',
        subject: contradiction.subject,
        status: 'contradicted'
      });
      verdict.reason_graph.claims.push({
        claim_id: contradiction.claim_b_id,
        claim_type: 'unknown',
        subject: contradiction.subject,
        status: 'contradicted'
      });
    }
  }
  
  // Resolve invalidations
  const claimIds = claims.map(c => c.claim_id);
  const invalidationMatches = resolveInvalidations(
    verdict.bundle_hash,
    claimIds,
    profileId,
    indexDir
  );
  
  // Apply invalidations (always wins over VALID)
  if (invalidationMatches.length > 0) {
    verdict = applyInvalidations(verdict, invalidationMatches);
  }
  
  // Lock verdict (no further mutations allowed)
  lock.setVerdict(verdict);
  
  // Compute verdict identifier (citable)
  const verdictId = computeVerdictId(verdict.bundle_hash, verdict);
  verdict.verdict_id = verdictId;
  
  return verdict;
}

