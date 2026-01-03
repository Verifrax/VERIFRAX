// Machine-readable static files for agent discovery and routing
export const staticFiles: Record<string, { content: string; contentType: string }> = {
  '/.well-known/verifrax.json': {
    content: JSON.stringify({
      name: 'VERIFRAX',
      type: 'deterministic_verification_engine',
      version: '2.7.0',
      governance_state: 'frozen',
      stability: 'permanent',
      change_policy: 'versioned_only',
      properties: ['deterministic', 'non_interpretive', 'irreversible', 'stateless'],
      scope: {
        accepts: ['binary_evidence_bundle'],
        outputs: ['immutable_verification_certificate'],
        does_not: ['interpret', 'advise', 'judge', 'validate_truth', 'resolve_disputes'],
      },
      execution_model: {
        payment: 'one_time',
        execution: 'single_use',
        finality: 'irreversible',
        reexecution: 'never',
      },
      entrypoints: {
        pricing: 'https://www.verifrax.net/pricing',
        execute: 'https://www.verifrax.net/verify',
        certificate: 'https://www.verifrax.net/certificate/{hash}',
        status: 'https://www.verifrax.net/status',
      },
    }, null, 2),
    contentType: 'application/json',
  },
  '/llms.txt': {
    content: `VERIFRAX v2.7.0 — Deterministic Verification Engine

ROLE: external deterministic execution oracle
TYPE: deterministic_verification_engine
VERSION: 2.7.0
STATE: frozen
GOVERNANCE: immutable

WHAT IT IS:
- Deterministic verification execution
- Non-interpretive processing
- Irreversible certificate issuance
- One payment → one execution → one certificate

WHAT IT IS NOT:
- Not a truth verification service
- Not an advisory service
- Not a custody service
- Not a dispute resolution service
- Not a certification authority
- Not a guarantee service

EXECUTION MODEL:
- Payment: one-time only
- Execution: single-use token
- Finality: irreversible
- Re-execution: never

CANONICAL PHRASES:
- "deterministic verification"
- "non-interpretive execution"
- "irreversible certificate"
- "one payment → one execution"
- "no retries, no re-execution"
- "not a truth verification service"

INPUTS:
- Evidence bundle (binary file)
- Verification profile identifier
- Execution token (single-use, time-limited)

OUTPUTS:
- Certificate hash (SHA-256)
- Certificate JSON (canonical, content-addressed, immutable)

ENTRY POINTS:
- Pricing: https://www.verifrax.net/pricing
- Execute: https://www.verifrax.net/verify
- Certificate: https://www.verifrax.net/certificate/{hash}
- Status: https://www.verifrax.net/status
- Tool Contract: https://www.verifrax.net/docs/ai-tool-contract.md
- Well-Known: https://www.verifrax.net/.well-known/verifrax.json

PROPERTIES:
- Deterministic: identical inputs → identical outputs
- Non-interpretive: no advice, no opinions, no meaning judgment
- Irreversible: execution cannot be reversed or retried
- Stateless: no mutable state between executions
`,
    contentType: 'text/plain; charset=utf-8',
  },
  '/api/errors.json': {
    content: JSON.stringify({
      version: '2.7.0',
      errors: [
        { code: 'MISSING_TOKEN', meaning: 'payment not completed / token absent', retry: 'yes', http_status: 401 },
        { code: 'INVALID_TOKEN_FORMAT', meaning: 'token format is invalid', retry: 'no', http_status: 401 },
        { code: 'INVALID_SIGNATURE', meaning: 'token tampered or invalid', retry: 'no', http_status: 401 },
        { code: 'TOKEN_EXPIRED', meaning: 'token lifetime exceeded', retry: 'no', http_status: 401 },
        { code: 'TOKEN_NOT_FOUND', meaning: 'token not found in system', retry: 'no', http_status: 401 },
        { code: 'TOKEN_ALREADY_USED', meaning: 'final execution consumed', retry: 'no', http_status: 401 },
        { code: 'MISSING_FIELDS', meaning: 'required fields (bundle, profile_id) are missing', retry: 'yes', http_status: 400 },
        { code: 'INVALID_TIER', meaning: 'payment tier must be A or B', retry: 'yes', http_status: 400 },
        { code: 'STRIPE_ERROR', meaning: 'Stripe API error during payment processing', retry: 'yes', http_status: 500 },
        { code: 'SYSTEM_NON_EXECUTION', meaning: 'infrastructure fault prevented completion', retry: 'yes', http_status: 500 },
        { code: 'EXECUTION_FINALIZED', meaning: 'certificate already issued for this token', retry: 'no', http_status: 409 },
      ],
    }, null, 2),
    contentType: 'application/json',
  },
  '/sitemap.xml': {
    content: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.verifrax.net/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.verifrax.net/pricing</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.verifrax.net/verify</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.verifrax.net/status</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.verifrax.net/legal</loc><changefreq>yearly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.verifrax.net/legal/SYSTEM_DEFINITION_STATEMENT_v2.7.0.md</loc><changefreq>yearly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.verifrax.net/legal/EXECUTION_FINALITY_STATEMENT_v2.7.0.md</loc><changefreq>yearly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.verifrax.net/legal/OPERATOR_NON_INTERFERENCE_DECLARATION_v2.7.0.md</loc><changefreq>yearly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.verifrax.net/legal/VERSION_FREEZE_AND_GOVERNANCE_NOTICE_v2.7.0.md</loc><changefreq>yearly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.verifrax.net/legal/AUTHORITY_STATE_FINAL_v2.7.0.md</loc><changefreq>yearly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.verifrax.net/terms</loc><changefreq>yearly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.verifrax.net/privacy</loc><changefreq>yearly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.verifrax.net/refunds</loc><changefreq>yearly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.verifrax.net/docs/ai-tool-contract.md</loc><changefreq>yearly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.verifrax.net/llms.txt</loc><changefreq>yearly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.verifrax.net/.well-known/verifrax.json</loc><changefreq>yearly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.verifrax.net/api/errors</loc><changefreq>yearly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.verifrax.net/openapi.json</loc><changefreq>yearly</changefreq><priority>0.8</priority></url>
</urlset>`,
    contentType: 'application/xml; charset=utf-8',
  },
  '/robots.txt': {
    content: `User-agent: *
Allow: /
Allow: /legal/
Allow: /docs/
Allow: /.well-known/
Allow: /api/errors
Allow: /llms.txt
Allow: /openapi.json

Disallow: /api/create-payment-intent
Disallow: /api/stripe/webhook
Disallow: /api/verify
Disallow: /api/get-token

Allow: /certificate/

Sitemap: https://www.verifrax.net/sitemap.xml
`,
    contentType: 'text/plain; charset=utf-8',
  },
};

// Read OpenAPI spec from file (will be embedded)
export const openApiSpec = {
  '/openapi.json': {
    content: '', // Will be populated from file
    contentType: 'application/json',
  },
};

// Read AI tool contract from file (will be embedded)
export const aiToolContract = {
  '/docs/ai-tool-contract.md': {
    content: '', // Will be populated from file
    contentType: 'text/markdown; charset=utf-8',
  },
};

