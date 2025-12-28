/**
 * Insurance Adapter
 * 
 * Outputs only: verdict_id, bundle_hash
 * No alternative path.
 */

import { verify } from '../../core/engine/verifier';

export interface InsuranceOutput {
  verdict_id: string;
  bundle_hash: string;
}

export function processInsurance(bundlePath: string): InsuranceOutput {
  const verdict = verify({ bundlePath, profileId: 'legal_strict@1.0.0' });
  
  return {
    verdict_id: verdict.verdict_id,
    bundle_hash: verdict.bundle_hash
  };
}

