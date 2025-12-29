# AWS S3 Setup for VERIFRAX Evidence Uploads

## S3 Bucket Configuration

Create an S3 bucket with the following settings:

- **Name:** `verifrax-evidence`
- **Region:** `eu-central-1` (or your preferred region)
- **Block public access:** **ON** (enabled)
- **Versioning:** **ON** (enabled)

## IAM User Configuration

Create an IAM user named `verifrax-uploader` with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:CreateMultipartUpload",
        "s3:UploadPart",
        "s3:CompleteMultipartUpload",
        "s3:AbortMultipartUpload",
        "s3:ListMultipartUploadParts",
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::verifrax-evidence/uploads/*"
    }
  ]
}
```

**Note:** `GetObject` is needed to compute bundle hash after upload completion. `PutObject` is needed to write `manifest.json`.

## Environment Variables

Set the following secrets in Cloudflare Workers:

```bash
cd workers/verifrax-edge

# AWS Access Key ID
npx wrangler secret put AWS_ACCESS_KEY_ID
# Enter: AKIAVSXWQIPL3GVGYTHE

# AWS Secret Access Key
npx wrangler secret put AWS_SECRET_ACCESS_KEY
# Enter: ycD7hYPxUqPCKCQq10vIKkbEWHPxMBWbCbZIL3ue

# AWS Region (optional, defaults to eu-central-1)
npx wrangler secret put AWS_REGION
# Enter: eu-central-1

# S3 Bucket Name (optional, defaults to verifrax-evidence)
npx wrangler secret put S3_BUCKET_NAME
# Enter: verifrax-evidence
```

## Storage Semantics

- **Key structure:**
  - `uploads/{upload_id}/bundle` - The evidence bundle file
  - `uploads/{upload_id}/manifest.json` - Bundle metadata (future)

- **Properties:**
  - No overwrite
  - No delete
  - Immutable once completed
  - Versioning enabled

## Upload Flow

1. Client calls `POST /api/create-upload` with `payment_intent_id` and `bundle_size_bytes`
2. Worker creates S3 multipart upload
3. Worker generates pre-signed URLs for each part (100 MB chunks)
4. Client uploads directly to S3 using pre-signed URLs
5. Worker never sees file bytes (direct-to-S3 upload)

## Part Size

- **Part size:** 100 MB
- **TTL:** 15 minutes (900 seconds)
- **Resumable:** Yes (multipart upload supports resumption)

