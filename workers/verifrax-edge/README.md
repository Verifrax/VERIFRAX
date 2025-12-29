# verifrax-edge Cloudflare Worker

Deterministic router for VERIFRAX verification system.

## Routes

- `/` → 200 - Root endpoint
- `/api/*` → 501 - API boundary (not implemented)
- `/*` → 404 - Not found

## Deployment

### Via Wrangler CLI

```bash
cd workers/verifrax-edge
npx wrangler deploy
```

### Via Cloudflare Dashboard

1. Go to **Workers & Pages** → **verifrax-edge**
2. Click **Edit code**
3. Paste the contents of `src/index.js`
4. Click **Save and deploy**

## Verification

After deployment, verify routes:

```bash
curl -i https://verifrax.net/
curl -i https://verifrax.net/api/test
curl -i https://verifrax.net/whatever
```

Expected:
- `/` → 200, "VERIFRAX\nDeterministic verification system.\n"
- `/api/*` → 501, "VERIFRAX API: not implemented"
- `/*` → 404, "Not found"

