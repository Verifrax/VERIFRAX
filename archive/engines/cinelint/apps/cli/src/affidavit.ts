/**
 * Affidavit Export - Courtroom Ready
 * 
 * Command: verifrax export affidavit --strict <bundle>
 * Output: PDF with embedded hashes, verdict, axiom references
 * Zero narrative. No branding. Facts only.
 */

import fs from 'fs';
import path from 'path';
import { verify } from '../../../../core/engine/verifier';
import crypto from 'crypto';

export function exportAffidavit(bundlePath: string, outputPath?: string, strict: boolean = false): void {
  // Use strict profile if --strict flag
  const profileId = strict ? 'legal_strict@1.0.0' : 'public@1.0.0';
  
  // Finalize bundle (adjudicate)
  const verdict = verify({ bundlePath, profileId });
  
  // Generate affidavit text (PDF generation would require PDF library)
  const affidavit = generateAffidavitText(verdict, strict);
  
  const outPath = outputPath || path.join(bundlePath, 'affidavit.txt');
  fs.writeFileSync(outPath, affidavit);
  
  console.log(`Affidavit exported: ${outPath}`);
}

function generateAffidavitText(verdict: any, strict: boolean): string {
  const lines: string[] = [];
  
  // No branding. No narrative. Facts only.
  lines.push('AFFIDAVIT OF VERDICT');
  lines.push('');
  lines.push(`Verdict ID: ${verdict.verdict_id}`);
  lines.push(`Bundle Hash: ${verdict.bundle_hash}`);
  lines.push(`Verdict: ${verdict.verdict}`);
  lines.push(`Profile: ${verdict.profile_id}`);
  lines.push(`Timestamp: ${verdict.timestamp_utc}`);
  lines.push('');
  
  // Axiom references (required for strict mode)
  if (strict && verdict.schema_hashes.length > 0) {
    lines.push('Axiom References:');
    for (const hash of verdict.schema_hashes) {
      lines.push(`  - ${hash}`);
    }
    lines.push('');
  }
  
  // Contract and schema hashes
  lines.push(`Contract Hash: ${verdict.contract_hash}`);
  lines.push(`Verifier Build Hash: ${verdict.verifier_build_hash}`);
  lines.push('');
  
  if (verdict.reason_codes.length > 0) {
    lines.push('Reason Codes:');
    for (const code of verdict.reason_codes) {
      lines.push(`  - ${code}`);
    }
    lines.push('');
  }
  
  if (verdict.reason_graph.failure_points.length > 0) {
    lines.push('Failure Points:');
    for (const fp of verdict.reason_graph.failure_points) {
      lines.push(`  - ${fp.component}:${fp.id} - ${fp.reason_code}`);
    }
    lines.push('');
  }
  
  if (verdict.lie_cost_score !== undefined) {
    lines.push(`Lie Cost Score: ${verdict.lie_cost_score}`);
    lines.push('');
  }
  
  lines.push('---');
  lines.push('Facts only. No narrative. No branding.');
  lines.push(`Generated: ${new Date().toISOString()}`);
  
  return lines.join('\n');
}

