# PHASE 3 — EVIDENCE INTAKE SPECIFICATION

**Version:** v2.5.0  
**Status:** OPERATIONAL SPEC (NO CODE YET)  
**Purpose:** Technical specification for evidence bundle submission pipeline

---

## MAX BUNDLE SIZE

### Size Limits

**Maximum Bundle Size:** 100 MB (104,857,600 bytes)  
**Recommended Size:** < 50 MB  
**Minimum Size:** 1 KB (1,024 bytes)

### Size Enforcement

- **Client-side:** Pre-upload size check recommended
- **Server-side:** Hard limit enforced at upload start
- **Rejection:** Bundles exceeding 100 MB rejected immediately (HTTP `413 Payload Too Large`)

### Size Calculation

- Size = compressed archive size (ZIP/TAR)
- Size = sum of all files if directory structure
- Size = raw file size if single file

**Rule:** Size checked before hash computation.

---

## ALLOWED FORMATS

### Archive Formats

1. **ZIP** — `.zip` (preferred)
2. **TAR** — `.tar`
3. **TAR.GZ** — `.tar.gz`
4. **TAR.XZ** — `.tar.xz`

### Directory Structure

- **Directory upload** — multipart upload of directory structure
- **Single file** — direct file upload

### Format Validation

- Format detected by file extension or MIME type
- Invalid format → HTTP `400 Bad Request`
- Format does not affect verification authority (see Evidence Bundle Spec)

---

## HASH-BEFORE-UPLOAD RULE

### Client-Side Hash Requirement

**Rule:** Client MUST compute SHA-256 hash before upload.

### Hash Format

- **Algorithm:** SHA-256
- **Format:** Hexadecimal (lowercase, 64 characters)
- **Prefix:** Optional `sha256:` prefix allowed
- **Example:** `a1b2c3d4e5f6...` or `sha256:a1b2c3d4e5f6...`

### Hash Submission

**Header Required:**
```
X-Bundle-Hash: sha256:a1b2c3d4e5f6...
```

### Hash Verification

1. **Client computes hash** before upload
2. **Client sends hash** in `X-Bundle-Hash` header
3. **Server computes hash** after upload completion
4. **Server compares hashes** — must match exactly
5. **Mismatch → rejection** — HTTP `400 Bad Request` with reason

### Hash Mismatch Response

```json
{
  "error": "hash_mismatch",
  "client_hash": "sha256:...",
  "server_hash": "sha256:...",
  "message": "Bundle hash does not match declared hash"
}
```

**Rule:** Hash mismatch = upload rejected, no partial storage.

---

## S3 OBJECT-LOCK SETTINGS

### Bucket Configuration

**Bucket Name:** `verifrax-evidence`  
**Region:** EU (primary), US (secondary)  
**Object Lock:** **ENABLED**  
**Object Lock Mode:** `GOVERNANCE` (allows authorized deletion if needed)  
**Object Lock Retention Period:** `365 days` (minimum)

### Versioning

- **Versioning:** **ENABLED**
- **All versions retained** — no automatic deletion
- **Version ID required** for all operations

### Access Control

- **Public Access:** **BLOCKED** (all public access blocked)
- **Bucket Policy:** Deny all public access
- **ACL:** Private (no public ACLs)
- **CORS:** Disabled (no cross-origin access)

### Encryption

- **Server-Side Encryption:** AES-256 (S3 managed keys)
- **Encryption at Rest:** Required
- **Encryption in Transit:** TLS 1.2+ required

---

## MULTIPART UPLOAD RULES

### Multipart Upload Trigger

**Threshold:** 5 MB (5,242,880 bytes)

- **< 5 MB:** Single-part upload
- **≥ 5 MB:** Multipart upload (required)

### Multipart Upload Process

1. **Initiate Multipart Upload**
   - Endpoint: `POST /api/upload/initiate`
   - Returns: `upload_id`, `part_urls[]` (pre-signed URLs)
   - Part size: 5 MB (except last part)

2. **Upload Parts**
   - Client uploads each part to pre-signed URL
   - Client receives `ETag` for each part
   - Client tracks: `part_number`, `etag`

3. **Complete Multipart Upload**
   - Endpoint: `POST /api/upload/complete`
   - Body: `upload_id`, `parts[]` (part_number + etag)
   - Server verifies all parts
   - Server computes final hash
   - Server compares with `X-Bundle-Hash` header

### Pre-Signed URL Rules

