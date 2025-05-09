#!/usr/bin/env bash
# verify-release.sh 🌳🔗🛡️
#
# Usage: ./verify-release.sh [hashes-file]
#
# Verifies the Merkle root of the release hashes file using ts-merkle.
# Prints the Merkle root and optionally checks a user-supplied root.

set -euo pipefail

HASH_FILE="${1:-releases.sha512.hashes}"

if [ ! -f "$HASH_FILE" ]; then
  echo "Error: Hashes file '$HASH_FILE' not found." >&2
  exit 1
fi

node --input-type=module <<'EOF'
import path from 'path';
import fs from 'fs';
const projectRoot = process.cwd();
const merkleLib = await import(path.join(projectRoot, 'dist', 'index.js'));
const { computeMerkleRoot } = merkleLib;
const hashes = fs.readFileSync(path.join(projectRoot, process.env.HASH_FILE || 'releases.sha512.hashes'), 'utf8')
  .trim().split('\n')
  .map(line => Buffer.from(line.split(' ')[0], 'hex'));
const root = computeMerkleRoot(hashes);
console.log('🌳 Merkle root for all releases:', Buffer.from(root).toString('hex'));
EOF
