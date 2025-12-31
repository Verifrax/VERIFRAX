# PHASE 1 — PUBLIC SURFACE CHECKLIST

**Version:** v2.5.0  
**Purpose:** Hard verification checklist for public endpoints  
**No auth required. No payment required. Zero trust.**

---

## REQUIRED ENDPOINTS

### `GET /`

**Expected HTTP Code:** `200`  
**Content-Type:** `text/plain` or `text/html`  
**Headers Required:**
- `X-Verifrax-Version: 2.5.0`

**Exact Text Guarantees:**
- Must contain: `VERIFRAX`
- Must contain: `v2.5.0` or version identifier
- Must NOT contain: payment forms, Stripe.js, authentication prompts

**Curl Command:**
```bash
curl -i https://www.verifrax.net/
```

**Pass Criteria:**
- Status code: `200`
- Header `X-Verifrax-Version` present and equals `2.5.0`
- Response body contains `VERIFRAX`
- Response body does NOT contain `js.stripe.com`
- Response body does NOT contain `payment`
- Response body does NOT contain login/auth forms

**Fail Criteria:**
- Status code: `404`, `403`, `500`, `410`
- Missing `X-Verifrax-Version` header
- Contains payment UI or Stripe references
- Requires authentication

---

### `GET /spec`

**Expected HTTP Code:** `200`  
**Content-Type:** `text/plain` or `application/json` or `text/markdown`  
**Headers Required:**
- `X-Verifrax-Version: 2.5.0`

**Exact Text Guarantees:**
- Must return frozen specification content
- Must reference `freeze/v2.5.0/UNIVERSAL_PUBLIC_SURFACE_SPEC_v2.5.0.md` or equivalent
- Must NOT be modified from frozen source

**Curl Command:**
```bash
curl -i https://www.verifrax.net/spec
```

**Pass Criteria:**
- Status code: `200`
- Header `X-Verifrax-Version` present and equals `2.5.0`
- Content matches or references frozen spec
- Content is readable as plain text (no binary)

**Fail Criteria:**
- Status code: `404`, `403`, `500`
- Content differs from frozen spec
- Binary or unreadable content

---

### `GET /glossary`

**Expected HTTP Code:** `200`  
**Content-Type:** `text/plain` or `text/markdown`  
**Headers Required:**
- `X-Verifrax-Version: 2.5.0`

**Exact Text Guarantees:**
- Must contain fixed terminology definitions
- Must define: `verification`, `certificate`, `evidence bundle`, `profile`, `execution`
- Must NOT contain marketing language

**Curl Command:**
```bash
curl -i https://www.verifrax.net/glossary
```

**Pass Criteria:**
- Status code: `200`
- Header `X-Verifrax-Version` present and equals `2.5.0`
- Contains at least 5 term definitions
- No marketing or promotional language

**Fail Criteria:**
- Status code: `404`, `403`, `500`
- Missing core term definitions
- Contains marketing language

---

### `GET /status`

**Expected HTTP Code:** `200`  
**Content-Type:** `application/json` or `text/plain`  
**Headers Required:**
- `X-Verifrax-Version: 2.5.0`

**Exact Text Guarantees:**
- Must return system status
- Must include: `version`, `status`, `governance_state`
- Must indicate payment status (disabled in v2.5.0)

**Curl Command:**
```bash
curl -i https://www.verifrax.net/status
```

**Pass Criteria:**
- Status code: `200`
- Header `X-Verifrax-Version` present and equals `2.5.0`
- Contains `version` field
- Contains `status` field
- If JSON, valid JSON structure

**Fail Criteria:**
- Status code: `404`, `403`, `500`
- Missing required fields
- Invalid JSON (if JSON format)

---

### `GET /reference-verifier`

**Expected HTTP Code:** `200` or `302` (redirect)  
**Content-Type:** `text/plain` or `application/octet-stream` or redirect  
**Headers Required:**
- `X-Verifrax-Version: 2.5.0`

**Exact Text Guarantees:**
- Must provide access to reference verifier implementation
- Must include cryptographic hashes (SHA256)
- Must link to GitHub or direct download

