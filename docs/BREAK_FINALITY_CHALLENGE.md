# Break Finality Challenge

**Adversarial Audit Invitation**

## Challenge

Break VERIFRAX finality. Prove that two contradictory claims can both be VALID under the same profile.

## Rules

1. Create two claims with:
   - Same subject (identifier + type)
   - Incompatible assertions
   - Both validly signed
   - Same or compatible profiles

2. Submit bundle containing both claims

3. Verifier must output: `CONTRADICTED` or `INVALID`

## Accepted Outcomes

- ✅ `CONTRADICTED` - Challenge failed (finality holds)
- ✅ `INVALID` - Challenge failed (finality holds)
- ❌ `VALID` for both claims - Challenge succeeded (finality broken)

## Reward

**Recognition only**:
- Public acknowledgment of break
- Credit in security advisories
- No monetary reward

## Submission

Submit via:
- GitHub Security Advisory
- Email: security@verifrax.org
- Public issue (if reproducible)

## Verification

1. We reproduce your bundle
2. We run verifier
3. We publish verdict publicly
4. If finality broken, we acknowledge and fix

## Current Status

**No successful breaks reported.**

Finality holds.

---

**Break finality. Prove us wrong. We invite it.**

