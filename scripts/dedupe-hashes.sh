#!/usr/bin/env bash
# dedupe-hashes.sh 🌳🔗🛡️
#
# Usage: ./scripts/dedupe-hashes.sh [hashes-file]
#
# Deduplicates the hashes file, keeping only the latest entry for each unique hash/artifact/version tuple.

set -euo pipefail

HASH_FILE="${1:-releases.sha512.hashes}"
TMP_FILE="${HASH_FILE}.tmp"

awk '{ key = $1 " "$2 " "$3; line[key] = $0 } END { for (k in line) print line[k] }' "$HASH_FILE" | sort > "$TMP_FILE"
mv "$TMP_FILE" "$HASH_FILE"
echo "Deduplicated $HASH_FILE."