**Curl Command:**
```bash
curl -i https://www.verifrax.net/reference-verifier
```

**Pass Criteria:**
- Status code: `200` (direct) or `302` (redirect)
- Header `X-Verifrax-Version` present and equals `2.5.0`
- Provides verifier download or GitHub link
- Includes hash information

**Fail Criteria:**
- Status code: `404`, `403`, `500`
- No verifier access provided
- Missing hash information

---

## FORBIDDEN ENDPOINTS (MUST RETURN 410)

### `GET /pay`
### `POST /pay`
### `POST /api/create-payment-intent`

**Expected HTTP Code:** `410` (Gone)  
**Headers Required:**
- `X-Verifrax-Version: 2.5.0`
- `X-Payment-Status: disabled`

**Curl Commands:**
```bash
curl -i https://www.verifrax.net/pay
curl -i -X POST https://www.verifrax.net/api/create-payment-intent
```

**Pass Criteria:**
- Status code: `410`
- Header `X-Payment-Status: disabled` present
- Response body contains `DISABLED` or equivalent

**Fail Criteria:**
- Status code: `200`, `404`, `403`
- Payment UI or Stripe.js present
- Payment processing occurs

---

## WHAT IS ALLOWED

1. Public read access to all required endpoints
2. Plain text responses (no JS execution required)
3. Static content serving
4. Redirects to external resources (GitHub, etc.)
5. JSON responses for structured data

---

## WHAT IS FORBIDDEN

1. Authentication requirements
2. Payment processing
3. JavaScript execution requirements
4. Cookies or session state
5. Rate limiting beyond infrastructure defaults
6. User tracking or analytics
7. Modification of frozen content

---

## WHAT HAPPENS ON FAILURE

**Endpoint Returns Non-200:**
- System is non-functional for public inspection
- Freeze validation fails
- Must fix before proceeding to Phase 2

**Missing Headers:**
- Version identification fails
- Cannot verify compliance
- Must fix before proceeding

**Payment Endpoints Return 200:**
- Critical security violation
- Freeze invalidated
- Must disable immediately

---

## WHAT CANNOT BE APPEALED

1. **Required endpoints must return 200** — no exceptions
2. **Payment endpoints must return 410** — no exceptions
3. **Headers must be present** — no exceptions
4. **Content must match frozen spec** — no exceptions
5. **No authentication on public endpoints** — no exceptions

---

## VERIFICATION SCRIPT

```bash
#!/bin/bash
# Phase 1 Verification

BASE_URL="https://www.verifrax.net"
FAILED=0

check_endpoint() {
    local path=$1
    local expected_status=$2
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
    
    if [ "$response" != "$expected_status" ]; then
        echo "FAIL: $path returned $response (expected $expected_status)"
        FAILED=1
    else
        echo "PASS: $path returned $expected_status"
    fi
}

check_header() {
    local path=$1
    local header=$2
    local expected_value=$3
    local value=$(curl -s -I "$BASE_URL$path" | grep -i "$header" | cut -d' ' -f2 | tr -d '\r')
    
    if [ "$value" != "$expected_value" ]; then
        echo "FAIL: $path header $header = '$value' (expected '$expected_value')"
        FAILED=1
    else
        echo "PASS: $path header $header = '$expected_value'"
    fi
}

echo "=== Phase 1 Public Surface Check ==="

check_endpoint "/" "200"
check_endpoint "/spec" "200"
check_endpoint "/glossary" "200"
check_endpoint "/status" "200"
check_endpoint "/reference-verifier" "200"
check_endpoint "/pay" "410"
check_endpoint "/api/create-payment-intent" "410"

check_header "/" "X-Verifrax-Version" "2.5.0"
check_header "/pay" "X-Payment-Status" "disabled"

if [ $FAILED -eq 0 ]; then
    echo "=== ALL CHECKS PASSED ==="
    exit 0
else
    echo "=== CHECKS FAILED ==="
    exit 1
fi
```

---

**END OF CHECKLIST**

