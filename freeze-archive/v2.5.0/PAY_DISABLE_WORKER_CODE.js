/**
 * Cloudflare Worker Code — /pay Disable
 * 
 * This code returns 404 for /pay and /api/create-payment-intent endpoints.
 * 
 * To use:
 * 1. Replace existing Worker code with this
 * 2. Deploy: npx wrangler deploy --env=production
 * 3. Verify: curl https://verifrax.net/pay (should return 404)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Disable /pay endpoint
    if (url.pathname === '/pay' || url.pathname === '/pay/') {
      return new Response('Not Found', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'X-Verifrax-Version': '2.5.0',
          'X-Payment-Status': 'externalized'
        }
      });
    }
    
    // Disable /api/create-payment-intent endpoint
    if (url.pathname === '/api/create-payment-intent') {
      return new Response('Not Found', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'X-Verifrax-Version': '2.5.0',
          'X-Payment-Status': 'externalized'
        }
      });
    }
    
    // For all other routes, return 404 or handle as needed
    // (This is a minimal example - adjust based on your actual Worker structure)
    return new Response('Not Found', { status: 404 });
  }
};

