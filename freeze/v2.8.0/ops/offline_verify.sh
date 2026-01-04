#!/bin/bash
# Offline verification (3rd party)

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 <certificate.json> <evidence.zip> <profile_id>"
    exit 1
fi

CERT="$1"
BUNDLE="$2"
PROFILE="$3"

verifrax-verify \
  --certificate "$CERT" \
  --bundle "$BUNDLE" \
  --profile "$PROFILE" \
  --offline

echo "Offline verification complete"

