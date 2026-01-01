/**
 * VERIFRAX Production Worker — v2.5.0 Freeze
 * 
 * HARD KILL /pay — FINAL
 * This worker returns 410 (Gone) for /pay endpoint.
 * 
 * DEPLOYMENT:
 * 1. Copy this code to Cloudflare Dashboard → Workers & Pages → verifrax-edge-production
 * 2. OR: If using Wrangler: wrangler deploy --env production
 * 3. Verify: curl -i https://www.verifrax.net/pay (must return 410)
 */

const VERSION = "2.5.0";

function withHeaders(resp) {
  const h = new Headers(resp.headers);
  h.set("X-Verifrax-Version", VERSION);
  h.set("X-Payment-Status", "disabled");
  return new Response(resp.body, { status: resp.status, headers: h });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = request.headers.get("host") || url.hostname;

    // Enforce canonical host
    const canonicalHost = "www.verifrax.net";
    if (host !== canonicalHost) {
      url.hostname = canonicalHost;
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    // Optional: enforce https even behind CF (usually already https)
    if (url.protocol !== "https:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    const path = url.pathname;

    // HARD KILL /pay — FINAL
    if (path === "/pay" || path === "/pay/") {
      return new Response("DISABLED", { 
        status: 410,
        headers: {
          'Content-Type': 'text/plain',
          'X-Verifrax-Version': VERSION,
          'X-Payment-Status': 'disabled'
        }
      });
    }

    // HARD KILL /api/create-payment-intent — FINAL
    if (path === "/api/create-payment-intent") {
      return new Response("DISABLED", { 
        status: 410,
        headers: {
          'Content-Type': 'text/plain',
          'X-Verifrax-Version': VERSION,
          'X-Payment-Status': 'disabled'
        }
      });
    }

    // GET /
    if (path === "/" && request.method === "GET") {
      return withHeaders(new Response(
        "VERIFRAX v2.5.0\n\n" +
        "WHAT VERIFRAX IS:\n" +
        "VERIFRAX is a deterministic digital verification system. It executes a single, one-time computational verification over a submitted digital evidence bundle and issues a final, immutable, reproducible certificate.\n\n" +
        "WHAT VERIFRAX DOES:\n" +
        "- Accepts digital evidence bundles\n" +
        "- Executes deterministic verification (pure function, no side effects)\n" +
        "- Produces certificates (self-contained, independently verifiable)\n" +
        "- Delivers final verdicts (verified or not_verified)\n\n" +
        "WHAT VERIFRAX DOES NOT DO:\n" +
        "- Provide advice, opinions, or conclusions\n" +
        "- Store mutable state or require accounts\n" +
        "- Depend on infrastructure availability\n" +
        "- Produce non-deterministic outcomes\n" +
        "- Accept subjective inputs, voting, moderation, or overrides\n" +
        "- Depend on external state, network connectivity, or real-time data\n\n" +
        "Public surfaces:\n" +
        "- GET /spec — frozen specification\n" +
        "- GET /status — system status\n" +
        "- GET /reference-verifier — offline verification tools\n\n" +
        "Payment disabled in v2.5.0.\n",
        { 
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        }
      ));
    }

    // GET /spec
    if (path === "/spec" && request.method === "GET") {
      const spec = `VERIFRAX v2.5.0 — UNIVERSAL PUBLIC SURFACE SPECIFICATION

Status: FROZEN
Version: 2.5.0

SYSTEM IDENTITY:
VERIFRAX is a deterministic digital verification system.
It executes a single, one-time computational verification over a submitted digital evidence bundle and issues a final, immutable, reproducible certificate.

CORE PROMISE (DETERMINISM):
For identical evidence bundle, verification profile identifier, and verifier version,
VERIFRAX will always produce identical output, byte-for-byte.

PUBLIC SURFACES:
- GET / — authoritative statement surface
- GET /spec — this frozen specification
- GET /glossary — fixed terminology
- GET /status — survivability, version, and governance state
- GET /reference-verifier — offline verification tools
- GET /certificate/{hash} — certificate retrieval

FINALITY MODEL:
- One execution produces exactly one certificate
- Certificates cannot be re-executed, revised, amended, or superseded
- Financial disputes, refunds, chargebacks, or operator failure do not affect validity

Full specification: freeze/v2.5.0/UNIVERSAL_PUBLIC_SURFACE_SPEC_v2.5.0.md
`;
      return withHeaders(new Response(spec, { 
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      }));
    }

    // GET /glossary
    if (path === "/glossary" && request.method === "GET") {
      const glossary = `VERIFRAX Glossary

verification:
A deterministic computational process that evaluates an evidence bundle against a verification profile and produces a certificate.

certificate:
The final, immutable output of a verification execution. Contains bundle hash, profile identifier, verifier version, execution timestamp, and result.

evidence bundle:
A fixed collection of files and metadata submitted together for verification. Must be hashed before upload.

profile:
A verification profile identifier (e.g., "public@1.0.0"). Defines the deterministic rules used to evaluate evidence.

execution:
A single, one-time computational verification run. One execution produces exactly one certificate.

deterministic:
Producing the same output given the same input, without randomness, interpretation logic, or external data dependency.

finality:
A state where further dispute is rendered unnecessary. Certificates are final, immutable, and irreversible.

bundle hash:
SHA-256 hash of the evidence bundle, computed before upload and verified after upload completion.
`;
      return withHeaders(new Response(glossary, { 
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      }));
    }

    // GET /status
    if (path === "/status" && request.method === "GET") {
      const status = JSON.stringify({
        version: VERSION,
        status: "operational",
        governance_state: "frozen",
        payment_status: "disabled",
        frozen_spec: "freeze/v2.5.0/UNIVERSAL_PUBLIC_SURFACE_SPEC_v2.5.0.md",
        infrastructure_authority: "none",
        infrastructure_note: "VERIFRAX infrastructure has no authority over certificate validity. Certificates are independently verifiable and remain valid regardless of infrastructure availability or operator status."
      }, null, 2);
      return withHeaders(new Response(status, { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }

    // GET /reference-verifier
    if (path === "/reference-verifier" && request.method === "GET") {
      return withHeaders(new Response(
        "VERIFRAX Reference Verifier\n\n" +
        "GitHub: https://github.com/verifrax/verifrax-reference-verifier\n" +
        "Version: 2.5.0\n\n" +
        "INDEPENDENT VERIFICATION:\n" +
        "The reference verifier enables offline, independent certificate verification. Verification does not require VERIFRAX infrastructure, network access, or operator availability. Certificates can be verified using only the reference verifier and the certificate itself.\n\n" +
        "CRYPTOGRAPHIC HASHES:\n" +
        "All reference verifier files are cryptographically hashed. Hashes are published in:\n" +
        "freeze/v2.5.0/REFERENCE_VERIFIER_HASHES.txt\n\n" +
        "Key file hashes (SHA-256):\n" +
        "cli.js: dac0993a38d26b8383b7262ddb67126641e128eb824224ec2564e23845e6924b\n" +
        "verify_v2_5_0.js: 392192a1e55580dfaf50b6e0377b47d0e776e9263752ef2b5b6876de9d9d628d\n" +
        "package.json: 26fa4e72c43d3ead93aaa2af1c721032130db18f61f6650c8194de24a090c053\n\n" +
        "Full hash list: freeze/v2.5.0/REFERENCE_VERIFIER_HASHES.txt\n",
        { 
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        }
      ));
    }

    // GET /certificate/{hash}
    if (path.startsWith("/certificate/") && request.method === "GET") {
      const hash = path.split("/").pop();
      return withHeaders(new Response(
        `VERIFRAX CERTIFICATE\nHash: ${hash}\nRetrieval surface only.\n`,
        { status: 200, headers: { "Content-Type": "text/plain" } }
      ));
    }

    // 404 for all other routes
    return withHeaders(new Response("Not Found", { status: 404 }));
  }
};

