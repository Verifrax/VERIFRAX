/**
 * Compliance Adapter
 * 
 * Outputs only: verdict_id, bundle_hash
 * No alternative path.
 */

import { verify } from '../../core/engine/verifier';

export interface ComplianceOutput {
  verdict_id: string;
  bundle_hash: string;
}

export function processCompliance(bundlePath: string, profileId: string = 'regulator@1.0.0'): ComplianceOutput {
  const verdict = verify({ bundlePath, profileId });
  
  return {
    verdict_id: verdict.verdict_id,
    bundle_hash: verdict.bundle_hash
  };
}

