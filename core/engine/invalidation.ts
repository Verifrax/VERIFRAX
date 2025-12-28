/**
 * Invalidation Resolution Engine
 * 
 * Deterministic resolution order:
 * 1. Exact bundle_hash
 * 2. claim_id
 * 3. profile-scoped invalidation
 * 
 * Hard rule: Invalidation always wins over VALID
 */

import fs from 'fs';
import path from 'path';

export interface Invalidation {
  invalidation_id: string;
  targets: Array<{
    type: 'claim_id' | 'bundle_hash' | 'profile_id';
    identifier: string;
  }>;
  basis: {
    reason_codes: string[];
    evidence_refs: any[];
  };
  issuer: {
    org: string;
    key_id: string;
  };
  issued_at: string;
  signature: any;
}

export interface InvalidationMatch {
  invalidation: Invalidation;
  match_type: 'bundle_hash' | 'claim_id' | 'profile';
  target: string;
}

/**
 * Load invalidations from truth index
 */
function loadInvalidations(indexDir: string): Invalidation[] {
  const invalidationsFile = path.join(indexDir, 'invalidations.ndjson');
  if (!fs.existsSync(invalidationsFile)) {
    return [];
  }
  
  const content = fs.readFileSync(invalidationsFile, 'utf8');
  const lines = content.trim().split('\n').filter(line => line.trim());
  
  return lines.map(line => JSON.parse(line));
}

/**
 * Check if invalidation matches bundle hash
 */
function matchesBundleHash(invalidation: Invalidation, bundleHash: string): boolean {
  return invalidation.targets.some(
    target => target.type === 'bundle_hash' && target.identifier === bundleHash
  );
}

/**
 * Check if invalidation matches claim ID
 */
function matchesClaimId(invalidation: Invalidation, claimId: string): boolean {
  return invalidation.targets.some(
    target => target.type === 'claim_id' && target.identifier === claimId
  );
}

/**
 * Check if invalidation matches profile (profile-scoped)
 * 
 * CRITICAL: Profile-scoped invalidations must be EXPLICIT.
 * No inference. No substring logic. Exact match only.
 */
function matchesProfile(invalidation: Invalidation, profileId: string): boolean {
  return invalidation.targets.some(
    target => target.type === 'profile_id' && target.identifier === profileId
  );
}

/**
 * Resolve invalidations for a bundle
 * 
 * Deterministic resolution order:
 * 1. Exact bundle_hash matches
 * 2. claim_id matches (from bundle claims)
 * 3. profile-scoped matches
 */
export function resolveInvalidations(
  bundleHash: string,
  claimIds: string[],
  profileId: string,
  indexDir: string = './index'
): InvalidationMatch[] {
  const invalidations = loadInvalidations(indexDir);
  const matches: InvalidationMatch[] = [];
  
  // Order 1: Exact bundle_hash matches (highest priority)
  for (const invalidation of invalidations) {
    if (matchesBundleHash(invalidation, bundleHash)) {
      matches.push({
        invalidation,
        match_type: 'bundle_hash',
        target: bundleHash
      });
    }
  }
  
  // Order 2: claim_id matches
  for (const claimId of claimIds) {
    for (const invalidation of invalidations) {
      if (matchesClaimId(invalidation, claimId)) {
        // Avoid duplicates
        if (!matches.some(m => m.invalidation.invalidation_id === invalidation.invalidation_id)) {
          matches.push({
            invalidation,
            match_type: 'claim_id',
            target: claimId
          });
        }
      }
    }
  }
  
  // Order 3: profile-scoped matches (lowest priority)
  for (const invalidation of invalidations) {
    if (matchesProfile(invalidation, profileId)) {
      // Avoid duplicates
      if (!matches.some(m => m.invalidation.invalidation_id === invalidation.invalidation_id)) {
        matches.push({
          invalidation,
          match_type: 'profile',
          target: profileId
        });
      }
    }
  }
  
  return matches;
}

/**
 * Merge invalidation reason graphs
 */
export function mergeInvalidationReasonGraphs(matches: InvalidationMatch[]): {
  reason_codes: string[];
  failure_points: any[];
} {
  const reasonCodes = new Set<string>();
  const failurePoints: any[] = [];
  
  for (const match of matches) {
    // Add invalidation reason code
    reasonCodes.add('VFX-LOG-0101'); // Active invalidation applied
    
    // Add basis reason codes
    for (const code of match.invalidation.basis.reason_codes) {
      reasonCodes.add(code);
    }
    
    // Add failure point
    failurePoints.push({
      component: 'invalidation',
      id: match.invalidation.invalidation_id,
      reason_code: 'VFX-LOG-0101',
      description: `Invalidation ${match.invalidation.invalidation_id} matches ${match.match_type} ${match.target}`
    });
  }
  
  return {
    reason_codes: Array.from(reasonCodes),
    failure_points: failurePoints
  };
}

/**
 * Apply invalidations to verdict
 * 
 * Hard rule: Invalidation always wins over VALID
 */
export function applyInvalidations(
  verdict: any,
  matches: InvalidationMatch[]
): any {
  if (matches.length === 0) {
    return verdict;
  }
  
  // Invalidation always wins over VALID
  if (verdict.verdict === 'VALID') {
    verdict.verdict = 'INVALID';
  }
  
  // Merge invalidation reason graphs
  const merged = mergeInvalidationReasonGraphs(matches);
  
  // Add reason codes
  for (const code of merged.reason_codes) {
    if (!verdict.reason_codes.includes(code)) {
      verdict.reason_codes.push(code);
    }
  }
  
  // Add failure points to reason graph
  if (!verdict.reason_graph.failure_points) {
    verdict.reason_graph.failure_points = [];
  }
  verdict.reason_graph.failure_points.push(...merged.failure_points);
  
  return verdict;
}

