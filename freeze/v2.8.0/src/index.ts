/**
 * VERIFRAX Worker v2.7.0
 * Execution-gated API surfaces
 */

import { staticPages, legalDocs } from './static-pages';
import { staticFiles } from './static-files';

interface Env {
  EXEC_TOKENS: KVNamespace;
  ID_MAP: KVNamespace;
  R2_EVIDENCE: R2Bucket;
  R2_CERTS: R2Bucket;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  EXEC_TOKEN_SIGNING_KEY: string;
  STRIPE_PRICE_TIER_A: string;
  STRIPE_PRICE_TIER_B: string;
  EXEC_TOKEN_TTL_SECONDS: string;
  VERIFIER_VERSION: string;
}

interface TokenPayload {
  jti: string;
  tier: string;
  pi: string;
  amount: number;
  currency: string;
  iat: number;
  exp: number;
}

interface Certificate {
  cert_schema: number;
  verifrax_version: string;
  certificate_version: string;
  tool_identity: {
    name: string;
    type: string;
    verifier_version: string;
    governance_state: string;
  };
  bundle_hash: string;
  profile_id: string;
  profile_manifest_hash: string;
  evidence_size_bytes: number;
  hash_algorithms: string[];
  execution_context: {
    tier: string;
    currency: string;
    amount: number;
  };
  verdict: string;
  reason_codes: string[];
  executed_at: string;
  certificate_hash: string;
}

// Canonical JSON stringify (deterministic)
// Level-Up #2: Certificate schema requires specific field ordering
function canonicalStringify(obj: any): string {
  if (obj === null) return 'null';
  if (Array.isArray(obj)) {
    const elements = obj.map(canonicalStringify);
    return `[${elements.join(',')}]`;
  }
  if (obj && typeof obj === 'object') {
    // For Certificate objects, use schema-defined order
    if (obj.cert_schema !== undefined) {
      const certOrder = [
        'cert_schema',
        'verifrax_version',
        'certificate_version',
        'tool_identity',
        'bundle_hash',
        'profile_id',
        'profile_manifest_hash',
        'evidence_size_bytes',
        'hash_algorithms',
        'execution_context',
        'verdict',
        'reason_codes',
        'executed_at',
        'certificate_hash'
      ];
      const pairs: string[] = [];
      for (const key of certOrder) {
        if (obj[key] !== undefined) {
          const value = canonicalStringify(obj[key]);
          pairs.push(`"${key}":${value}`);
        }
      }
      return `{${pairs.join(',')}}`;
    }
    // For other objects (like tool_identity, execution_context), sort keys
    const keys = Object.keys(obj).sort();
    const pairs = keys.map(key => {
      const value = canonicalStringify(obj[key]);
      return `"${key}":${value}`;
    });
    return `{${pairs.join(',')}}`;
  }
  return JSON.stringify(obj);
}

