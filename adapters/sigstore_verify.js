"use strict";

const { die, ensureObject, canonicalHash } = require("./_util");

// Verification only. No identity issuance.
// Offline verification requires a bundle + trusted material supplied by caller.
// We default to structural validation + deterministic bundle hash.
// If @sigstore/verify is present, we perform cryptographic verification.
let sigstoreVerify = null;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  sigstoreVerify = require("@sigstore/verify");
} catch {}

function normalizeAndVerify(bundleObj, opts = {}) {
  ensureObject(bundleObj, "sigstore_bundle");

  const mediaType = typeof bundleObj.mediaType === "string" ? bundleObj.mediaType : "";
  const verificationMaterial = bundleObj.verificationMaterial && typeof bundleObj.verificationMaterial === "object" ? bundleObj.verificationMaterial : null;
  const content = bundleObj.content && typeof bundleObj.content === "object" ? bundleObj.content : null;

  if (!mediaType) die("E_SCHEMA", "sigstore bundle: mediaType missing");
  if (!verificationMaterial) die("E_SCHEMA", "sigstore bundle: verificationMaterial missing");
  if (!content) die("E_SCHEMA", "sigstore bundle: content missing");

  const normalized = {
    kind: "sigstore.bundle",
    media_type: mediaType,
    // deterministic subset for hashing:
    has_cert_chain: Boolean(verificationMaterial.x509CertificateChain),
    has_tlog_entries: Boolean(verificationMaterial.tlogEntries),
    content_type: typeof content.messageSignature === "object" ? "messageSignature" : (typeof content.dsseEnvelope === "object" ? "dsseEnvelope" : "unknown"),
    bundle_hash: canonicalHash(bundleObj),
  };

  let signature_valid = false;
  let verifier = "structural-only";

  if (sigstoreVerify) {
    // Caller must pass trusted root / tlog / ctlog options as needed.
    // If missing, we fail closed.
    if (!opts || typeof opts !== "object") die("E_VERIFY", "sigstore verify: opts required");
    try {
      // @sigstore/verify API varies; we attempt a conservative call.
      if (typeof sigstoreVerify.verify === "function") {
        sigstoreVerify.verify(bundleObj, opts);
      } else if (typeof sigstoreVerify === "function") {
        sigstoreVerify(bundleObj, opts);
      } else {
        die("E_VERIFY", "sigstore verify: unsupported library API");
      }
      signature_valid = true;
      verifier = "@sigstore/verify";
    } catch (e) {
      signature_valid = false;
      verifier = "@sigstore/verify";
    }
  }

  return { normalized: { ...normalized, signature_valid, verifier }, hash: canonicalHash({ ...normalized, signature_valid, verifier }) };
}

module.exports = { normalizeAndVerify };
