import { SPEC_B64 } from "./spec.bundle.js";

function ct(path) {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (path.endsWith(".md")) return "text/markdown; charset=utf-8";
  if (path.endsWith(".json")) return "application/json; charset=utf-8";
  if (path.endsWith(".sha256")) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

function norm(p) {
  if (p === "/spec") return "/spec/";
  if (p === "/spec/") return "/spec/index.html";

  if (p === "/spec/latest") return "/spec/latest/";
  if (p === "/spec/latest/") return "/spec/latest/index.html";

  if (p === "/spec/v2.8.0") return "/spec/v2.8.0/";
  if (p === "/spec/v2.8.0/") return "/spec/v2.8.0/index.html";

  return p;
}

function getFile(specPath) {
  // specPath is "/spec/...."
  // bundle keys are relative to public/spec, i.e. "/latest/index.html" etc
  const rel = specPath.replace(/^\/spec/, "") || "/";
  return SPEC_B64[rel] || null;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // hard boundary
    if (!url.pathname.startsWith("/spec")) {
      return new Response("Not Found", { status: 404 });
    }

    const p = norm(url.pathname);
    const b64 = getFile(p);

    if (!b64) return new Response("Not Found", { status: 404 });

    const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const headers = new Headers();
    headers.set("content-type", ct(p));

    // caching: immutable for versioned, short for latest + index
    if (p.startsWith("/spec/v2.8.0/")) headers.set("cache-control", "public, max-age=31536000, immutable");
    else headers.set("cache-control", "public, max-age=300");

    return new Response(bin, { status: 200, headers });
  }
};
