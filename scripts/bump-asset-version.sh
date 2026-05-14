#!/bin/sh
set -eu

INDEX_FILE="index.html"

if [ ! -f "$INDEX_FILE" ]; then
  echo "No se encuentra $INDEX_FILE"
  exit 1
fi

# Timestamp-based version to ensure a fresh asset URL on each commit/deploy.
VERSION="$(date -u +%Y%m%d%H%M%S)"

cp "$INDEX_FILE" "${INDEX_FILE}.bak"

perl -pe 's{(\./assets/[^"?]+\.(?:css|js|png|jpg|jpeg|svg|webp|gif))(?:\?v=\d+)?}{$1 . "?v='"$VERSION"'"}ge' "${INDEX_FILE}.bak" > "$INDEX_FILE"

rm -f "${INDEX_FILE}.bak"

echo "Asset version updated to $VERSION in $INDEX_FILE"
