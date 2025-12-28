# VERIFRAX Verdict Guidance (Archived)

**Status**: Archived from v1 canonical surface
**Reason**: Contains interpretive authority, recommendations, and guidance
**Future**: May be used for v2+ documentation, but not part of v1 normative reference

---

## Integration Snippets

### For Insurers

```typescript
import { verifyBundle } from '@verifrax/verifier';

async function assessClaim(bundlePath: string): Promise<InsuranceDecision> {
  const verdict = await verifyBundle(bundlePath);
  
  if (verdict.verdict === "VALID") {
    return { approved: true, reason: "Verified by VERIFRAX" };
  }
  
  if (verdict.verdict === "CONTRADICTED") {
    return { approved: false, reason: "Contradictory claims detected" };
  }
  
  // Check specific reason codes
  if (verdict.reason_codes.includes("VFX-SIG-0001")) {
    return { approved: false, reason: "Invalid signature" };
  }
  
  return { approved: false, reason: verdict.reason_codes.join(", ") };
}
```

### For Compliance Teams

```typescript
import { verifyBundle, getReasonCodeDetails } from '@verifrax/verifier';

async function complianceCheck(bundlePath: string, profile: string): Promise<ComplianceReport> {
  const verdict = await verifyBundle(bundlePath, { profile });
  
  const report: ComplianceReport = {
    verdict: verdict.verdict,
    compliant: verdict.verdict === "VALID",
    issues: [],
    recommendations: []
  };
  
  for (const code of verdict.reason_codes) {
    const details = getReasonCodeDetails(code);
    report.issues.push({
      code,
      summary: details.human_readable_summary,
      severity: getSeverity(code)
    });
  }
  
  // Add counterfactuals as recommendations
  for (const cf of verdict.counterfactuals) {
    report.recommendations.push(cf.condition);
  }
  
  return report;
}
```

### For Platforms

```typescript
import { verifyBundle, checkContradictions } from '@verifrax/verifier';

async function platformIngest(bundlePath: string): Promise<IngestDecision> {
  const verdict = await verifyBundle(bundlePath);
  
  // Platforms should reject CONTRADICTED
  if (verdict.verdict === "CONTRADICTED") {
    return { 
      accepted: false, 
      reason: "Contradictory claims",
      details: verdict.reason_graph 
    };
  }
  
  // Platforms may accept INCONCLUSIVE with warnings
  if (verdict.verdict === "INCONCLUSIVE") {
    return { 
      accepted: true, 
      warning: "Inconclusive verification",
      reason_codes: verdict.reason_codes 
    };
  }
  
  return { accepted: verdict.verdict === "VALID" };
}
```

### For Incident Response Teams

```typescript
import { verifyBundle, getInvalidations } from '@verifrax/verifier';

async function incidentInvestigation(bundlePath: string): Promise<InvestigationReport> {
  const verdict = await verifyBundle(bundlePath);
  
  const report: InvestigationReport = {
    verdict: verdict.verdict,
    timeline: [],
    evidence_chain: verdict.reason_graph,
    invalidations: await getInvalidations(verdict.bundle_hash)
  };
  
  // Check for retroactive invalidations
  if (verdict.reason_codes.some(c => c.startsWith("VFX-LOG-0003"))) {
    report.timeline.push({
      event: "Retroactive invalidation detected",
      timestamp: new Date().toISOString()
    });
  }
  
  // Analyze attack surface
  report.attack_surface = verdict.attack_surface_summary;
  report.lie_cost = verdict.lie_cost_score;
  
  return report;
}
```

## Verdict Interpretation

### VALID
- All evidence is consistent
- All required attestations present
- No contradictions
- All signatures valid
- **Action**: Accept, proceed with confidence

### INVALID
- Missing required evidence
- Invalid signatures
- Hash mismatches
- Schema violations
- **Action**: Reject, do not proceed

### INCONCLUSIVE
- Required evidence present but insufficient
- Missing attestations under strict profile
- **Action**: May proceed with caution, request additional evidence

### CONTRADICTED
- Two or more claims with same subject have incompatible assertions
- Both claims have valid signatures
- **Action**: Reject, investigate contradiction

### UNSUPPORTED
- Unsupported schema/contract/profile version
- **Action**: Reject, upgrade verifier or bundle

### NONCONFORMING
- Bundle structure violates required layout
- **Action**: Reject, fix bundle structure

## Reason Code Lookup

Use the reason code to look up details in `docs/REASON_CODES.md`:

1. Extract layer: `VFX-<LAYER>-<####>`
2. Look up code in appropriate layer section
3. Use "Deterministic Reproduction" to verify the failure
4. Use "Human-Readable Summary" for user-facing messages

## Verdict Graph Structure

The `reason_graph` field provides a structured view of the verification:

```typescript
type ReasonGraph = {
  claims: ClaimNode[];
  evidence: EvidenceNode[];
  rules: RuleNode[];
  failure_points: FailurePoint[];
};

type ClaimNode = {
  claim_id: string;
  claim_type: string;
  subject: string;
  status: "valid" | "invalid" | "contradicted";
};

type EvidenceNode = {
  evidence_id: string;
  evidence_type: string;
  status: "valid" | "invalid" | "missing";
  hash: string;
};

type RuleNode = {
  rule_id: string;
  rule_type: string;
  status: "passed" | "failed";
  reason_code?: string;
};

type FailurePoint = {
  component: "claim" | "evidence" | "rule";
  id: string;
  reason_code: string;
  description: string;
};
```

## Counterfactuals

Counterfactuals describe what would be needed to achieve VALID:

```typescript
type Counterfactual = {
  condition: string;        // "If X evidence were present"
  would_become: Verdict;   // Usually "VALID"
  required_changes: string[]; // Specific changes needed
};
```

## Bundle Hash Verification

Always verify the bundle hash matches:

```typescript
import { computeBundleHash } from '@verifrax/utils';

const computedHash = await computeBundleHash(bundlePath);
if (computedHash !== verdict.bundle_hash) {
  throw new Error("Bundle hash mismatch - verdict may be for different bundle");
}
```

## Profile Compatibility

Check profile compatibility:

```typescript
import { getProfileRequirements } from '@verifrax/profiles';

const requirements = getProfileRequirements(verdict.profile_id);
// Use requirements to validate bundle structure
```

## Version Compatibility

Check version compatibility:

```typescript
const compatible = 
  isSchemaVersionSupported(verdict.schema_hashes) &&
  isContractVersionSupported(verdict.contract_hash) &&
  isProfileVersionSupported(verdict.profile_id);

if (!compatible) {
  // Verdict may be unreliable
}
```

## Best Practices

1. **Always verify bundle hash** matches verdict.bundle_hash
2. **Check version compatibility** before trusting verdict
3. **Handle CONTRADICTED specially** - this indicates fraud
4. **Use reason codes** for detailed error handling
5. **Check counterfactuals** to understand what's missing
6. **Verify invalidation status** for retroactive changes
7. **Log verdict with full context** for audit trails

