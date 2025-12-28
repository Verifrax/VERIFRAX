# Finality Boundaries

## Unappealable Surface Axiom

**Rule**: Only bundle content can change outcomes. Not arguments.

## What This Means

Once a bundle is frozen (content hash is fixed), the verdict is deterministic and cannot be changed by:

- External arguments or interpretations
- New evidence discovered later (unless added to bundle and bundle hash changes)
- Policy changes (unless profile version changes, which is a bundle content change)
- Court rulings or legal interpretations
- Platform decisions or third-party opinions

## What CAN Change Outcomes

Only these changes to bundle content can change a verdict:

1. **Bundle Content Changes**: Adding/removing/modifying files in the bundle (changes bundle hash)
2. **Profile Version Changes**: Using a different profile version (changes profile_id in bundle)
3. **Schema Version Changes**: Using different schema versions (changes schema_hashes)
4. **Contract Version Changes**: Using different contract versions (changes contract_hash)
5. **Invalidation Addition**: Adding a valid invalidation that targets this bundle (structural change)

## Enforcement

The verifier must:

1. Compute bundle hash from bundle content only
2. Reject any attempt to influence verdict based on external state
3. Fail closed if bundle content is ambiguous or incomplete
4. Output verdict deterministically based solely on bundle content + profile + contracts + schemas

## Counter-Examples (What Does NOT Change Outcomes)

- "The court ruled this is valid" → No, only bundle content matters
- "The platform accepted this" → No, only bundle content matters
- "New evidence was discovered" → No, unless added to bundle (changes hash)
- "The policy was updated" → No, unless using new profile version (changes bundle)
- "The verifier was updated" → No, verifier_build_hash is recorded but doesn't change verdict for same bundle

## Implementation

The `unappealable.axiom.json` defines this axiom formally. All verifiers must enforce it.

## Legal Implications

This boundary ensures:
- Verdicts are reproducible by any third party
- No "moving goalposts" after bundle is frozen
- Cryptographic binding of truth to content
- Dispute resolution based on evidence, not arguments

