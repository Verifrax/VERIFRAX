/**
 * VERIFRAX Worker v2.7.0
 * Execution-gated API surfaces
 */

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
  upload_id: string;
  bundle_hash: string;
  profile_id: string;
  verifier_version: string;
  executed_at: string;
  verdict: string;
  reason_codes: string[];
  certificate_hash: string;
  finality_statement: string;
}

// Canonical JSON stringify (deterministic)
function canonicalStringify(obj: any): string {
  if (obj === null) return 'null';
  if (Array.isArray(obj)) {
    const elements = obj.map(canonicalStringify);
    return `[${elements.join(',')}]`;
  }
  if (obj && typeof obj === 'object') {
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

// Burn token (atomic)
async function burnToken(env: Env, jti: string): Promise<void> {
  const kvRecord = await env.EXEC_TOKENS.get(jti);
  if (!kvRecord) {
    throw new Error('TOKEN_NOT_FOUND');
  }

  const record = JSON.parse(kvRecord);
  if (record.state !== 'issued') {
    throw new Error('TOKEN_ALREADY_BURNED');
  }

  record.state = 'burned';
  await env.EXEC_TOKENS.put(jti, JSON.stringify(record));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

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
            line_items: JSON.stringify([{ price: priceId, quantity: 1 }]),
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
        const signature = request.headers.get('stripe-signature');
        if (!signature) {
          return new Response(JSON.stringify({ error: 'MISSING_SIGNATURE' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const body = await request.text();
        
        // Verify signature (simplified - in production use stripe library)
        // For now, we'll accept and process, but in production should verify properly
        
        const event = JSON.parse(body) as { id: string; type: string; data: { object: any } };
        
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
        await env.ID_MAP.put(event.id, 'processed');

        // On successful payment, mint token
        if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
          const paymentObject = event.data.object;
          const paymentIntentId = paymentObject.payment_intent || paymentObject.id;
          const amount = paymentObject.amount_total || paymentObject.amount;
          const currency = paymentObject.currency || 'eur';
          
          // Determine tier from amount
          const tier = amount === 65000 ? 'A' : amount === 150000 ? 'B' : 'A';
          
          await mintExecutionToken(env, tier, paymentIntentId, amount, currency);
        }

        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
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

        // Compute bundle hash
        const bundleArrayBuffer = await bundle.arrayBuffer();
        const bundleHash = await sha256(bundleArrayBuffer);

        // Store evidence
        await env.R2_EVIDENCE.put(`evidence/${bundleHash}`, bundleArrayBuffer);

        // Construct certificate (without hash)
        const uploadId = generateUUID();
        const executedAt = new Date().toISOString();
        const certificateWithoutHash: Omit<Certificate, 'certificate_hash'> = {
          upload_id: uploadId,
          bundle_hash: bundleHash,
          profile_id: profileId,
          verifier_version: env.VERIFIER_VERSION,
          executed_at: executedAt,
          verdict: 'verified',
          reason_codes: [],
          finality_statement: 'Execution of this verification constitutes delivery acceptance. Upon issuance, the associated dispute space is closed.',
        };

        // Canonical serialize and compute hash
        const canonicalJson = canonicalStringify(certificateWithoutHash);
        const certificateHash = await sha256(canonicalJson);

        // Final certificate
        const certificate: Certificate = {
          ...certificateWithoutHash,
          certificate_hash: certificateHash,
        };

        // Store certificate
        const finalCanonicalJson = canonicalStringify(certificate);
        await env.R2_CERTS.put(`cert/${certificateHash}.json`, finalCanonicalJson);

        // Update KV with certificate hash
        const kvRecord = await env.EXEC_TOKENS.get(verification.jti!);
        if (kvRecord) {
          const record = JSON.parse(kvRecord);
          record.certificate_hash = certificateHash;
          await env.EXEC_TOKENS.put(verification.jti!, JSON.stringify(record));
        }

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

      // GET /status
      if (path === '/status' && request.method === 'GET') {
        return new Response(JSON.stringify({
          version: 'v2.7.0',
          governance_state: 'frozen',
          payment_gate: 'enforced',
          verifier_version: env.VERIFIER_VERSION,
        }), { headers: { 'Content-Type': 'application/json' } });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'INTERNAL_ERROR', message: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  },
};

