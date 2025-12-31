# Final Tag & Archive Sweep

## Tags to Create

1. **v2.4.0**
   - Points to: `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`
   - Message: "VERIFRAX v2.4.0 — Frozen"

2. **v2.4.0-stripe-reviewed**
   - Points to: `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`
   - Message: "VERIFRAX v2.4.0 — Stripe Reviewed"

## Tag Protection

- Lock tags (no force-push)
- Require maintainer approval for tag deletion
- Protect tags from modification

## Archive Repositories

Archive any repository not explicitly listed as authoritative:
- Deprecated repositories
- Experimental repositories
- Non-authoritative repositories (if not actively maintained)

## Branch Protection

- Protected default branch
- Require pull request reviews (even solo)
- Require status checks
- Require signed commits (for freezes)
- No force push
- No deletion

## Lock Status

All authoritative repositories:
- Branches: PROTECTED
- Tags: PROTECTED
- Force-push: DISABLED

