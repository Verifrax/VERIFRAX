/**
 * Profile Enforcement Engine
 * 
 * Enforces:
 * - required evidence classes
 * - attestation minimums
 * - failure → verdict mapping
 * 
 * Profiles MUST be executable logic, not config only
 * Reject silent downgrade
 */

import fs from 'fs';
import path from 'path';

/**
 * Static mapping of attestation fields to reason codes
 * 
 * CRITICAL: Reason codes are ASSIGNED, not computed.
 * This map is frozen and cannot be modified.
 */
const ENV_FIELD_TO_CODE: Record<string, string> = {
  os: 'VFX-ENV-0001',
  arch: 'VFX-ENV-0002',
  toolchain: 'VFX-ENV-0003',
  container_digest: 'VFX-ENV-0004',
  git_commit: 'VFX-ENV-0005',
  sbom_hash: 'VFX-ENV-0006'
};

export interface Profile {
  profile_id: string;
  profile_name: string;
  version: string;
  required_evidence_classes: string[];
  failure_severity_mapping: Record<string, string>;
  verdict_mapping: Record<string, string>;
  attestation_requirements: Record<string, boolean>;
  attestation_policy?: {
    required: boolean;
    evidence_bound: boolean;
    hash_addressed: boolean;
    missing: string;
  };
}

/**
 * Load profile from file
 */
export function loadProfile(profileId: string, profilesDir: string = './core/profiles'): Profile {
  const profileName = profileId.split('@')[0];
  const profileFile = path.join(profilesDir, `${profileName}.json`);
  
  if (!fs.existsSync(profileFile)) {
    throw new Error(`Profile not found: ${profileId}`);
  }
  
  const profile = JSON.parse(fs.readFileSync(profileFile, 'utf8'));
  
  // Verify profile_id matches
  if (profile.profile_id !== profileId) {
    throw new Error(`Profile ID mismatch: expected ${profileId}, got ${profile.profile_id}`);
  }
  
  return profile;
}

/**
 * Check if required evidence classes are present
 */
export function checkRequiredEvidence(
  profile: Profile,
  bundle: any
): { missing: string[]; present: string[] } {
  const missing: string[] = [];
  const present: string[] = [];
  
  for (const evidenceClass of profile.required_evidence_classes) {
    // Check if evidence class is present in bundle
    const hasEvidence = checkEvidenceClassPresent(bundle, evidenceClass);
    
    if (hasEvidence) {
      present.push(evidenceClass);
    } else {
      missing.push(evidenceClass);
    }
  }
  
  return { missing, present };
}

/**
 * Check if specific evidence class is present in bundle
 */
function checkEvidenceClassPresent(bundle: any, evidenceClass: string): boolean {
  // Check evidence directory
  if (bundle.evidence) {
    for (const evidence of bundle.evidence) {
      if (evidence.evidence_type === evidenceClass) {
        return true;
      }
    }
  }
  
  // Check bundle.json manifest
  if (bundle.bundle?.evidence) {
    for (const evidence of bundle.bundle.evidence) {
      if (evidence.evidence_type === evidenceClass) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check attestation requirements
 */
export function checkAttestationRequirements(
  profile: Profile,
  bundle: any
): { missing: string[]; present: string[] } {
  const missing: string[] = [];
  const present: string[] = [];
  
  for (const [field, required] of Object.entries(profile.attestation_requirements)) {
    if (required) {
      const hasAttestation = checkAttestationField(bundle, field);
      
      if (hasAttestation) {
        present.push(field);
      } else {
        missing.push(field);
      }
    }
  }
  
  return { missing, present };
}

/**
 * Check if specific attestation field is present
 */
function checkAttestationField(bundle: any, field: string): boolean {
  // Check attestations directory
  if (bundle.attestations && bundle.attestations.length > 0) {
    const attestation = bundle.attestations[0];
    if (attestation.environment && attestation.environment[field]) {
      return true;
    }
  }
  
  return false;
}

/**
 * Enforce profile requirements
 * 
 * Returns reason codes for violations
 */
export function enforceProfile(
  profile: Profile,
  bundle: any
): {
  violations: string[];
  reason_codes: string[];
  verdict_override: string | null;
} {
  const violations: string[] = [];
  const reasonCodes: string[] = [];
  let verdictOverride: string | null = null;
  
  // Check required evidence classes
  const evidenceCheck = checkRequiredEvidence(profile, bundle);
  if (evidenceCheck.missing.length > 0) {
    violations.push(`Missing required evidence classes: ${evidenceCheck.missing.join(', ')}`);
    reasonCodes.push('VFX-EVIDENCE-0001'); // Missing Required Evidence
    
    // Check verdict mapping
    const mappedVerdict = profile.verdict_mapping['missing_required_evidence'];
    if (mappedVerdict) {
      verdictOverride = mappedVerdict;
    }
  }
  
  // Check attestation requirements
  const attestationCheck = checkAttestationRequirements(profile, bundle);
  
  // Enforce attestation_policy if present
  if (profile.attestation_policy && profile.attestation_policy.required) {
    // Check if attestations exist as evidence (evidence_bound)
    const hasAttestationEvidence = checkEvidenceClassPresent(bundle, 'attestations');
    
    if (!hasAttestationEvidence && attestationCheck.missing.length > 0) {
      violations.push(`Missing required attestations: ${attestationCheck.missing.join(', ')}`);
      
      // Map missing attestations to reason codes (static mapping, no computation)
      for (const field of attestationCheck.missing) {
        const code = ENV_FIELD_TO_CODE[field];
        if (code) {
          reasonCodes.push(code);
        } else {
          // Unknown field - use generic code
          reasonCodes.push('VFX-ENV-0001');
        }
      }
      
      // Enforce attestation_policy.missing verdict (no downgrade)
      verdictOverride = profile.attestation_policy.missing;
    }
  } else if (attestationCheck.missing.length > 0) {
    violations.push(`Missing required attestations: ${attestationCheck.missing.join(', ')}`);
    
    // Map missing attestations to reason codes (static mapping, no computation)
    for (const field of attestationCheck.missing) {
      const code = ENV_FIELD_TO_CODE[field];
      if (code) {
        reasonCodes.push(code);
      } else {
        // Unknown field - use generic code
        reasonCodes.push('VFX-ENV-0001');
      }
    }
    
    // Check verdict mapping
    const mappedVerdict = profile.verdict_mapping['missing_attestation'];
    if (mappedVerdict && !verdictOverride) {
      verdictOverride = mappedVerdict;
    }
  }
  
  // Reject silent downgrade
  // If profile requires strict enforcement, don't allow downgrading from INVALID to INCONCLUSIVE
  if (profile.profile_name === 'legal_strict' || profile.profile_name === 'regulator' || profile.profile_name === 'forensics') {
    // These profiles must fail closed
    if (violations.length > 0 && verdictOverride !== 'INVALID') {
      verdictOverride = 'INVALID';
    }
  }
  
  return {
    violations,
    reason_codes: reasonCodes,
    verdict_override: verdictOverride
  };
}

