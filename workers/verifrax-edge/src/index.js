export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // API boundary
    if (path.startsWith("/api/")) {
      return new Response(
        "VERIFRAX API: not implemented",
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

    // Root
    if (path === "/") {
      return new Response(
        "VERIFRAX\nDeterministic verification system.\n",
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

