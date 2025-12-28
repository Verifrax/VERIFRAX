/**
 * Contradiction Engine - Narrative Collision Detector
 * 
 * Detects when two claims with the same subject have incompatible assertions,
 * both with valid signatures, resulting in CONTRADICTED verdict.
 * 
 * CRITICAL: Contradiction only applies to validly signed claims.
 * Unsigned claims must be ignored, not contradicted.
 * 
 * CRITICAL: Profile compatibility is AXIOMATIC, not ad-hoc.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Claim } from '../schemas/claim.schema.json';

/**
 * Signature verification function type
 */
export type SignatureVerifier = (claim: Claim) => boolean;

export interface ContradictionResult {
  contradicted: boolean;
  contradictions: Contradiction[];
  reason_codes: string[];
  axiom_hash?: string; // Hash of profile compatibility axiom used
}

export interface Contradiction {
  claim_a_id: string;
  claim_b_id: string;
  subject: string;
  conflicting_assertions: {
    assertion_a: any;
    assertion_b: any;
  };
  evidence_refs: {
    claim_a_evidence: string[];
    claim_b_evidence: string[];
  };
}

/**
 * Check if two assertions are incompatible (contradictory)
 */
function areAssertionsIncompatible(assertionA: any, assertionB: any): boolean {
  // Same predicate, same object, but one is negated
  if (
    assertionA.predicate === assertionB.predicate &&
    JSON.stringify(assertionA.object) === JSON.stringify(assertionB.object) &&
    assertionA.negated !== assertionB.negated
  ) {
    return true;
  }

  // Same predicate, different objects that are mutually exclusive
  if (
    assertionA.predicate === assertionB.predicate &&
    assertionA.negated === assertionB.negated
  ) {
    // Check for mutually exclusive values
    if (assertionA.predicate === 'has_hash') {
      // Two different hashes for same subject = contradiction
      if (assertionA.object !== assertionB.object) {
        return true;
      }
    }
    // Add more contradiction patterns as needed
  }

  return false;
}

/**
 * Check if two claims are about the same subject
 */
function areSameSubject(claimA: Claim, claimB: Claim): boolean {
  return (
    claimA.subject.identifier === claimB.subject.identifier &&
    claimA.subject.type === claimB.subject.type
  );
}

/**
 * Load profile compatibility axiom
 * 
 * CRITICAL: Profile compatibility is AXIOMATIC, not ad-hoc.
 * Profiles must NEVER define compatibility themselves.
 */
function loadProfileCompatibilityAxiom(axiomsDir: string = './core/axioms'): any {
  const axiomPath = path.join(axiomsDir, 'profile_compatibility.axiom.json');
  
  if (!fs.existsSync(axiomPath)) {
    throw new Error('Profile compatibility axiom not found');
  }
  
  return JSON.parse(fs.readFileSync(axiomPath, 'utf8'));
}

/**
 * Compute axiom hash for verdict reference
 */
function computeAxiomHash(axiom: any): string {
  const canonical = JSON.stringify(axiom, Object.keys(axiom).sort());
  return crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
}

/**
 * Check if two claims are under compatible profiles
 * 
 * CRITICAL: Uses axiomatic compatibility rules, not ad-hoc logic.
 */
function areCompatibleProfiles(claimA: Claim, claimB: Claim, axiom?: any): boolean {
  // Load axiom if not provided
  if (!axiom) {
    axiom = loadProfileCompatibilityAxiom();
  }
  
  // Extract profile name (without version)
  const profileA = claimA.profile_id.split('@')[0];
  const profileB = claimB.profile_id.split('@')[0];
  
  // Same profile name = compatible
  if (profileA === profileB) {
    return true;
  }
  
  // Check axiomatic compatibility rules
  const compatibilityRules = axiom.compatibility_rules;
  const compatibleWithA = compatibilityRules[profileA]?.compatible_with || [];
  const compatibleWithB = compatibilityRules[profileB]?.compatible_with || [];
  
  // Both profiles must list each other as compatible
  return compatibleWithA.includes(profileB) && compatibleWithB.includes(profileA);
}

/**
 * Detect contradictions in a set of claims
 * 
 * Rules:
 * - Same subject (by identifier and type)
 * - Incompatible assertions (logically incompatible)
 * - Both have valid signatures (VERIFIED - not assumed)
 * - Compatible profiles (AXIOMATIC - not ad-hoc)
 * 
 * CRITICAL: Only claims with verified signatures can be contradicted.
 * Unsigned or invalidly signed claims are IGNORED.
 * 
 * CRITICAL: Profile compatibility uses axiomatic rules, not profile-defined rules.
 */
export function detectContradictions(
  claims: Claim[],
  verifySignature: SignatureVerifier,
  axiomsDir: string = './core/axioms'
): ContradictionResult {
  const contradictions: Contradiction[] = [];
  const reason_codes: string[] = [];

  // Load profile compatibility axiom
  const compatibilityAxiom = loadProfileCompatibilityAxiom(axiomsDir);
  const axiomHash = computeAxiomHash(compatibilityAxiom);

  // Filter to only validly signed claims
  const signedClaims = claims.filter(claim => verifySignature(claim));

  // Compare all pairs of signed claims
  for (let i = 0; i < signedClaims.length; i++) {
    for (let j = i + 1; j < signedClaims.length; j++) {
      const claimA = signedClaims[i];
      const claimB = signedClaims[j];

      // Check if same subject
      if (!areSameSubject(claimA, claimB)) {
        continue;
      }

      // Check if compatible profiles (using axiom)
      if (!areCompatibleProfiles(claimA, claimB, compatibilityAxiom)) {
        continue;
      }

      // Check for incompatible assertions
      for (const assertionA of claimA.assertions) {
        for (const assertionB of claimB.assertions) {
          if (areAssertionsIncompatible(assertionA, assertionB)) {
            contradictions.push({
              claim_a_id: claimA.claim_id,
              claim_b_id: claimB.claim_id,
              subject: claimA.subject.identifier,
              conflicting_assertions: {
                assertion_a: assertionA,
                assertion_b: assertionB
              },
              evidence_refs: {
                claim_a_evidence: claimA.evidence_refs.map(ref => ref.evidence_id),
                claim_b_evidence: claimB.evidence_refs.map(ref => ref.evidence_id)
              }
            });
            reason_codes.push('VFX-AXIOM-0001'); // Contradiction Detected
          }
        }
      }
    }
  }

  return {
    contradicted: contradictions.length > 0,
    contradictions,
    reason_codes: [...new Set(reason_codes)], // Deduplicate
    axiom_hash: `sha256:${axiomHash}` // Reference to compatibility axiom
  };
}

/**
 * Build reason graph entry for contradiction
 */
export function buildContradictionReasonGraph(
  contradiction: Contradiction
): any {
  return {
    component: 'claim',
    id: `${contradiction.claim_a_id}:${contradiction.claim_b_id}`,
    reason_code: 'VFX-AXIOM-0001',
    description: `Claims ${contradiction.claim_a_id} and ${contradiction.claim_b_id} contradict each other about subject ${contradiction.subject}. Evidence from claim A: ${contradiction.evidence_refs.claim_a_evidence.join(', ')}. Evidence from claim B: ${contradiction.evidence_refs.claim_b_evidence.join(', ')}.`
  };
}