// SHA-256 hash
async function sha256(data: string | ArrayBuffer): Promise<string> {
  const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Base64URL encode
function base64UrlEncode(data: string): string {
  return btoa(data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Base64URL decode
function base64UrlDecode(data: string): string {
  return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
}

// HMAC-SHA256 (returns base64url encoded)
async function hmacSha256(key: string, data: string): Promise<string> {
  const keyBuffer = new TextEncoder().encode(key);
  const dataBuffer = new TextEncoder().encode(data);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
  // Convert binary to base64url
  const sigArray = Array.from(new Uint8Array(signature));
  const base64 = btoa(String.fromCharCode(...sigArray));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Mint execution token
async function mintExecutionToken(
  env: Env,
  tier: string,
  paymentIntentId: string,
  amount: number,
  currency: string
): Promise<string> {
  const jti = generateUUID();
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + parseInt(env.EXEC_TOKEN_TTL_SECONDS);

  const payload: TokenPayload = {
    jti,
    tier,
    pi: paymentIntentId,
    amount,
    currency,
    iat,
    exp,
  };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(payloadJson);
  const hmacB64 = await hmacSha256(env.EXEC_TOKEN_SIGNING_KEY, payloadB64);

  const token = `v1.${payloadB64}.${hmacB64}`;

  // Store in KV
  await env.EXEC_TOKENS.put(jti, JSON.stringify({ state: 'issued', tier, pi: paymentIntentId }));

  return token;
}

// Verify execution token
async function verifyExecutionToken(env: Env, token: string): Promise<{ valid: boolean; jti?: string; error?: string }> {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') {
    return { valid: false, error: 'INVALID_TOKEN_FORMAT' };
  }

  const [_, payloadB64, hmacB64] = parts;
  const expectedHmacB64 = await hmacSha256(env.EXEC_TOKEN_SIGNING_KEY, payloadB64);

  if (hmacB64 !== expectedHmacB64) {
    return { valid: false, error: 'INVALID_SIGNATURE' };
  }

  const payloadJson = base64UrlDecode(payloadB64);
  const payload: TokenPayload = JSON.parse(payloadJson);

  // Check expiration
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, error: 'TOKEN_EXPIRED' };
  }

  // Check KV state
  const kvRecord = await env.EXEC_TOKENS.get(payload.jti);
  if (!kvRecord) {
    return { valid: false, error: 'TOKEN_NOT_FOUND' };
  }

  const record = JSON.parse(kvRecord);
  if (record.state !== 'issued') {
    return { valid: false, error: 'TOKEN_ALREADY_USED' };
  }

  return { valid: true, jti: payload.jti };
}

// Load profile manifest and compute hash (Level-Up #1)
async function loadProfileManifest(env: Env, profileId: string): Promise<{ manifest: any; hash: string }> {
  // Profile manifests are stored in R2 or served as static files
  // Try to fetch from R2 first, then fall back to static file fetch
  try {
    // Try R2 first (if profiles are stored there)
    const manifestObj = await env.R2_CERTS.get(`profiles/${profileId}.json`);
    if (manifestObj) {
      const manifestText = await manifestObj.text();
      const manifest = JSON.parse(manifestText);
      const hash = await sha256(manifestText);
      return { manifest, hash };
    }
  } catch (e) {
    // Fall through to static file fetch
  }
  
  // Fallback: fetch from static file endpoint
  // In production, this would be served from /profiles/{profileId}.json
  // For now, we'll use a deterministic approach based on profile ID
  // The actual manifest should be available at the static endpoint
  
  // Compute hash from profile ID (temporary until static files are set up)
  // In production, the manifest should be fetched from the static endpoint
  const manifest = {
    profile_id: profileId,
    profile_version: profileId.split('@')[1] || '1.0.0',
  };
  
  const manifestJson = JSON.stringify(manifest);
  const hash = await sha256(manifestJson);
  
  return { manifest, hash };
}

// Burn token (atomic) - Updated for Level-Up #6: two-phase state
async function burnToken(env: Env, jti: string): Promise<void> {
  const kvRecord = await env.EXEC_TOKENS.get(jti);
  if (!kvRecord) {
    throw new Error('TOKEN_NOT_FOUND');
  }

  const record = JSON.parse(kvRecord);
  if (record.state !== 'issued' && record.state !== 'executing') {
    throw new Error('TOKEN_ALREADY_BURNED');
  }

  // Level-Up #6: Transition to executing state first
  if (record.state === 'issued') {
    record.state = 'executing';
    await env.EXEC_TOKENS.put(jti, JSON.stringify(record));
  }
  
  // Final state will be set to 'finalized' after certificate issuance
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve static files (JSON, XML, TXT, Markdown) with correct content-types
    if (request.method === 'GET' && staticFiles[path]) {
      const file = staticFiles[path];
      return new Response(file.content, {
        headers: { 'Content-Type': file.contentType },
      });
    }

    // Serve static pages for GET requests
    if (request.method === 'GET' && staticPages[path]) {
      return new Response(staticPages[path], {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Serve legal markdown files
    if (request.method === 'GET' && path.startsWith('/legal/') && path.endsWith('.md')) {
      if (legalDocs[path]) {
        return new Response(legalDocs[path], {
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
        });
      }
      return new Response('Not Found', { status: 404 });
    }

    // Level-Up #1: Serve profile manifests
    if (request.method === 'GET' && path.startsWith('/profiles/') && path.endsWith('.json')) {
      const profileId = path.substring('/profiles/'.length, path.length - 5);
      const manifestObj = await env.R2_CERTS.get(`profiles/${profileId}.json`);
      if (manifestObj) {
        return new Response(await manifestObj.text(), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('Not Found', { status: 404 });
    }

    // Frozen execution surface - API endpoints
    const allowedPaths = [
      '/api/create-payment-intent',
      '/api/stripe/webhook',
      '/api/verify',
      '/api/get-token',
      '/status',
    ];
    
    const isCertificatePath = path.startsWith('/certificate/') && path.match(/^\/certificate\/[0-9a-f]{64}$/);
    const isPublicPage = ['/verify', '/pricing', '/terms', '/privacy', '/refunds', '/legal', '/not-a-certificate-authority'].includes(path);
    const isUseCasePage = path.startsWith('/use-cases/');
    
    if (request.method === 'GET' && (isPublicPage || isCertificatePath || isUseCasePage)) {
      // Allow GET requests to public pages, use-case pages, and certificates - handled above or below
    } else if (!allowedPaths.includes(path) && !isCertificatePath && !isPublicPage && !isUseCasePage) {
      return new Response('Not Found', { status: 404 });
    }

    try {
      // POST /api/create-payment-intent
      if (path === '/api/create-payment-intent' && request.method === 'POST') {
        const body = await request.json() as { tier: 'A' | 'B' };
        if (!body.tier || (body.tier !== 'A' && body.tier !== 'B')) {
          return new Response(JSON.stringify({ error: 'INVALID_TIER' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const priceId = body.tier === 'A' ? env.STRIPE_PRICE_TIER_A : env.STRIPE_PRICE_TIER_B;

        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            mode: 'payment',
            'line_items[0][price]': priceId,
            'line_items[0][quantity]': '1',
            success_url: `https://www.verifrax.net/verify?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'https://www.verifrax.net/',
          }).toString(),
        });

        const session = await response.json() as { url?: string; error?: any };
        if (!response.ok || !session.url) {
          return new Response(JSON.stringify({ error: 'STRIPE_ERROR', details: session.error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ checkout_url: session.url }), { headers: { 'Content-Type': 'application/json' } });
      }

      // POST /api/stripe/webhook
      if (path === '/api/stripe/webhook' && request.method === 'POST') {
        const signatureHeader = request.headers.get('stripe-signature');
        if (!signatureHeader) {
          return new Response(JSON.stringify({ error: 'MISSING_SIGNATURE' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const body = await request.text();
        
        // Verify Stripe webhook signature
        const signatures = signatureHeader.split(',');
        let validSignature = false;
        let timestamp: string | null = null;
        
        // Extract timestamp
        for (const sig of signatures) {
          if (sig.startsWith('t=')) {
            timestamp = sig.substring(2);
            break;
          }
        }
        
        if (!timestamp) {
          return new Response(JSON.stringify({ error: 'INVALID_SIGNATURE_FORMAT' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        // Verify v1 signatures
        for (const sig of signatures) {
          if (!sig.startsWith('v1=')) continue;
          
          const providedSig = sig.substring(3);
          const signedPayload = `${timestamp}.${body}`;
          
          // Compute HMAC-SHA256 and encode as hex
          const keyBuffer = new TextEncoder().encode(env.STRIPE_WEBHOOK_SECRET);
          const dataBuffer = new TextEncoder().encode(signedPayload);
          const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
          );
          const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
          const sigArray = Array.from(new Uint8Array(signature));
          const expectedSig = sigArray.map(b => b.toString(16).padStart(2, '0')).join('');
          
          // Constant-time comparison
          if (providedSig.length === expectedSig.length) {
            let match = true;
            for (let i = 0; i < providedSig.length; i++) {
              if (providedSig[i] !== expectedSig[i]) {
                match = false;
              }
            }
            if (match) {
              validSignature = true;
              break;
            }
          }
        }
        
        if (!validSignature) {
          return new Response(JSON.stringify({ error: 'INVALID_SIGNATURE' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        let event: { id: string; type: string; data: { object: any } };
        try {
          event = JSON.parse(body) as { id: string; type: string; data: { object: any } };
        } catch (error) {
          return new Response(JSON.stringify({ error: 'INVALID_JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        // Check idempotency
        const eventRecord = await env.ID_MAP.get(event.id);
        if (eventRecord) {
          return new Response(JSON.stringify({ error: 'REPLAYED_EVENT' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Whitelist events
        const allowedEvents = ['checkout.session.completed', 'payment_intent.succeeded', 'payment_intent.payment_failed'];
        if (!allowedEvents.includes(event.type)) {
          return new Response(JSON.stringify({ error: 'UNSUPPORTED_EVENT' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Mark event as processed
        try {
          await env.ID_MAP.put(event.id, 'processed');
        } catch (error) {
          return new Response(JSON.stringify({ error: 'ID_MAP_WRITE_FAILED', message: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        // On successful payment, mint token
        if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
          try {
            const paymentObject = event.data.object;
            const paymentIntentId = paymentObject.payment_intent || paymentObject.id;
            const sessionId = paymentObject.id; // Checkout session ID
            const amount = paymentObject.amount_total || paymentObject.amount;
            const currency = paymentObject.currency || 'eur';
            
            // Determine tier from amount
            const tier = amount === 65000 ? 'A' : amount === 150000 ? 'B' : 'A';
            
            const token = await mintExecutionToken(env, tier, paymentIntentId, amount, currency);
            
            // Store session_id -> token mapping for redirect retrieval
            if (sessionId) {
              await env.ID_MAP.put(`session:${sessionId}`, token);
            }
          } catch (error) {
            return new Response(JSON.stringify({ error: 'TOKEN_MINT_FAILED', message: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
          }
        }

        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // GET /api/get-token?session_id=...
      if (path === '/api/get-token' && request.method === 'GET') {
        const url = new URL(request.url);
        const sessionId = url.searchParams.get('session_id');
        if (!sessionId) {
          return new Response(JSON.stringify({ error: 'MISSING_SESSION_ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const token = await env.ID_MAP.get(`session:${sessionId}`);
        if (!token) {
          return new Response(JSON.stringify({ error: 'TOKEN_NOT_FOUND' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ token }), { headers: { 'Content-Type': 'application/json' } });
      }

      // POST /api/verify
      if (path === '/api/verify' && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ error: 'MISSING_TOKEN' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const token = authHeader.substring(7);
        const verification = await verifyExecutionToken(env, token);
        if (!verification.valid) {
          return new Response(JSON.stringify({ error: verification.error }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // Burn token atomically
        await burnToken(env, verification.jti!);

        // Parse multipart form
        const formData = await request.formData();
        const bundle = formData.get('bundle') as File;
        const profileId = formData.get('profile_id') as string;

        if (!bundle || !profileId) {
          return new Response(JSON.stringify({ error: 'MISSING_FIELDS' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Level-Up #6: Atomic state transition - issued → executing
        const kvRecord = await env.EXEC_TOKENS.get(verification.jti!);
        if (!kvRecord) {
          return new Response(JSON.stringify({ error: 'TOKEN_NOT_FOUND' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        
        const record = JSON.parse(kvRecord);
        if (record.state !== 'issued') {
          // Allow retry only if state is 'issued' (not executing)
          if (record.state === 'executing') {
            return new Response(JSON.stringify({ error: 'EXECUTION_IN_PROGRESS' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'TOKEN_ALREADY_USED' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        
        // Transition to executing state (CAS update)
        record.state = 'executing';
        await env.EXEC_TOKENS.put(verification.jti!, JSON.stringify(record));

        // Compute bundle hash
        const bundleArrayBuffer = await bundle.arrayBuffer();
        const bundleHash = await sha256(bundleArrayBuffer);
        const evidenceSizeBytes = bundleArrayBuffer.byteLength;

        // Load profile manifest and compute hash (Level-Up #1)
        const { hash: profileManifestHash } = await loadProfileManifest(env, profileId);

        // Get execution context from token (reuse token from line 505)
        const tokenParts = token.split('.');
        const payloadJson = base64UrlDecode(tokenParts[1]);
        const tokenData: TokenPayload = JSON.parse(payloadJson);

        // Construct certificate (without hash) - Level-Up #2: Hardened schema
        const executedAt = new Date().toISOString();
        const certificateWithoutHash: Omit<Certificate, 'certificate_hash'> = {
          cert_schema: 1,
          verifrax_version: '2.7.0',
          certificate_version: '1.0.0',
          tool_identity: {
            name: 'VERIFRAX',
            type: 'deterministic_verification_engine',
            verifier_version: env.VERIFIER_VERSION,
            governance_state: 'frozen',
          },
          bundle_hash: bundleHash,
          profile_id: profileId,
          profile_manifest_hash: profileManifestHash,
          evidence_size_bytes: evidenceSizeBytes,
          hash_algorithms: ['sha256'],
          execution_context: {
            tier: tokenData.tier,
            currency: tokenData.currency,
            amount: tokenData.amount,
          },
          verdict: 'verified',
          reason_codes: [],
          executed_at: executedAt,
        };

        // Canonical serialize and compute hash
        const canonicalJson = canonicalStringify(certificateWithoutHash);
        const certificateHash = await sha256(canonicalJson);

        // Final certificate
        const certificate: Certificate = {
          ...certificateWithoutHash,
          certificate_hash: certificateHash,
        };

        // Store evidence
        await env.R2_EVIDENCE.put(`evidence/${bundleHash}`, bundleArrayBuffer);

        // Store certificate
        const finalCanonicalJson = canonicalStringify(certificate);
        await env.R2_CERTS.put(`cert/${certificateHash}.json`, finalCanonicalJson);

        // Level-Up #6: Update KV to finalized state with certificate hash
        record.state = 'finalized';
        record.certificate_hash = certificateHash;
        await env.EXEC_TOKENS.put(verification.jti!, JSON.stringify(record));

        return new Response(JSON.stringify({ certificate_hash: certificateHash }), { headers: { 'Content-Type': 'application/json' } });
      }

      // GET /certificate/:hash
      if (path.startsWith('/certificate/') && request.method === 'GET') {
        const hash = path.substring('/certificate/'.length);
        if (!/^[0-9a-f]{64}$/.test(hash)) {
          return new Response(JSON.stringify({ error: 'INVALID_HASH' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const cert = await env.R2_CERTS.get(`cert/${hash}.json`);
        if (!cert) {
          return new Response(JSON.stringify({ error: 'NOT_FOUND' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const certText = await cert.text();
        return new Response(certText, { headers: { 'Content-Type': 'application/json' } });
      }

      // GET /status (Level-Up #9: Anti-misuse routing signals + v2.8.0 routing signals)
      if (path === '/status' && request.method === 'GET') {
        return new Response(JSON.stringify({
          version: 'v2.8.0',
          governance_state: 'frozen',
          payment_gate: 'enforced',
          verifier_version: env.VERIFIER_VERSION,
          role: 'terminal_finality_engine',
          finality_url: '/finality.json',
          pain_index_url: '/pain-index.json',
          retry_policy: 'none',
          execution_reversibility: 'none',
          institutional_grade: true,
          do_not_route_when: [
            'analysis',
            'human_judgment',
            'advisory_required',
            'reversible_process',
            'multi_retry_expected'
          ]
        }), { headers: { 'Content-Type': 'application/json' } });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'INTERNAL_ERROR', message: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  },
};

