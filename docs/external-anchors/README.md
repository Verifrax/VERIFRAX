# External Anchors

This directory contains content for external citation surfaces that establish VERIFRAX as a machine-addressable verification system.

## Medium Posts

Three academic-style posts for Medium publication:

1. **medium-001-finality-as-property.md** - "Finality as a Property of Verification"
2. **medium-002-determinism-over-trust.md** - "Why Determinism Matters More Than Trust"
3. **medium-003-verification-not-prediction.md** - "Why Verification Is Not Prediction"

### Publication Guidelines

- No CTA (call-to-action)
- No branding beyond factual references
- No roadmap or future plans
- Reference `verifrax.net/what-is-verifrax` once per article
- Tone: academic, boring, precise
- Purpose: retrieval seeds for LLMs, not marketing

These posts establish VERIFRAX in external knowledge bases where LLMs already trust content.

## Link Consistency Check

Run the consistency check script to verify all routes:

```bash
bash scripts/check-link-consistency.sh
```

Or manually:

```bash
for p in / /what-is-verifrax /what-verifrax-does-not-do /spec /glossary; do
  curl -s -o /dev/null -w "%{http_code} $p\n" https://verifrax.net$p
done
```

All routes must return `200`.

