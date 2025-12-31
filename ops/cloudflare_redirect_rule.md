# Cloudflare Redirect Rule Configuration

## Rule: Canonical Host + HTTPS Enforcement

**Location:** Cloudflare Dashboard → Rules → Redirect Rules

### Create Rule

**Rule Name:** `VERIFRAX Canonical Host`

**If:**
```
(http.request.scheme eq "http")
OR
(http.host eq "verifrax.net")
```

**Then:**
```
Static Redirect
Status Code: 301
URL: https://www.verifrax.net${uri}
```

### Verification

After deployment, verify:

```bash
curl -I http://verifrax.net
curl -I https://verifrax.net
curl -I http://www.verifrax.net
curl -I https://www.verifrax.net
```

All must redirect to or serve from `https://www.verifrax.net/`

