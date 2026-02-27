const TEXT = new TextDecoder();

function guessContentType(path) {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (path.endsWith(".md")) return "text/markdown; charset=utf-8";
  if (path.endsWith(".json")) return "application/json; charset=utf-8";
  if (path.endsWith(".sha256")) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

function normalize(pathname) {
  if (pathname === "/spec") return "/spec/";
  if (pathname === "/spec/") return "/spec/index.html";

  if (pathname === "/spec/latest") return "/spec/latest/";
  if (pathname === "/spec/latest/") return "/spec/latest/index.html";

  if (pathname === "/spec/v2.8.0") return "/spec/v2.8.0/";
  if (pathname === "/spec/v2.8.0/") return "/spec/v2.8.0/index.html";

  // allow /spec/latest/* and /spec/v2.8.0/*
  return pathname;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // DENY_ASSETS_PATH
    if (url.pathname.startsWith("/assets/")) {
      return new Response("Not Found", { status: 404 });
    }


    // hard scope: only serve /spec*
    if (!url.pathname.startsWith("/spec")) {
      return new Response("Not Found", { status: 404 });
    }

    const p = normalize(url.pathname);

    // map URL path to embedded asset path
    const assetPath = "/assets" + p; // internal ASSETS mount

    // Cloudflare Workers with assets binding (wrangler v4)
    const res = await env.ASSETS.fetch(new Request(new URL(assetPath, url.origin), request));
    if (res.status === 404) {
      return new Response("Not Found", { status: 404 });
    }

    const headers = new Headers(res.headers);
    headers.set("content-type", guessContentType(p));

    // caching: immutable for versioned, short for latest
    if (p.startsWith("/spec/v2.8.0/")) {
      headers.set("cache-control", "public, max-age=31536000, immutable");
    } else if (p.startsWith("/spec/latest/")) {
      headers.set("cache-control", "public, max-age=300");
    } else {
      headers.set("cache-control", "public, max-age=300");
    }

    return new Response(res.body, { status: res.status, headers });
  }
};
