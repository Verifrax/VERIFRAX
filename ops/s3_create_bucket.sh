#!/bin/bash
# Create S3 bucket with object lock

BUCKET="verifrax-evidence"
REGION="eu-central-1"

echo "=== Creating S3 Bucket with Object Lock ==="

# Create bucket
aws s3api create-bucket \
  --bucket "$BUCKET" \
  --region "$REGION" \
  --create-bucket-configuration LocationConstraint="$REGION"

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket "$BUCKET" \
  --versioning-configuration Status=Enabled

# Block public access
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable object lock
aws s3api put-object-lock-configuration \
  --bucket "$BUCKET" \
  --object-lock-configuration '{
    "ObjectLockEnabled":"Enabled",
    "Rule":{"DefaultRetention":{"Mode":"GOVERNANCE","Days":365}}
  }'

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket "$BUCKET" \
  --server-side-encryption-configuration '{
    "Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]
  }'

echo "=== Bucket created: $BUCKET ==="
echo "Object Lock: ENABLED (GOVERNANCE, 365 days)"
echo "Versioning: ENABLED"
echo "Public Access: BLOCKED"
echo "Encryption: AES-256"

