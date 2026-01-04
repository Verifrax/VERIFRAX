#!/bin/bash
# Pre-create Stripe objects (unused in v2.5.0)

echo "=== Creating Stripe Objects (PRE-CREATE, UNUSED) ==="

# Create product
PRODUCT=$(stripe products create \
  --name "VERIFRAX_EXECUTION" \
  --type service \
  --description "VERIFRAX single deterministic verification execution" \
  --metadata[purpose]=verifrax_execution \
  --metadata[verifrax_version]=2.5.0 \
  --metadata[execution_type]=single_final \
  --metadata[non_refundable]=true \
  -q)

PRODUCT_ID=$(echo "$PRODUCT" | jq -r '.id')
echo "Product ID: $PRODUCT_ID"

# Create price: Standard (€500)
PRICE_STANDARD=$(stripe prices create \
  --product "$PRODUCT_ID" \
  --unit-amount 50000 \
  --currency eur \
  --metadata[price_tier]=standard \
  -q)
echo "Standard price: $(echo "$PRICE_STANDARD" | jq -r '.id')"

# Create price: High-Value (€2,500)
PRICE_HIGH=$(stripe prices create \
  --product "$PRODUCT_ID" \
  --unit-amount 250000 \
  --currency eur \
  --metadata[price_tier]=high_value \
  -q)
echo "High-Value price: $(echo "$PRICE_HIGH" | jq -r '.id')"

# Create price: Enterprise (€5,000)
PRICE_ENTERPRISE=$(stripe prices create \
  --product "$PRODUCT_ID" \
  --unit-amount 500000 \
  --currency eur \
  --metadata[price_tier]=enterprise \
  -q)
echo "Enterprise price: $(echo "$PRICE_ENTERPRISE" | jq -r '.id')"

echo "=== Stripe objects created (NOT CONNECTED) ==="
echo "Store these IDs for future v2.6+ integration"

