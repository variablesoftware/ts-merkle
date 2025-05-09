#!/usr/bin/env bash
# sign-release.sh 🌳🔗🛡️
#
# Usage: ./sign-release.sh <artifact-file>
#
# This script computes a Merkle root of all release artifact hashes (tracked in releases.hashes),
# appends the new hash, and outputs the new Merkle root. Intended for use in release automation.

set -euo pipefail

ARTIFACT="$1"
HASH_FILE="releases.hashes"
MERKLE_SCRIPT=".github/scripts/merkle-root.mjs"

# 1. Hash the artifact (SHA-256)
ARTIFACT_HASH=$(shasum -a 256 "$ARTIFACT" | awk '{print $1}')
echo "$ARTIFACT_HASH" >> "$HASH_FILE"

# 2. Compute the Merkle root using ts-merkle
node <<'EOF'
const { computeMerkleRoot } = require('../dist/index.js');
const fs = require('fs');
const hashes = fs.readFileSync('releases.hashes', 'utf8')
  .trim().split('\n').map(line => Buffer.from(line, 'hex'));
const root = computeMerkleRoot(hashes);
console.log('🌳 Merkle root for all releases:', Buffer.from(root).toString('hex'));
EOF

# 3. Optionally, sign the Merkle root with GPG
# echo "$MERKLE_ROOT" | gpg --clearsign > merkle-root.txt.asc

# 4. (Optional) Publish the Merkle root in your release notes or as a signed artifact

# Add this script to your release pipeline for full automation!
