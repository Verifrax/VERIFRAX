/**
 * Cost of Lying Metric
 * 
 * Calculates the "cost of lying" - a metric indicating how expensive it would be
 * to falsify the evidence in a bundle. Higher scores = more expensive to lie.
 */

export interface LieCostInput {
  independent_bindings: number; // hashes, sigs, anchors, attestations
  contradiction_exposure: number; // number of contradictions detected
  missingness_penalties: number; // penalties for missing evidence
  anchor_diversity: number; // number of distinct anchor types
  signature_diversity: number; // number of distinct signers
  attestation_completeness: number; // 0-1, completeness of attestations
}

export interface LieCostOutput {
  lie_cost_score: number;
  attack_surface_summary: {
    independent_bindings: number;
    contradiction_exposure: number;
    missingness_penalties: number;
    anchor_diversity: number;
    signature_diversity: number;
    attestation_completeness: number;
  };
}

/**
 * Calculate cost of lying metric
 * 
 * Formula:
 * - Base score from independent bindings (each binding adds to cost)
 * - Multiplier for anchor diversity (more anchor types = higher cost)
 * - Multiplier for signature diversity (more signers = higher cost)
 * - Bonus for attestation completeness
 * - Penalty for contradictions (contradictions reduce trust)
 * - Penalty for missing evidence (missing evidence reduces trust)
 */
export function calculateLieCost(input: LieCostInput): LieCostOutput {
  const {
    independent_bindings,
    contradiction_exposure,
    missingness_penalties,
    anchor_diversity,
    signature_diversity,
    attestation_completeness
  } = input;

  // Base score from independent bindings
  // Each binding (hash, sig, anchor, attestation) adds to the cost
  let score = independent_bindings * 10;

  // Anchor diversity multiplier
  // More anchor types = exponentially harder to compromise all
  if (anchor_diversity >= 2) {
    score *= 1 + (anchor_diversity - 1) * 0.5; // 2 anchors = 1.5x, 3 = 2x, etc.
  }

  // Signature diversity multiplier
  // More signers = harder to compromise all keys
  if (signature_diversity >= 2) {
    score *= 1 + (signature_diversity - 1) * 0.3; // 2 signers = 1.3x, 3 = 1.6x, etc.
  }

  // Attestation completeness bonus
  // Complete attestations make it harder to lie about environment
  score *= 1 + attestation_completeness * 0.5; // 100% complete = 1.5x

  // Contradiction exposure penalty
  // Contradictions reduce trust (but don't make lying easier, just less trustworthy)
  score *= Math.max(0, 1 - contradiction_exposure * 0.1); // Each contradiction reduces by 10%

  // Missingness penalties
  // Missing evidence reduces trust
  score *= Math.max(0, 1 - missingness_penalties * 0.05); // Each missing item reduces by 5%

  // Normalize to 0-100 scale (but allow higher for exceptional cases)
  score = Math.max(0, score);

  return {
    lie_cost_score: Math.round(score * 100) / 100, // Round to 2 decimal places
    attack_surface_summary: {
      independent_bindings,
      contradiction_exposure,
      missingness_penalties,
      anchor_diversity,
      signature_diversity,
      attestation_completeness
    }
  };
}

/**
 * Count independent bindings from bundle structure
 */
export function countIndependentBindings(bundle: any): number {
  let count = 0;

  // Count hashes
  if (bundle.claims) {
    bundle.claims.forEach((claim: any) => {
      if (claim.evidence_refs) {
        count += claim.evidence_refs.length; // Each evidence ref is a binding
      }
    });
  }

  // Count signatures
  if (bundle.signatures) {
    count += Object.keys(bundle.signatures).length;
  }

  // Count anchors
  if (bundle.anchors) {
    count += bundle.anchors.length;
  }

  // Count attestations
  if (bundle.attestations) {
    count += bundle.attestations.length;
  }

  return count;
}

/**
 * Count anchor diversity (distinct anchor types)
 */
export function countAnchorDiversity(bundle: any): number {
  if (!bundle.anchors) {
    return 0;
  }
  const types = new Set(bundle.anchors.map((a: any) => a.type));
  return types.size;
}

/**
 * Count signature diversity (distinct signers)
 */
export function countSignatureDiversity(bundle: any): number {
  if (!bundle.signatures) {
    return 0;
  }
  const signers = new Set(
    Object.values(bundle.signatures).map((sig: any) => sig.key_id || sig.issuer?.key_id)
  );
  return signers.size;
}

/**
 * Calculate attestation completeness (0-1)
 */
export function calculateAttestationCompleteness(
  bundle: any,
  requiredFields: string[]
): number {
  if (!bundle.attestations || bundle.attestations.length === 0) {
    return 0;
  }

  const attestation = bundle.attestations[0]; // Use first attestation
  let present = 0;

  for (const field of requiredFields) {
    if (attestation.environment?.[field]) {
      present++;
    }
  }

  return requiredFields.length > 0 ? present / requiredFields.length : 0;
}

