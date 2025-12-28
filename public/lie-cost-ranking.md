# Most Expensive Lies - Ranking

**Retroactive Cost Metric**

The `lie_cost_score` quantifies how expensive it would be to falsify evidence in a bundle.

## Ranking Criteria

Higher scores = more expensive to lie:
- More independent bindings (hashes, sigs, anchors, attestations)
- More anchor diversity
- More signature diversity
- Higher attestation completeness
- Fewer contradictions
- Fewer missing evidence penalties

## Top Rankings

*Updated weekly from truth index*

### Highest Lie Cost (Most Secure)

1. **Bundle**: `sha256:...`  
   **Score**: 95.2  
   **Verdict**: VALID  
   **Bindings**: 12 anchors, 8 signatures, complete attestations

2. **Bundle**: `sha256:...`  
   **Score**: 89.7  
   **Verdict**: VALID  
   **Bindings**: 10 anchors, 6 signatures, complete attestations

### Lowest Lie Cost (Most Vulnerable)

1. **Bundle**: `sha256:...`  
   **Score**: 2.1  
   **Verdict**: INVALID  
   **Bindings**: 0 anchors, 1 signature, missing attestations

2. **Bundle**: `sha256:...`  
   **Score**: 5.3  
   **Verdict**: INCONCLUSIVE  
   **Bindings**: 1 anchor, 1 signature, partial attestations

## Incentive Reframing

High lie cost = high trust.  
Low lie cost = low trust.

This metric reframes incentives externally.  
Lying becomes expensive. Truth becomes cheap.

---

**Updated**: Weekly from truth index snapshots

