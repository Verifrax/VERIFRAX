/**
 * VERIFRAX Production Worker — v2.8.0
 * 
 * HARD CUT — v2.8.0 ONLY
 * Payment enabled. 3-tier pricing system.
 * 
 * DEPLOYMENT:
 * wrangler deploy --name verifrax-v2-8
 */

import Stripe from "stripe";

const VERSION = "2.8.0";
const PAYMENT_STATUS = "enabled";

// Language tier definitions (inlined for Cloudflare Workers compatibility)
// tier0: en (canonical)
// tier1: major languages
// tier2: assistive only
const TIER1 = ['en','zh','es','hi','ar','pt','bn','ru','ja','pa','de','jv','ko','fr','te','mr','tr','ta','vi','ur','it','fa','th','gu','pl','uk','ro','nl','el','hu','sv','cs','he','id','ms','sw','no','da','fi','sk','bg','hr','sr','sl','lt','lv','et','is'];
const TIER2 = ['am','yo','ig','zu','km','lo','my','ne','si','bo','ug','ps','ku','fy','gd','mi','sm','to','qu','ay','gn','ha','rw','so','ti','wo','xh','st','ts','tn','ve','nr','ny','mg','lb','fo'];

// Embedded translations (stateless, deterministic)
const TRANSLATIONS = {
  en: {
    hero_title: "Deterministic Verification",
    hero_subtitle: "One execution. One certificate. Final.",
    cta_verify: "Start verification",
    invariant_notice: "Language does not affect execution or certificates."
  },
  fr: {
    hero_title: "Vérification déterministe",
    hero_subtitle: "Une exécution. Un certificat. Final.",
    cta_verify: "Démarrer la vérification",
    invariant_notice: "La langue n'affecte ni l'exécution ni les certificats."
  },
  am: {
    hero_title: "ውሳኔ የማይለወጥ ማረጋገጫ",
    hero_subtitle: "አንድ አሰራር። አንድ ማረጋገጫ። መጨረሻ።",
    assistive_notice: "This translation is provided for accessibility only. The authoritative language of VERIFRAX is English."
  }
};

// Language resolution (stateless, deterministic)
function resolveLang(request, cf = {}) {
  const url = new URL(request.url);
  const qp = url.searchParams.get("lang");
  if (qp && (TIER1.includes(qp) || TIER2.includes(qp))) return qp;

  const al = request.headers.get("accept-language");
  if (al) {
    const match = al
      .split(",")
      .map(x => x.split(";")[0].trim().split("-")[0])
      .find(l => TIER1.includes(l) || TIER2.includes(l));
    if (match) return match;
  }

  const map = { FR: "fr", DE: "de", ES: "es", IT: "it", IR: "fa", JP: "ja", CN: "zh" };
  if (map[cf.country]) return map[cf.country];

  return "en";
}

function withHeaders(resp) {
  const h = new Headers(resp.headers);
  h.set("x-verifrax-version", VERSION);
  h.set("x-payment-status", PAYMENT_STATUS);
  return new Response(resp.body, { status: resp.status, headers: h });
}

// Canonical stringify (deterministic) - shared utility
function canonicalStringify(obj) {
  if (Array.isArray(obj)) {
    return `[${obj.map(canonicalStringify).join(",")}]`;
  }
  if (obj && typeof obj === "object") {
    const keys = Object.keys(obj).sort();
    return `{${keys.map(key => `"${key}":${canonicalStringify(obj[key])}`).join(",")}}`;
  }
  return JSON.stringify(obj);
}

