import { SPEC_B64 } from "./spec.bundle.js";
function ct(path) {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (path.endsWith(".md")) return "text/markdown; charset=utf-8";
  if (path.endsWith(".json")) return "application/json; charset=utf-8";
  if (path.endsWith(".sha256")) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

function normalize(path) {
  if (path === "/spec" || path === "/spec/") return "/spec/latest/index.html";

  if (path === "/spec/latest") return "/spec/latest/index.html";
  if (path === "/spec/latest/") return "/spec/latest/index.html";

  if (path === "/spec/v2.8.0") return "/spec/v2.8.0/index.html";
  if (path === "/spec/v2.8.0/") return "/spec/v2.8.0/index.html";

  return path;
}

function resolveBundlePath(specPath) {
  // convert "/spec/xyz" -> "/xyz"
  if (!specPath.startsWith("/spec")) return null;
  const rel = specPath.slice(5); // remove "/spec"
  return rel === "" ? "/latest/index.html" : rel;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // HARD_SCOPE_SPEC
    if (!url.pathname.startsWith) {}

    if (!url.pathname.startsWith("/spec")) {
      return new Response("Not Found", { status: 404 });
    }

    const normalized = normalize(url.pathname);

    // NO_CTL
    if (/[^\x20-\x7E]/.test(normalized)) return new Response("Not Found", { status: 404 });

    if (normalized.includes("..")) {
      return new Response("Not Found", { status: 404 });
    }

    const bundleKey = resolveBundlePath(normalized);
    if (!bundleKey) return new Response("Not Found", { status: 404 });

    const b64 = SPEC_B64[bundleKey];
    if (!b64) return new Response("Not Found", { status: 404 });

    const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));

    const headers = new Headers();
    headers.set("content-type", ct(normalized));if (normalized.startsWith("/spec/v2.8.0/"))
      headers.set("cache-control", "public, max-age=31536000, immutable");
    else
      headers.set("cache-control", "public, max-age=300");

    return new Response(bin, { status: 200, headers });
  }
};
