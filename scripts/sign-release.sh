#!/usr/bin/env bash
# sign-release.sh 🌳🔗🛡️
#
# Usage: ./sign-release.sh <artifact-file>
#
# This script computes a Merkle root of all release artifact hashes (tracked in releases.sha512.hashes),
# appends the new hash (with metadata), and outputs the new Merkle root. Intended for use in release automation.

set -euo pipefail

ARTIFACT="${1-}"
HASH_FILE="releases.sha512.hashes"
VERSION=$(jq -r .version package.json)
DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Check for required utilities and files
if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required but not installed. Please install jq." >&2
  exit 1
fi
if [ ! -f package.json ]; then
  echo "Error: package.json not found in the current directory." >&2
  exit 1
fi
if [ -z "$ARTIFACT" ] || [ ! -f "$ARTIFACT" ]; then
  echo "Error: Artifact file '$ARTIFACT' not found. Usage: $0 <artifact-file>" >&2
  exit 1
fi

# If no artifact is given, just compute and print the Merkle root for the existing hashes file
if [ -z "${ARTIFACT:-}" ]; then
  if [ ! -f "$HASH_FILE" ]; then
    echo "Error: No artifact specified and $HASH_FILE does not exist." >&2
    exit 1
  fi
  node --input-type=module <<'EOF'
import path from 'path';
import fs from 'fs';
const projectRoot = process.cwd();
const merkleLib = await import(path.join(projectRoot, 'dist', 'index.js'));
const { computeMerkleRoot } = merkleLib;
const hashes = fs.readFileSync(path.join(projectRoot, 'releases.sha512.hashes'), 'utf8')
  .trim().split('\n')
  .map(line => Buffer.from(line.split(' ')[0], 'hex'));
const root = computeMerkleRoot(hashes);
console.log('🌳 Merkle root for all releases:', Buffer.from(root).toString('hex'));
EOF
  exit 0
fi

# Ensure the hashes file is writable at the start (if it exists)
if [ -f "$HASH_FILE" ]; then
  chmod 644 "$HASH_FILE"
fi

# 1. Hash the artifact (SHA-512)
ARTIFACT_HASH=$(shasum -a 512 "$ARTIFACT" | awk '{print $1}')
NEW_LINE="$ARTIFACT_HASH $ARTIFACT $VERSION $DATE"

# Only append if the last line is different and the hash is not already present for this artifact/version
if [ ! -f "$HASH_FILE" ] || ! grep -q "^$ARTIFACT_HASH $ARTIFACT $VERSION" "$HASH_FILE"; then
  echo "$NEW_LINE" >> "$HASH_FILE"
else
  echo "No change: hash entry already exists for this artifact/version, not appending duplicate." >&2
fi

# 2. Compute the Merkle root using ts-merkle (over just the hashes)
node --input-type=module <<'EOF'
import path from 'path';
import fs from 'fs';
const projectRoot = process.cwd();
const merkleLib = await import(path.join(projectRoot, 'dist', 'index.js'));
const { computeMerkleRoot } = merkleLib;
const hashes = fs.readFileSync(path.join(projectRoot, 'releases.sha512.hashes'), 'utf8')
  .trim().split('\n')
  .map(line => Buffer.from(line.split(' ')[0], 'hex'));
const root = computeMerkleRoot(hashes);
console.log('🌳 Merkle root for all releases:', Buffer.from(root).toString('hex'));
EOF

# 3. Optionally, sign the Merkle root with GPG
# echo "$MERKLE_ROOT" | gpg --clearsign > merkle-root.txt.asc

# 4. (Optional) Publish the Merkle root in your release notes or as a signed artifact

# Make the hashes file read-only at the end
chmod 444 "$HASH_FILE"

# Add this script to your release pipeline for full automation!