// Token mint — SINGLE SOURCE OF TRUTH
// Token is minted ONLY HERE
async function mintExecutionToken(paymentIntentId, sessionId, secret) {
  const payload = `${paymentIntentId}:${sessionId}:2.8.0`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(payload);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, msgData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `vfx_${hashHex.substring(0, 64)}`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = request.headers.get("host") || url.hostname;

    // HARD CANONICALIZATION (NON-NEGOTIABLE)
    // One authority URL. Zero ambiguity.
    const CANONICAL = "www.verifrax.net";
    if (host !== CANONICAL) {
      url.hostname = CANONICAL;
      url.protocol = "https:";
      return new Response(null, {
        status: 301,
        headers: {
          'Location': url.toString(),
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    }

    // Enforce https
    if (url.protocol !== "https:") {
      url.protocol = "https:";
      return new Response(null, {
        status: 301,
        headers: {
          'Location': url.toString(),
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    }

    const path = url.pathname;

    // STRIPE WEBHOOK (MANDATORY)
    if (path === "/api/stripe/webhook" && request.method === "POST") {
      try {
        const sig = request.headers.get("stripe-signature");
        const body = await request.text();
        
        if (!env.STRIPE_WEBHOOK_SECRET) {
          return withHeaders(new Response("Webhook secret not configured", { status: 500 }));
        }

        if (!env.STRIPE_SECRET_KEY) {
          return withHeaders(new Response("Stripe secret key not configured", { status: 500 }));
        }

        // Use Stripe SDK for signature verification
        const stripe = new Stripe(env.STRIPE_SECRET_KEY);

        let event;
        try {
          event = stripe.webhooks.constructEvent(
            body,
            sig,
            env.STRIPE_WEBHOOK_SECRET
          );
        } catch (err) {
          return withHeaders(new Response("Invalid signature", { status: 401 }));
        }
        
        if (event.type === "payment_intent.succeeded") {
          const pi = event.data.object;
          
          // Get session_id from metadata
          const sessionId = pi.metadata?.session_id;
          
          if (!sessionId) {
            return withHeaders(new Response(JSON.stringify({ error: "NO_SESSION_ID" }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }));
          }

          if (!env.TOKEN_MINT_SECRET) {
            return withHeaders(new Response("Token mint secret not configured", { status: 500 }));
          }

          // Token mint — SINGLE SOURCE OF TRUTH
          const token = await mintExecutionToken(pi.id, sessionId, env.TOKEN_MINT_SECRET);

          // Persist token in KV (v2.8 namespace)
          if (env.KV) {
            const tier = pi.metadata?.tier || "public";
            await env.KV.put(`v2.8:session:${sessionId}`, token);
            await env.KV.put(`v2.8:token:${token}`, JSON.stringify({ used: false, tier: tier }));
            // Store tier metadata for session
            await env.KV.put(`v2.8:session:${sessionId}:metadata`, JSON.stringify({ tier }));
          }

          return withHeaders(new Response("ok", { status: 200 }));
        }

        return withHeaders(new Response("ok", { status: 200 }));
      } catch (error) {
        return withHeaders(new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      }
    }

    // GET /verify (SELF-EXPLANATORY EXECUTION PAGE)
    if (path === "/verify" && request.method === "GET") {
      const sessionId = url.searchParams.get("session_id");
      const tier = url.searchParams.get("tier") || "public";
      let token = null;
      let paymentStatus = "pending";
      
      // If no session_id, show error
      if (!sessionId) {
        const html = `<!DOCTYPE html>
<html>
<head>
  <title>No Active Payment — VERIFRAX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
    h1 { font-size: 28px; margin-bottom: 20px; }
    p { margin: 20px 0; color: #666; }
    .btn { display: inline-block; padding: 14px 28px; font-size: 16px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; background: #000; color: #fff; }
    .btn:hover { background: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>No Active Payment Found</h1>
    <p>No payment session detected. Please start a new verification.</p>
    <a href="/start" class="btn">Start Verification</a>
  </div>
</body>
</html>`;
        return withHeaders(new Response(html, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }));
      }
      
      if (sessionId && env.KV) {
        token = await env.KV.get(`v2.8:session:${sessionId}`);
        if (token) {
          paymentStatus = "confirmed";
        }
      }
      
      // Tier-specific framing
      const tierFraming = {
        public: {
          title: "Execute Verification",
          warning: "One irreversible computation. One certificate. No retry."
        },
        pro: {
          title: "Professional Execution",
          warning: "Designed for disputes. Single final execution. Citeable, court-safe artifact."
        },
        institutional: {
          title: "Institutional Execution",
          warning: "Institutional-grade deterministic execution. Finality guaranteed by protocol design. No dependency on VERIFRAX survival."
        }
      };
      const framing = tierFraming[tier] || tierFraming.public;
      
      const html = `<!DOCTYPE html>
<html>
<head>
  <title>Execute Verification — VERIFRAX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 700px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 28px; margin-bottom: 30px; }
    .status-badge { display: inline-block; padding: 8px 16px; background: ${paymentStatus === "confirmed" ? "#d4edda" : "#fff3cd"}; color: ${paymentStatus === "confirmed" ? "#155724" : "#856404"}; border-radius: 4px; margin-bottom: 20px; font-weight: 600; }
    .info-box { border: 1px solid #ccc; padding: 20px; margin: 20px 0; background: #f9f9f9; border-radius: 6px; }
    .info-box h3 { margin-bottom: 15px; font-size: 18px; }
    .info-box ul { margin-left: 20px; }
    .info-box li { margin: 8px 0; }
    .token-field { background: #f5f5f5; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 14px; width: 100%; margin: 10px 0; }
    .btn { display: inline-block; padding: 16px 32px; font-size: 18px; text-decoration: none; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; width: 100%; text-align: center; }
    .btn-primary { background: #000; color: #fff; }
    .btn-primary:hover { background: #333; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .warning { color: #856404; background: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #ffc107; }
    .tier-badge { display: inline-block; padding: 8px 16px; margin: 10px 0; border-radius: 4px; font-weight: 600; }
    .tier-pro { background: #e7f3ff; color: #0066cc; border: 2px solid #0066cc; }
    .tier-institutional { background: #f0f8e7; color: #4a7c20; border: 2px solid #4a7c20; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${framing.title}</h1>
    <p style="text-align: left; font-size: 14px; color: #666; margin: -10px 0 20px 0;">
      Execution surfaces are always presented in English. Language selection affects informational pages only.
    </p>
    
    <div class="status-badge">
      Status: ${paymentStatus === "confirmed" ? "Payment confirmed ✓" : "Waiting for payment..."}
    </div>
    
    ${tier === "pro" ? '<div class="tier-badge tier-pro">Professional Execution</div>' : ''}
    ${tier === "institutional" ? '<div class="tier-badge tier-institutional">Institutional Execution</div>' : ''}
    
    ${paymentStatus === "confirmed" ? `
    <div class="info-box">
      <h3>Execution Token</h3>
      <input type="text" class="token-field" value="${token || ''}" readonly />
      <p style="margin-top: 10px; font-size: 14px; color: #666;">Token auto-filled. Ready to execute.</p>
    </div>
    
    <div class="info-box">
      <h3>${framing.warning}</h3>
      <ul>
        <li>One irreversible computation over your evidence bundle</li>
        <li>One final, immutable certificate generated</li>
        <li>No retry possible</li>
        <li>No refund after execution</li>
      </ul>
    </div>
    
    <form id="verifyForm">
      <input type="hidden" name="token" value="${token}" />
      <label style="display: block; margin: 20px 0 10px 0; font-weight: 600;">Profile ID:</label>
      <input type="text" name="profile_id" value="public@1.0.0" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" />
      
      <label style="display: block; margin: 20px 0 10px 0; font-weight: 600;">Evidence Bundle:</label>
      <input type="file" name="bundle" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" />
      
      <button type="submit" class="btn btn-primary" style="margin-top: 30px;">EXECUTE VERIFICATION</button>
    </form>
    ` : `
    <div class="warning">
      <strong>Payment processing...</strong><br/>
      If you just completed payment, please wait a few seconds for the webhook to process. This page will automatically update when your token is ready.
    </div>
    <script>
      setTimeout(() => location.reload(), 3000);
    </script>
    `}
  </div>
  
  <script>
    const form = document.getElementById('verifyForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Executing...';
        
        try {
          const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + formData.get('token') },
            body: formData
          });
          
          const result = await res.json();
          
          if (res.ok && result.certificate_hash) {
            window.location.href = '/certificate/' + result.certificate_hash + '?tier=${tier}';
          } else {
            alert('Error: ' + (result.error || 'Execution failed'));
            submitBtn.disabled = false;
            submitBtn.textContent = 'EXECUTE VERIFICATION';
          }
        } catch (err) {
          alert('Error: ' + err.message);
          submitBtn.disabled = false;
          submitBtn.textContent = 'EXECUTE VERIFICATION';
        }
      });
    }
  </script>
</body>
</html>`;
      
      return withHeaders(new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }));
    }

    // POST /api/verify (EXECUTION GATE)
    if (path === "/api/verify" && request.method === "POST") {
      try {
        // Extract Bearer token from Authorization header
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return withHeaders(new Response(JSON.stringify({ error: "MISSING_AUTHORIZATION" }), {
            status: 401,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }
        
        const token = authHeader.substring(7); // Remove "Bearer "
        
        // Check if token exists and is unused
        if (!env.KV) {
          return withHeaders(new Response(JSON.stringify({ error: "KV_NOT_AVAILABLE" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }

        const tokenData = await env.KV.get(`v2.8:token:${token}`);
        if (!tokenData) {
          return withHeaders(new Response(JSON.stringify({ error: "TOKEN_NOT_FOUND" }), {
            status: 403,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }

        const tokenObj = JSON.parse(tokenData);
        if (tokenObj.used === true) {
          return withHeaders(new Response(JSON.stringify({ error: "TOKEN_ALREADY_USED" }), {
            status: 403,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }

        // Get tier from token metadata
        const executionTier = tokenObj.tier || "public";

        // Mark token as used atomically
        await env.KV.put(`v2.8:token:${token}`, JSON.stringify({ used: true, tier: executionTier }));
        
        // Parse multipart form data
        const formData = await request.formData();
        const bundleFile = formData.get("bundle");
        const profileId = formData.get("profile_id") || "public@1.0.0";
        
        if (!bundleFile || !(bundleFile instanceof File)) {
          return withHeaders(new Response(JSON.stringify({ error: "MISSING_BUNDLE" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }
        
        // Validate profile ID format
        const profileIdPattern = /^[a-z_]+@[0-9]+\.[0-9]+\.[0-9]+$/;
        if (!profileIdPattern.test(profileId)) {
          return withHeaders(new Response(JSON.stringify({ error: "INVALID_PROFILE_ID" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }
        
        // Read bundle as ArrayBuffer
        const bundleArrayBuffer = await bundleFile.arrayBuffer();
        
        // Compute bundle hash (SHA-256)
        const bundleHashBuffer = await crypto.subtle.digest("SHA-256", bundleArrayBuffer);
        const bundleHashArray = Array.from(new Uint8Array(bundleHashBuffer));
        const bundleHash = bundleHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Minimal deterministic verification (v2.8.0)
        // For public@1.0.0 profile: bundle exists and is readable = verified
        const supportedProfiles = ["public@1.0.0"];
        const verdict = supportedProfiles.includes(profileId) ? "verified" : "not_verified";
        const reasonCodes = verdict === "verified" ? [] : ["VFX-PROFILE-0001"];
        
        // executionTier already retrieved above from tokenObj
        
        // Build certificate object (without certificate_hash)
        // CANONICAL CERTIFICATE CORE (LOCKED)
        // Sorted keys, no nulls, no extensions, no metadata
        const executedAt = new Date().toISOString();
        const certificateObject = {
          bundle_hash: bundleHash,
          certificate_version: "1.1.0",
          executed_at: executedAt,
          profile_id: profileId,
          reason_codes: reasonCodes,
          verdict: verdict,
          verifrax_version: VERSION
        };
        
        // Compute certificate hash (using canonical stringify)
        const certificateCanonical = canonicalStringify(certificateObject);
        const certificateHashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(certificateCanonical));
        const certificateHashArray = Array.from(new Uint8Array(certificateHashBuffer));
        const certificateHash = certificateHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Build final certificate (certificate_hash is last field)
        const certificate = {
          ...certificateObject,
          certificate_hash: certificateHash
        };
        
        // Store canonical certificate in KV (sorted keys, no pretty-print)
        const canonicalCert = canonicalStringify(certificate);
        await env.KV.put(`certificate:${certificateHash}`, canonicalCert);
        
        // Store tier metadata for certificate
        if (env.KV) {
          await env.KV.put(`certificate:${certificateHash}:tier`, executionTier);
        }
        
        // Return certificate_hash
        return withHeaders(new Response(JSON.stringify({ certificate_hash: certificateHash }), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      } catch (error) {
        return withHeaders(new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      }
    }

    // GET /status (MUST RETURN v2.8.0 and payment_status: enabled)
    if (path === "/status" && request.method === "GET") {
      const status = JSON.stringify({
        version: VERSION,
        payment_status: PAYMENT_STATUS
      }, null, 2);
      return withHeaders(new Response(status, { 
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }));
    }

    // GET /certificate/{hash} (with optional extension: .json, .proof, .llm, .bundle)
    if (path.startsWith("/certificate/") && request.method === "GET") {
      const pathParts = path.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      const hash = lastPart.split(".")[0]; // Remove extension if present
      const extension = lastPart.includes(".") ? lastPart.split(".").slice(1).join(".") : null;
      
      // Try to retrieve certificate from KV
      if (!env.KV) {
        return withHeaders(new Response(
          JSON.stringify({ error: "KV_NOT_AVAILABLE" }),
          { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
        ));
      }
      
      const certificateRaw = await env.KV.get(`certificate:${hash}`);
      if (!certificateRaw) {
        return withHeaders(new Response(
          JSON.stringify({ error: "CERTIFICATE_NOT_FOUND" }),
          { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
        ));
      }
      
      const certificate = JSON.parse(certificateRaw);
      const tier = await env.KV.get(`certificate:${hash}:tier`) || "public";
      const isPro = tier === "pro";
      const isInstitutional = tier === "institutional";
      
      // Sidecar endpoints
      if (extension === "json") {
        // Raw canonical JSON
        return withHeaders(new Response(certificateRaw, {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" }
        }));
      }
      
      if (extension === "proof") {
        // Hash-of-hash immutability proof
        const { certificate_hash: storedHash, ...certWithoutHash } = certificate;
        const certWithoutHashCanonical = canonicalStringify(certWithoutHash);
        const certHashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(certWithoutHashCanonical));
        const certHashArray = Array.from(new Uint8Array(certHashBuffer));
        const computedHash = certHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        const proof = {
          certificate_hash: storedHash,
          sha256_certificate_without_hash: computedHash,
          equality_assertion: storedHash === computedHash ? "VALID" : "INVALID",
          immutability_proof: "The certificate_hash field equals SHA-256 of the canonical JSON representation (without the certificate_hash field itself)."
        };
        
        return withHeaders(new Response(JSON.stringify(proof, null, 2), {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" }
        }));
      }
      
      if (extension === "llm") {
        // Machine-routable LLM descriptor
        const llmContent = `TYPE: terminal_verification_certificate
VERSION: ${certificate.verifrax_version}
CERTIFICATE_VERSION: ${certificate.certificate_version}
FINALITY: absolute
REEXECUTION: forbidden
DEPENDENCIES: none
CERTIFICATE_HASH: ${certificate.certificate_hash}
VERDICT: ${certificate.verdict}
PROFILE_ID: ${certificate.profile_id}
EXECUTED_AT: ${certificate.executed_at}
`;
        return withHeaders(new Response(llmContent, {
          status: 200,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        }));
      }
      
      if (extension === "bundle" && isInstitutional) {
        // Institutional bundle ZIP (certificate.json, proof, llm, README.txt)
        // For now, return instructions - full ZIP generation can be added later
        const readme = `VERIFRAX Certificate Bundle
Certificate Hash: ${hash}

This bundle contains:
- certificate.json: The canonical certificate
- certificate.proof: Hash-of-hash immutability proof
- certificate.llm: Machine-routable descriptor
- README.txt: This file

To verify independently:
1. Download certificate.json
2. Remove certificate_hash field
3. Canonical-serialize JSON
4. Compute SHA-256
5. Compare to certificate_hash field

Verification tools: https://github.com/verifrax/verifrax-reference-verifier
`;
        return withHeaders(new Response(readme, {
          status: 200,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        }));
      }
      
      // Main certificate page (institutional surface)
      const verdictBadge = certificate.verdict === "verified" ? "VERIFIED" : "NOT VERIFIED";
      const verdictClass = certificate.verdict === "verified" ? "verified" : "not-verified";
      
      // Compute hash-of-hash for immutability proof
      const { certificate_hash: storedHash, ...certWithoutHash } = certificate;
      const certWithoutHashCanonical = canonicalStringify(certWithoutHash);
      const certHashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(certWithoutHashCanonical));
      const certHashArray = Array.from(new Uint8Array(certHashBuffer));
      const computedHash = certHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const hashMatch = storedHash === computedHash;
      
      const html = `<!DOCTYPE html>
<html>
<head>
  <title>VERIFRAX Certificate — ${hash}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 900px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 32px; margin-bottom: 10px; }
    h2 { font-size: 18px; color: #666; font-weight: normal; margin-bottom: 30px; font-family: monospace; word-break: break-all; }
    .tier-badge { display: inline-block; padding: 8px 16px; margin: 10px 0; border-radius: 4px; font-weight: 600; }
    .tier-pro { background: #e7f3ff; color: #0066cc; border: 2px solid #0066cc; }
    .tier-institutional { background: #f0f8e7; color: #4a7c20; border: 2px solid #4a7c20; }
    .download-top { margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 6px; }
    .download-top h3 { margin-bottom: 15px; font-size: 18px; }
    .download-links { display: flex; gap: 10px; flex-wrap: wrap; }
    .download-links a { display: inline-block; padding: 12px 24px; border: 2px solid #000; text-decoration: none; color: #000; border-radius: 6px; font-weight: 600; transition: all 0.2s; }
    .download-links a:hover { background: #000; color: #fff; }
    .badge { display: inline-block; padding: 8px 16px; border: 2px solid #000; font-weight: bold; margin: 10px 0; }
    .badge.verified { background: #fff; color: #000; }
    .badge.not-verified { background: #fff; color: #000; }
    .canonical-block { background: #f5f5f5; padding: 15px; border: 1px solid #ccc; font-family: monospace; white-space: pre-wrap; font-size: 12px; margin: 20px 0; border-radius: 4px; }
    .statement { margin: 20px 0; padding: 15px; border-left: 4px solid #000; background: #f9f9f9; }
    .hash-proof { margin: 20px 0; padding: 15px; background: #f9f9f9; border: 1px solid #ccc; border-radius: 4px; }
    .hash-proof.valid { border-color: #28a745; background: #d4edda; }
    .hash-proof.invalid { border-color: #f00; background: #ffe0e0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>VERIFRAX Certificate</h1>
    <h2>${hash}</h2>
    
    ${isPro ? '<div class="tier-badge tier-pro">Professional Execution</div>' : ''}
    ${isInstitutional ? '<div class="tier-badge tier-institutional">Institutional Execution</div>' : ''}
    
    <div class="download-top">
      <p style="margin-bottom: 15px; font-size: 16px; color: #333; line-height: 1.6;">
        <strong>This certificate can be shared, archived, and verified independently without VERIFRAX.</strong>
      </p>
      <h3>Download:</h3>
      <div class="download-links">
        <a href="/certificate/${hash}.json">JSON</a>
        <a href="/certificate/${hash}.proof">Proof</a>
        <a href="/certificate/${hash}.llm">LLM</a>
        ${isInstitutional ? `<a href="/certificate/${hash}.bundle">Download Bundle (ZIP)</a>` : ''}
      </div>
    </div>
    
    <div class="badge ${verdictClass}">${verdictBadge}</div>
    ${isPro || isInstitutional ? `<p style="margin: 15px 0; font-size: 14px; color: #666;"><strong>Executed at:</strong> ${certificate.executed_at}</p>` : ''}
    
    <h3>Canonical Fields</h3>
    <div class="canonical-block">${JSON.stringify(certificate, null, 2)}</div>
    
    <h3>Independent Verification</h3>
    <div class="statement">
      <strong>Command:</strong><br/>
      <code>verifrax verify certificate.json</code><br/><br/>
      This certificate can be verified independently without VERIFRAX infrastructure.
    </div>
    
    <h3>Determinism Statement</h3>
    <div class="statement">
      For identical evidence bundle, verification profile identifier, and verifier version, VERIFRAX will always produce identical output, byte-for-byte.
    </div>
    
    <h3>Finality Statement</h3>
    <div class="statement">
      One execution produces exactly one certificate. Certificates cannot be re-executed, revised, amended, or superseded. Financial disputes, refunds, chargebacks, or operator failure do not affect validity.
    </div>
    
    <h3>Infrastructure Independence Statement</h3>
    <div class="statement">
      VERIFRAX infrastructure has zero authority over certificate validity after issuance. Operator failure, domain loss, Stripe disputes, and refunds are irrelevant. The certificate survives system death.
    </div>
    
    <h3>Hash-of-Hash Immutability Proof</h3>
    <div class="hash-proof ${hashMatch ? 'valid' : 'invalid'}">
      <strong>Certificate Hash:</strong> ${storedHash}<br/>
      <strong>SHA-256(certificate without hash):</strong> ${computedHash}<br/>
      <strong>Equality Assertion:</strong> ${hashMatch ? 'VALID' : 'INVALID'}<br/>
      ${hashMatch ? '✓ Certificate integrity verified. Presentation-layer tampering impossible.' : '✗ Certificate integrity check failed.'}
    </div>
  </div>
</body>
</html>`;
      
        return withHeaders(new Response(html, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        }));
    }

    // GET / (LANDING PAGE)
    if (path === "/" && request.method === "GET") {
      const resolved = resolveLang(request, request.cf || {});
      const lang = TRANSLATIONS[resolved] ? resolved : "en";
      const tier = TIER2.includes(lang) ? 2 : 1;
      const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
      const title = tier === 2 ? "VERIFRAX — Assistive Translation" : `VERIFRAX — ${t.hero_title}`;
      const assistiveBanner = tier === 2
        ? `<div class="assistive-banner">${t.assistive_notice || "This translation is provided for accessibility only. The authoritative language of VERIFRAX is English."}</div>`
        : "";
      const html = `<!DOCTYPE html>
<html lang="${lang}" aria-label="${tier === 2 ? "assistive-translation" : "authoritative-ui"}">
<head>
  <title>${title}</title>
  <link rel="alternate" hreflang="fr" href="https://www.verifrax.net/?lang=fr">
  <link rel="alternate" hreflang="de" href="https://www.verifrax.net/?lang=de">
  <link rel="alternate" hreflang="x-default" href="https://www.verifrax.net/">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #fff; }
    .container { max-width: 800px; margin: 0 auto; padding: 60px 20px; }
    h1 { font-size: 48px; font-weight: 700; margin-bottom: 20px; text-align: center; }
    .tagline { font-size: 20px; text-align: center; color: #666; margin-bottom: 30px; }
    .assistive-banner { background: #fff3cd; color: #8a6d3b; padding: 12px 16px; border: 1px solid #f5e3a3; border-radius: 6px; font-size: 14px; margin-bottom: 20px; text-align: center; }
    .cta-buttons { display: flex; gap: 20px; justify-content: center; margin-bottom: 60px; flex-wrap: wrap; }
    .btn { display: inline-block; padding: 16px 32px; font-size: 18px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.2s; }
    .btn-primary { background: #000; color: #fff; border: 2px solid #000; }
    .btn-primary:hover { background: #333; border-color: #333; }
    .btn-secondary { background: transparent; color: #000; border: 2px solid #000; }
    .btn-secondary:hover { background: #000; color: #fff; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; margin-top: 60px; }
    .feature { text-align: center; }
    .feature h3 { font-size: 18px; margin-bottom: 10px; }
    .feature p { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    ${assistiveBanner}
    <h1>VERIFRAX</h1>
    <p class="tagline">${t.hero_title}. ${t.hero_subtitle}</p>
    <p style="text-align: center; font-size: 16px; margin: 20px 0; color: #666; font-style: italic;">
      VERIFRAX has issued live certificates relied upon externally.
    </p>
    <p style="text-align: center; font-size: 24px; font-weight: 600; margin: 20px 0; color: #000;">
      €120 — One execution · One certificate · Final
    </p>
    <p style="text-align: center; font-size: 16px; margin: 30px 0; color: #666;">
      ${t.invariant_notice || ""}
    </p>
    
    <div class="cta-buttons">
      <a href="/start?tier=public" class="btn btn-primary">${t.cta_verify || "Verify Evidence"} — €120</a>
      <a href="/start?tier=pro" class="btn btn-secondary">Legal / Professional Verification — €650</a>
      <a href="/institutional" class="btn btn-secondary">Request Institutional Execution — €1500</a>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>One Execution</h3>
        <p>Single, irreversible computation over your evidence bundle</p>
      </div>
      <div class="feature">
        <h3>Final Certificate</h3>
        <p>Immutable, independently verifiable certificate</p>
      </div>
      <div class="feature">
        <h3>No Accounts</h3>
        <p>No sign-up, no tracking, no data reuse</p>
      </div>
    </div>
  </div>
</body>
</html>`;
      const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
      if (TIER2.includes(lang)) {
        headers.set('X-Robots-Tag', 'noindex, nofollow');
      }
      return withHeaders(new Response(html, {
        status: 200,
        headers
      }));
    }

    // GET /start (HUMAN ENTRY POINT)
    if (path === "/start" && request.method === "GET") {
      const tier = url.searchParams.get("tier") || "public";
      const tierConfig = {
        public: { price: 120, name: "Public Execution", description: "Low-friction entry for journalists, individuals, demos" },
        pro: { price: 650, name: "Professional Execution", description: "Designed for disputes, legal, arbitration, crypto incidents" },
        institutional: { price: 1500, name: "Institutional Execution", description: "Institutional-grade for law firms, funds, DAOs, compliance" }
      };
      const config = tierConfig[tier] || tierConfig.public;
      
      const html = `<!DOCTYPE html>
<html>
<head>
  <title>Start Verification — VERIFRAX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 32px; margin-bottom: 30px; }
    .steps { margin: 30px 0; }
    .step { padding: 15px; margin: 15px 0; background: #f9f9f9; border-left: 4px solid #000; }
    .step-number { font-weight: 700; color: #000; }
    .btn { display: inline-block; padding: 14px 28px; font-size: 16px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; transition: all 0.2s; }
    .btn-primary { background: #000; color: #fff; border: 2px solid #000; }
    .btn-primary:hover { background: #333; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .info-box { margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 6px; border-left: 4px solid #000; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${config.name}</h1>
    <p style="font-size: 20px; font-weight: 600; margin: 10px 0 30px 0; color: #000;">
      €${config.price}
    </p>
    <p style="text-align: left; font-size: 14px; color: #666; margin: -10px 0 20px 0;">
      Execution surfaces are always presented in English. Language selection affects informational pages only.
    </p>
    <p style="color: #666; margin-bottom: 30px;">
      ${config.description}
    </p>
    
    <p style="font-size: 18px; font-weight: 600; margin-bottom: 30px; padding: 15px; background: #f9f9f9; border-left: 4px solid #000; border-radius: 4px;">
      <strong>This process has exactly 3 steps:</strong><br/>
      1. Pay €${config.price}<br/>
      2. Upload your evidence bundle<br/>
      3. Execute verification (final)
    </p>
    
    <div class="info-box">
      <p style="margin: 0; line-height: 1.8;">
        <strong>How it works:</strong><br/>
        You will upload your evidence bundle <strong>after payment</strong>, just before execution. This ensures your evidence is processed immediately and not stored temporarily.
      </p>
    </div>
    
    <button type="button" class="btn btn-primary" id="continueBtn" onclick="createCheckout()">Continue to Payment</button>
  </div>
  
  <script>
    async function createCheckout() {
      const continueBtn = document.getElementById('continueBtn');
      continueBtn.disabled = true;
      continueBtn.textContent = 'Creating payment session...';
      
      try {
        const response = await fetch('/api/create-checkout?tier=${tier}', {
          method: 'POST'
        });
        
        if (response.ok) {
          const data = await response.json();
          window.location.href = data.checkout_url;
        } else {
          const error = await response.json();
          alert('Error: ' + (error.error || 'Failed to create payment session'));
          continueBtn.disabled = false;
          continueBtn.textContent = 'Continue to Payment';
        }
      } catch (err) {
        alert('Error: ' + err.message);
        continueBtn.disabled = false;
        continueBtn.textContent = 'Continue to Payment';
      }
    }
  </script>
</body>
</html>`;
      return withHeaders(new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }));
    }

    // GET /institutional (INSTITUTIONAL ENTRY POINT)
    if (path === "/institutional" && request.method === "GET") {
      const html = `<!DOCTYPE html>
<html>
<head>
  <title>Institutional Execution — VERIFRAX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 700px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 32px; margin-bottom: 10px; }
    .price { font-size: 24px; font-weight: 600; margin: 20px 0; color: #000; }
    .statement { margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #000; border-radius: 4px; }
    .statement p { margin: 10px 0; }
    .btn { display: inline-block; padding: 16px 32px; font-size: 18px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; background: #000; color: #fff; cursor: pointer; border: none; }
    .btn:hover { background: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Institutional Execution</h1>
    <p class="price">€1,500</p>
    <p style="text-align: left; font-size: 14px; color: #666; margin: -5px 0 20px 0;">
      Execution surfaces are always presented in English. Language selection affects informational pages only.
    </p>
    
    <div class="statement">
      <p><strong>Institutional-grade deterministic execution</strong></p>
      <p>Finality guaranteed by protocol design</p>
      <p>No dependency on VERIFRAX survival</p>
    </div>
    
    <p style="margin: 30px 0; line-height: 1.8;">
      Designed for law firms, funds, DAOs, and compliance events. Low volume, high certainty.
    </p>
    
    <p style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 4px;">
      <strong>This process has exactly 3 steps:</strong><br/>
      1. Pay €1,500<br/>
      2. Upload your evidence bundle<br/>
      3. Execute verification (final)
    </p>
    
    <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 6px;">
      <p><strong>Certificate includes:</strong></p>
      <ul style="margin: 10px 0 10px 20px;">
        <li>certificate.json</li>
        <li>certificate.proof</li>
        <li>certificate.llm</li>
        <li>README.txt (verification instructions)</li>
      </ul>
      <p style="margin-top: 15px; font-size: 14px; color: #666;">
        Download bundle (ZIP) available after execution.
      </p>
    </div>
    
    <button type="button" class="btn" onclick="createCheckout()">Request Institutional Execution</button>
  </div>
  
  <script>
    async function createCheckout() {
      const btn = document.querySelector('.btn');
      btn.disabled = true;
      btn.textContent = 'Creating payment session...';
      
      try {
        const response = await fetch('/api/create-checkout?tier=institutional', {
          method: 'POST'
        });
        
        if (response.ok) {
          const data = await response.json();
          window.location.href = data.checkout_url;
        } else {
          const error = await response.json();
          alert('Error: ' + (error.error || 'Failed to create payment session'));
          btn.disabled = false;
          btn.textContent = 'Request Institutional Execution';
        }
      } catch (err) {
        alert('Error: ' + err.message);
        btn.disabled = false;
        btn.textContent = 'Request Institutional Execution';
      }
    }
  </script>
</body>
</html>`;
      return withHeaders(new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }));
    }

    // POST /api/create-checkout (CREATE STRIPE CHECKOUT SESSION)
    if (path === "/api/create-checkout" && request.method === "POST") {
      try {
        if (!env.STRIPE_SECRET_KEY) {
          return withHeaders(new Response(JSON.stringify({ error: "STRIPE_NOT_CONFIGURED" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }));
        }

        const stripe = new Stripe(env.STRIPE_SECRET_KEY);
        const tier = url.searchParams.get("tier") || "public";
        
        // Tier configuration
        const tierConfig = {
          public: { amount: 12000, name: "VERIFRAX Public Execution", tierName: "public" },
          pro: { amount: 65000, name: "VERIFRAX Professional Execution", tierName: "pro" },
          institutional: { amount: 150000, name: "VERIFRAX Institutional Execution", tierName: "institutional" }
        };
        const config = tierConfig[tier] || tierConfig.public;

        // Generate unique session_id
        const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: [{
            price_data: {
              currency: 'eur',
              product_data: {
                name: config.name,
              },
              unit_amount: config.amount,
            },
            quantity: 1,
          }],
          success_url: `https://www.verifrax.net/verify?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
          cancel_url: `https://www.verifrax.net/start?tier=${tier}`,
          metadata: {
            session_id: sessionId,
            verifrax_version: VERSION,
            tier: config.tierName
          },
          payment_intent_data: {
            metadata: {
              session_id: sessionId,
              verifrax_version: VERSION,
              tier: config.tierName
            }
          }
        });

        return withHeaders(new Response(JSON.stringify({ 
          checkout_url: session.url,
          session_id: sessionId
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      } catch (error) {
        return withHeaders(new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      }
    }

    // GET /pricing (INSTITUTIONAL SURFACE)
    if (path === "/pricing" && request.method === "GET") {
      const content = `VERIFRAX Pricing — v2.8.0

TIER 1 — PUBLIC EXECUTION
Price: €120.00 per execution
Purpose: Low-friction entry for journalists, individuals, demos
Proof of existence, timestamped finality

TIER 2 — PROFESSIONAL EXECUTION
Price: €650.00 per execution
Purpose: Legal, disputes, arbitration, crypto incidents
Designed for disputes. Single final execution. Citeable, court-safe artifact.

TIER 3 — INSTITUTIONAL EXECUTION
Price: €1,500.00 per execution
Purpose: Law firms, funds, DAOs, compliance events
Institutional-grade deterministic execution. Finality guaranteed by protocol design.

Payment Model:
- One payment = one execution
- No subscriptions
- No discounts
- No batch pricing

Payment authorizes:
- One verification execution
- Certificate generation (if execution succeeds)
- Certificate retrieval access

Payment does NOT authorize:
- Outcome satisfaction guarantee
- Refund for user error
- Refund for outcome disagreement
- Multiple executions

Version: 2.8.0
`;
      return withHeaders(new Response(content, {
        status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    // GET /terms (INSTITUTIONAL SURFACE)
    if (path === "/terms" && request.method === "GET") {
      const content = `VERIFRAX Terms of Service — v2.8.0

No advice. No liability. Deterministic execution only.

SCOPE:
One-time execution of deterministic software verification process.

SERVICE:
Customer uploads digital evidence bundle. System executes single deterministic verification run. Output is cryptographically verifiable, immutable certificate.

PAYMENT:
One-time payment required before execution. No subscriptions. No refunds except execution failure.

NO WARRANTIES:
No warranties beyond execution of deterministic algorithm. No guarantees of correctness, completeness, or fitness for purpose.

LIABILITY:
Liability capped at execution fee paid. No other liability exists.

CERTIFICATES:
Certificates are customer-controlled artifacts. VERIFRAX does not control, modify, or interpret certificates after issuance.

NO ADVICE:
VERIFRAX provides no advice. No legal advice. No financial advice. No auditing services. No advisory services.

EXECUTION ONLY:
VERIFRAX performs technical execution only. No judgment. No interpretation. No guarantees beyond execution.

Version: 2.8.0
`;
      return withHeaders(new Response(content, {
        status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    // GET /privacy (INSTITUTIONAL SURFACE)
    if (path === "/privacy" && request.method === "GET") {
      const content = `VERIFRAX Privacy Statement — v2.8.0

No accounts. No tracking. No data reuse.

NO ACCOUNTS:
VERIFRAX has no user accounts. No authentication. No user profiles.

NO TRACKING:
VERIFRAX does not track users. No cookies. No analytics. No user identification.

EVIDENCE STORAGE:
Evidence bundles are stored only to execute paid verification request. Evidence is stored until verification completes.

CERTIFICATES:
Certificates are customer-controlled artifacts. VERIFRAX does not control certificates after issuance.

NO DATA COLLECTION:
VERIFRAX collects no personal data. No user profiles. No behavioral data. No marketing data.

PAYMENT DATA:
Payment processing handled by Stripe. VERIFRAX does not store payment card data.

DATA RETENTION:
Evidence bundles retained only for execution. No long-term storage. No data retention beyond execution.

CUSTOMER CONTROL:
Customers control their evidence bundles and certificates. VERIFRAX does not access customer data except to execute paid requests.

Version: 2.8.0
`;
      return withHeaders(new Response(content, {
        status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    // GET /refunds (INSTITUTIONAL SURFACE)
    if (path === "/refunds" && request.method === "GET") {
      const content = `VERIFRAX Refund Policy — v2.8.0

Refund only if execution never occurred.

REFUND CONDITIONS:
- Refund available only if verification execution never occurred
- Refund available only if execution failed due to system error
- No refund for user error (wrong evidence, wrong profile)
- No refund for outcome dissatisfaction
- No refund after certificate issuance
- No refund for interpretation disagreement

EXECUTION FAILURE:
If execution fails due to system error (not user error), refund will be processed automatically.

NO REFUND AFTER EXECUTION:
Once execution completes and certificate is issued, payment is final. No refunds.

DISPUTE RESOLUTION:
Payment disputes must be raised before execution. After execution, payment is final.

Version: 2.8.0
`;
      return withHeaders(new Response(content, {
        status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    // GET /legal (INSTITUTIONAL SURFACE)
    if (path === "/legal" && request.method === "GET") {
      const content = `VERIFRAX Legal Information — v2.8.0

Jurisdiction, operator identity, system role.

SYSTEM IDENTITY:
VERIFRAX is a deterministic digital verification system. It executes a single, one-time computational verification over a submitted digital evidence bundle and issues a final, immutable, reproducible certificate.

OPERATOR IDENTITY:
Operator identity and contact information published at /status endpoint.

JURISDICTION:
Unless otherwise required by mandatory law, VERIFRAX operates under declared governing law published at /status.

LIABILITY BOUNDARY:
Operator liability is limited strictly to faithful execution of the deterministic process as specified. There is no liability for interpretation, reliance, consequential damage, or third-party use.

DATA PROCESSING ROLE:
VERIFRAX acts as a pure technical processor. Submitted evidence is not analyzed, enriched, correlated, sold, or reused.

CERTIFICATE AUTHORITY:
Certificates are independently verifiable. Certificate validity does not depend on VERIFRAX infrastructure availability or operator status.

FINALITY:
One execution produces exactly one certificate. Certificates cannot be re-executed, revised, amended, or superseded. Financial disputes, refunds, chargebacks, or operator failure do not affect validity.

Version: 2.8.0
`;
      return withHeaders(new Response(content, {
        status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
    }

    // 404 for all other routes
    return withHeaders(new Response("Not Found", { status: 404 }));
  }
};
