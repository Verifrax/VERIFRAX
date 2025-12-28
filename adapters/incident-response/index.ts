/**
 * Incident Response Adapter
 * 
 * Outputs only: verdict_id, bundle_hash
 * No alternative path.
 */

import { verify } from '../../core/engine/verifier';

export interface IncidentResponseOutput {
  verdict_id: string;
  bundle_hash: string;
}

export function processIncident(bundlePath: string): IncidentResponseOutput {
  const verdict = verify({ bundlePath, profileId: 'forensics@1.0.0' });
  
  return {
    verdict_id: verdict.verdict_id,
    bundle_hash: verdict.bundle_hash
  };
}