- **Expiration:** 1 hour from generation
- **Method:** PUT only
- **Content-Type:** `application/octet-stream` or `application/zip`
- **Max Parts:** 20,000 parts (100 MB / 5 MB = 20 parts max)

### Multipart Upload Failure

**Scenario:** Part upload fails or expires

**Response:**
- Abort multipart upload (cleanup)
- Return HTTP `400 Bad Request`
- Client must restart upload
- No partial storage

**Rule:** All parts must succeed or entire upload fails.

---

## FAILURE DETERMINISM

### Deterministic Failures

All failures must be **deterministic** and **reproducible**:

1. **Size Exceeded** → HTTP `413` (always)
2. **Hash Mismatch** → HTTP `400` (always)
3. **Invalid Format** → HTTP `400` (always)
4. **Missing Hash Header** → HTTP `400` (always)
5. **Multipart Expired** → HTTP `400` (always)

### Non-Deterministic Failures (Infrastructure)

1. **S3 Outage** → HTTP `503 Service Unavailable`
2. **Network Timeout** → HTTP `504 Gateway Timeout`
3. **Worker Error** → HTTP `500 Internal Server Error`

**Rule:** Infrastructure failures are retryable. Validation failures are not.

---

## WHAT IS ALLOWED

1. **ZIP, TAR, TAR.GZ, TAR.XZ formats** — standard archive formats
2. **Directory structure upload** — multipart directory upload
3. **Single file upload** — direct file upload (< 5 MB)
4. **Multipart upload** — for bundles ≥ 5 MB
5. **Hash verification** — client-provided hash validated against server hash
6. **Pre-signed URLs** — S3 pre-signed URLs for multipart uploads
7. **Retry on infrastructure failure** — network/S3 errors are retryable

---

## WHAT IS FORBIDDEN

1. **Bundles > 100 MB** — hard limit, no exceptions
2. **Upload without hash** — `X-Bundle-Hash` header required
3. **Hash mismatch** — client hash must match server hash exactly
4. **Invalid formats** — only ZIP, TAR, TAR.GZ, TAR.XZ allowed
5. **Public S3 access** — all public access blocked
6. **Unencrypted storage** — encryption at rest required
7. **Partial storage on failure** — all-or-nothing upload (no partial files)
8. **Modification after upload** — object lock prevents modification
9. **Automatic retry on validation failure** — validation failures are not retryable

---

## WHAT HAPPENS ON FAILURE

### Size Exceeded

- **Response:** HTTP `413 Payload Too Large`
- **Action:** Upload rejected immediately
- **Storage:** No partial storage
- **Retry:** Not allowed (must reduce bundle size)

### Hash Mismatch

- **Response:** HTTP `400 Bad Request` with error details
- **Action:** Upload rejected, bundle deleted from S3
- **Storage:** No storage of mismatched bundle
- **Retry:** Allowed (client can fix hash and retry)

### Invalid Format

- **Response:** HTTP `400 Bad Request`
- **Action:** Upload rejected
- **Storage:** No storage
- **Retry:** Allowed (client can fix format and retry)

### Missing Hash Header

- **Response:** HTTP `400 Bad Request`
- **Action:** Upload rejected before S3 transfer
- **Storage:** No storage
- **Retry:** Allowed (client can add header and retry)

### Multipart Upload Expired

- **Response:** HTTP `400 Bad Request`
- **Action:** Multipart upload aborted, parts deleted
- **Storage:** No partial storage
- **Retry:** Allowed (client must restart upload)

### S3 Outage

- **Response:** HTTP `503 Service Unavailable`
- **Action:** Upload fails, no storage
- **Storage:** No storage
- **Retry:** Allowed (infrastructure failure is retryable)

### Network Timeout

- **Response:** HTTP `504 Gateway Timeout`
- **Action:** Upload fails, no storage
- **Storage:** No partial storage (multipart may have partial parts, but upload incomplete)
- **Retry:** Allowed (network failure is retryable)

---

## WHAT CANNOT BE APPEALED

1. **100 MB size limit** — hard limit, no exceptions
2. **Hash mismatch rejection** — client hash must match server hash exactly
3. **Invalid format rejection** — only allowed formats accepted
4. **Missing hash header rejection** — hash header required
5. **Object lock immutability** — uploaded bundles cannot be modified
6. **No public access** — S3 buckets remain private
7. **No partial storage** — all-or-nothing upload (no partial files on failure)

---

**END OF SPECIFICATION**

