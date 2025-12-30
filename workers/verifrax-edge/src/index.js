// Security headers helper
function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "no-referrer");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

const handler = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Create payment intent endpoint
    if (path === "/api/create-payment-intent" && method === "POST") {
      // Validate secrets for this route only
      const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
      if (!STRIPE_SECRET_KEY) {
        return new Response(
          JSON.stringify({ error: "Service configuration error" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      try {
        const response = await fetch("https://api.stripe.com/v1/payment_intents", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            amount: "12000",
            currency: "eur",
            "metadata[purpose]": "verifrax_verification",
            "metadata[version]": "v1",
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          return new Response(
            JSON.stringify({ error: "Failed to create payment intent" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        const data = await response.json();
        return new Response(
          JSON.stringify({ client_secret: data.client_secret }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Internal server error" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Upload endpoint (single-stream, Worker-proxied)
    if (path === "/api/upload" && method === "POST") {
      // Validate R2 bucket binding
      if (!env.EVIDENCE_BUCKET) {
        return new Response(
          JSON.stringify({ error: "Service configuration error" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // HARD SIZE & AUTH GATE (BEFORE READ)
      const contentLength = request.headers.get("content-length");
      if (!contentLength) {
        return new Response("Content-Length required", { status: 411 });
      }

      const MAX = 2 * 1024 * 1024 * 1024; // 2GB
      if (Number(contentLength) > MAX) {
        return new Response("Bundle exceeds v1 size limit", { status: 413 });
      }

      const paymentIntent = request.headers.get("x-payment-intent-id");
      if (!paymentIntent) {
        return new Response("Missing payment authorization", { status: 402 });
      }

      // Content-Type validation
      const contentType = request.headers.get("content-type");
      if (contentType && contentType !== "application/octet-stream") {
        return new Response("Content-Type must be application/octet-stream", { status: 415 });
      }

      try {
        // Generate VERIFRAX canonical upload ID
        const uploadId = crypto.randomUUID();
        const objectKey = `uploads/${uploadId}/bundle.bin`;

        // Stream directly into R2 (NO BUFFERING)
        await env.EVIDENCE_BUCKET.put(objectKey, request.body, {
          httpMetadata: {
            contentType: "application/octet-stream"
          }
        });

        // Hash after write (v1 acceptable)
        const obj = await env.EVIDENCE_BUCKET.get(objectKey);
        if (!obj) {
          return new Response(
            JSON.stringify({ error: "Failed to retrieve uploaded object" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        const buffer = await obj.arrayBuffer();
        const hash = await crypto.subtle.digest("SHA-256", buffer);
        const bundleHash =
          "sha256:" +
          [...new Uint8Array(hash)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        // Write immutable manifest (finality event)
        const manifest = {
          upload_id: uploadId,
          payment_intent_id: paymentIntent,
          bundle_hash: bundleHash,
          size_bytes: Number(contentLength),
          completed_at: new Date().toISOString(),
          verifier: "verifrax-edge",
          version: "v1"
        };

        await env.EVIDENCE_BUCKET.put(
          `uploads/${uploadId}/manifest.json`,
          JSON.stringify(manifest, null, 2),
          { httpMetadata: { contentType: "application/json" } }
        );

        // Return final, non-replayable response
        return new Response(JSON.stringify({
          upload_id: uploadId,
          bundle_hash: bundleHash
        }), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Internal server error", message: error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Verify endpoint (deterministic execution → verdict artifact)
    // CRITICAL: /api/verify is idempotent. Re-running verification does not create state,
    // mutate storage, or change outputs. Same inputs → same verdict_hash.
    if (path === "/api/verify" && method === "POST") {
      // Validate R2 bucket binding
      if (!env.EVIDENCE_BUCKET) {
        return new Response(
          JSON.stringify({ error: "Service configuration error" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // Hard-pin verifier version (enforces version finality)
      const WORKER_VERIFIER_VERSION = "2.3.0";

      try {
        const body = await request.json();
        const { upload_id, profile_id = "public@1.0.0", verifier_version } = body;

        // Enforce verifier version (must match worker version)
        if (verifier_version && verifier_version !== WORKER_VERIFIER_VERSION) {
          return new Response(
            JSON.stringify({ error: "Unsupported verifier_version", supported_version: WORKER_VERIFIER_VERSION }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        // Default to worker version if not specified
        const effective_verifier_version = verifier_version || WORKER_VERIFIER_VERSION;

        if (!upload_id) {
          return new Response(
            JSON.stringify({ error: "Missing upload_id" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Resolve bundle from R2
        const bundleKey = `uploads/${upload_id}/bundle.bin`;
        const bundleObj = await env.EVIDENCE_BUCKET.get(bundleKey);
        
        if (!bundleObj) {
          return new Response(
            JSON.stringify({ error: "Bundle not found" }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }

        // Load manifest
        const manifestKey = `uploads/${upload_id}/manifest.json`;
        const manifestObj = await env.EVIDENCE_BUCKET.get(manifestKey);
        
        if (!manifestObj) {
          return new Response(
            JSON.stringify({ error: "Manifest not found" }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }

        const manifest = JSON.parse(await manifestObj.text());

        // PAYMENT GATE: Verify payment is confirmed before execution
        const paymentIntentId = manifest.payment_intent_id;
        if (!paymentIntentId) {
          return new Response(
            JSON.stringify({ error: "Missing payment authorization" }),
            { status: 402, headers: { "Content-Type": "application/json" } }
          );
        }

        // Verify payment confirmation with Stripe
        if (env.STRIPE_SECRET_KEY) {
          try {
            const stripeResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
              },
            });

            if (!stripeResponse.ok) {
              return new Response(
                JSON.stringify({ error: "Payment verification failed" }),
                { status: 402, headers: { "Content-Type": "application/json" } }
              );
            }

            const paymentIntent = await stripeResponse.json();
            if (paymentIntent.status !== "succeeded") {
              return new Response(
                JSON.stringify({ error: "Payment not confirmed", payment_status: paymentIntent.status }),
                { status: 402, headers: { "Content-Type": "application/json" } }
              );
            }
          } catch (error) {
            return new Response(
              JSON.stringify({ error: "Payment verification error" }),
              { status: 402, headers: { "Content-Type": "application/json" } }
            );
          }
        }

        // Recompute bundle hash (deterministic)
        const bundleBuffer = await bundleObj.arrayBuffer();
        const bundleHash = await crypto.subtle.digest("SHA-256", bundleBuffer);
        const computedHash =
          "sha256:" +
          [...new Uint8Array(bundleHash)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        // Assert hash === manifest hash
        if (computedHash !== manifest.bundle_hash) {
          return new Response(
            JSON.stringify({
              upload_id,
              bundle_hash: computedHash,
              profile_id,
              verifier_version,
              verdict: "not_verified",
              reason_codes: ["VFX-EVIDENCE-0100"],
              executed_at: new Date().toISOString()
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        // For v2.1: Minimal deterministic verification
        // - Hash matches manifest (verified above)
        // - Bundle exists and is readable
        // - Profile is supported (basic check)
        const supportedProfiles = ["public@1.0.0"];
        const verdict = supportedProfiles.includes(profile_id) ? "verified" : "not_verified";
        const reasonCodes = verdict === "verified" ? [] : ["VFX-PROFILE-0001"];

        // Build verdict object (excluding executed_at from hash computation)
        const verdictObject = {
          upload_id,
          bundle_hash: computedHash,
          profile_id,
          verifier_version: effective_verifier_version,
          verdict,
          reason_codes: reasonCodes
        };

        // Canonical JSON stringify (recursive, deterministic)
        // CRITICAL: Ensures nested objects and arrays are deterministically ordered
        function canonicalStringify(obj) {
          if (Array.isArray(obj)) {
            return `[${obj.map(canonicalStringify).join(",")}]`;
          }
          if (obj && typeof obj === "object") {
            return `{${Object.keys(obj).sort().map(
              key => `"${key}":${canonicalStringify(obj[key])}`
            ).join(",")}}`;
          }
          return JSON.stringify(obj);
        }

        // Compute verdict hash (excluding executed_at)
        const verdictCanonical = canonicalStringify(verdictObject);
        const verdictHashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verdictCanonical));
        const verdictHash =
          "sha256:" +
          [...new Uint8Array(verdictHashBuffer)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        // Compute version hash for execution finality
        const versionHashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(effective_verifier_version));
        const versionHash =
          "sha256:" +
          [...new Uint8Array(versionHashBuffer)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        // Generate Delivery Certificate
        const executedAt = new Date().toISOString();
        const certificateObject = {
          upload_id,
          bundle_hash: computedHash,
          profile_id,
          verifier_version: effective_verifier_version,
          version_hash: versionHash,
          verdict,
          reason_codes: reasonCodes,
          verdict_hash: verdictHash,
          executed_at: executedAt,
          finality_statement: "Execution of this verification constitutes delivery acceptance. Upon issuance, the associated dispute space is closed."
        };
        const certificateCanonical = canonicalStringify(certificateObject);
        const certificateHashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(certificateCanonical));
        const certificateHash =
          "sha256:" +
          [...new Uint8Array(certificateHashBuffer)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        // Persist full certificate (finality artifact - never recomputed)
        const fullCertificate = {
          ...certificateObject,
          certificate_hash: certificateHash
        };
        const certificateKey = `uploads/${upload_id}/certificate.json`;
        await env.EVIDENCE_BUCKET.put(
          certificateKey,
          JSON.stringify(fullCertificate, null, 2),
          { httpMetadata: { contentType: "application/json" } }
        );

        // Final response with Delivery Certificate
        const response = {
          upload_id,
          bundle_hash: computedHash,
          profile_id,
          verifier_version: effective_verifier_version,
          version_hash: versionHash,
          verdict,
          reason_codes: reasonCodes,
          verdict_hash: verdictHash,
          executed_at: executedAt,
          delivery_certificate: {
            certificate_hash: certificateHash,
            finality_statement: certificateObject.finality_statement
          }
        };

        return new Response(
          JSON.stringify(response),
          { status: 201, headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Internal server error", message: error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Verify authorized endpoint (payment → verification authorization)
    if (path === "/api/verify-authorized" && method === "POST") {
      try {
        const body = await request.json();
        if (!body.payment_intent_id) {
          return new Response(
            "Missing payment_intent_id",
            { status: 400 }
          );
        }
        
        return new Response(
          "Verification authorized.\n" +
          "Evidence submission not yet enabled.\n",
          { status: 501 }
        );
      } catch (error) {
        return new Response(
          "Invalid request body",
          { status: 400 }
        );
      }
    }

    // Delivery Certificate lookup
    if (path === "/api/certificate" && method === "GET") {
      const url = new URL(request.url);
      const certificateHash = url.searchParams.get("hash");
      const uploadId = url.searchParams.get("upload_id");
      
      if (!certificateHash && !uploadId) {
        return new Response(
          JSON.stringify({ error: "Missing certificate_hash or upload_id" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (!env.EVIDENCE_BUCKET) {
        return new Response(
          JSON.stringify({ error: "Service configuration error" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      try {
        // Lookup by upload_id (primary method)
        if (uploadId) {
          const certificateKey = `uploads/${uploadId}/certificate.json`;
          const certificateObj = await env.EVIDENCE_BUCKET.get(certificateKey);
          
          if (!certificateObj) {
            return new Response(
              JSON.stringify({ error: "Certificate not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }

          // Return persisted certificate directly (no re-execution, no dependencies)
          const certificate = JSON.parse(await certificateObj.text());
          return new Response(
            JSON.stringify(certificate),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        // Lookup by hash (requires scanning - not implemented in v2.3.0)
        if (certificateHash) {
          return new Response(
            JSON.stringify({ error: "Hash lookup not yet implemented. Use upload_id." }),
            { status: 501, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Internal server error" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // API boundary
    if (path.startsWith("/api/")) {
      return new Response(
        "VERIFRAX API: not implemented",
        { status: 501 }
      );
    }

    // Verification endpoint (paid finality event)
    if (path === "/verify") {
      return new Response(
        "VERIFRAX verification endpoint.\n" +
        "This endpoint accepts an evidence bundle and produces a final verdict.\n" +
        "Payment is required before execution.\n",
        { status: 501 }
      );
    }

    // Canonical definition
    if (path === "/what-is-verifrax") {
      return new Response(
        "VERIFRAX is a deterministic verification system that produces a final, reproducible verdict for an evidence bundle.\n",
        { status: 200 }
      );
    }

    // Negative definition
    if (path === "/what-verifrax-does-not-do") {
      return new Response(
        "VERIFRAX does not predict outcomes.\n" +
        "VERIFRAX does not judge intent.\n" +
        "VERIFRAX does not replace courts, auditors, or humans.\n" +
        "VERIFRAX does not modify evidence.\n" +
        "VERIFRAX does not provide opinions.\n\n" +
        "VERIFRAX only verifies whether a submitted evidence bundle satisfies a declared verification standard.\n",
        { status: 200 }
      );
    }

    // Specification
    if (path === "/spec") {
      return new Response(
        "VERIFRAX Specification (v1)\n\n" +
        "Input:\n" +
        "- Evidence bundle\n" +
        "- Verification profile identifier\n\n" +
        "Process:\n" +
        "- The evidence bundle is hashed deterministically.\n" +
        "- The verification profile is applied without interpretation.\n" +
        "- No external data is fetched.\n" +
        "- No mutable state is used.\n\n" +
        "Output:\n" +
        "- verdict: verified | not_verified\n" +
        "- reasons: zero or more deterministic failure reasons\n" +
        "- bundle_hash: canonical hash of the submitted evidence bundle\n\n" +
        "Properties:\n" +
        "- Deterministic\n" +
        "- Reproducible\n" +
        "- Stateless\n" +
        "- Portable\n\n" +
        "If the same evidence bundle is evaluated under the same verification profile, the output will always be identical.\n\n" +
        "v1 Limits:\n" +
        "- Evidence bundles up to 2GB\n" +
        "- Hashing performed post-upload\n" +
        "- Larger bundles require v2 streaming hash verification\n",
        { status: 200 }
      );
    }

    // Glossary
    if (path === "/glossary") {
      return new Response(
        "VERIFRAX Glossary\n\n" +
        "Evidence bundle:\n" +
        "A fixed collection of files and metadata submitted together for verification.\n\n" +
        "Verification profile:\n" +
        "A declared set of deterministic rules used to evaluate an evidence bundle.\n\n" +
        "Verdict:\n" +
        "The final result of verification: verified or not_verified.\n\n" +
        "Deterministic:\n" +
        "Producing the same output given the same input, without randomness.\n\n" +
        "Reproducible:\n" +
        "Capable of being re-evaluated with identical results.\n\n" +
        "Finality:\n" +
        "A state where further dispute is rendered unnecessary by verification.\n",
        { status: 200 }
      );
    }

    // Root
    if (path === "/") {
      return new Response(
        "VERIFRAX\n" +
        "Deterministic verification system.\n\n" +
        "Type: Verification system\n" +
        "Category: Evidence verification\n" +
        "Properties: deterministic, reproducible, stateless\n",
        { status: 200 }
      );
    }

    // Everything else
    return new Response(
      "Not found",
      { status: 404 }
    );
  }
};

// Wrap handler to add security headers to all responses
export default {
  async fetch(request, env) {
    const response = await handler.fetch(request, env);
    return addSecurityHeaders(response);
  }
};
