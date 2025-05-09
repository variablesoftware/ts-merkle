// src/index.ts

import { createHash } from 'crypto';

/**
 * Compares two Uint8Array values lexicographically.
 * @param a First Uint8Array
 * @param b Second Uint8Array
 * @returns Negative if a < b, positive if a > b, 0 if equal
 */
function compareUint8(a: Uint8Array, b: Uint8Array): number {
  if (a.length !== b.length) return a.length - b.length;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

/**
 * A single Merkle proof node: sibling hash + its position.
 * @property sibling The sibling node's hash
 * @property position The sibling's position relative to the current node ('left' or 'right')
 */
export type ProofNode = {
  sibling: Uint8Array;
  position: 'left' | 'right';
};

/**
 * Hashes a pair of Uint8Array values using SHA-256.
 * @param a First value
 * @param b Second value
 * @returns The hash of the concatenated values
 */
function hashPair(a: Uint8Array, b: Uint8Array): Uint8Array {
  const hash = createHash('sha256');
  hash.update(a);
  hash.update(b);
  return new Uint8Array(hash.digest());
}

/**
 * Options for Merkle tree operations.
 */
export type MerkleOptions = {
  /** If true, sort each pair before hashing (default: true) */
  sort?: boolean;
  /** If true, duplicate the last odd node to make pairs (default: true) */
  pad?: boolean;
};

/**
 * Compute the Merkle root for a list of leaves.
 * @param leaves Array of leaf hashes (Uint8Array)
 * @param options Options for sorting and padding
 * @returns The Merkle root hash as a Uint8Array
 * @throws If leaves array is empty
 */
export function computeMerkleRoot(
  leaves: Uint8Array[],
  options?: MerkleOptions
): Uint8Array {
  if (leaves.length === 0) throw new Error('No leaves');
  const sort = options?.sort !== false;
  const pad = options?.pad !== false;
  let nodes = leaves.slice();
  while (nodes.length > 1) {
    const next: Uint8Array[] = [];
    for (let i = 0; i < nodes.length; i += 2) {
      let left = nodes[i];
      let right = nodes[i + 1];
      if (right === undefined) {
        if (pad) right = left;
        else {
          next.push(left);
          continue;
        }
      }
      if (sort && compareUint8(left, right) > 0) [left, right] = [right, left];
      next.push(hashPair(left, right));
    }
    nodes = next;
  }
  return nodes[0];
}

/**
 * Generate a Merkle proof for a given leaf index.
 * @param leaves Array of leaf hashes (Uint8Array)
 * @param index Index of the leaf to prove
 * @param options Options for sorting and padding
 * @returns Array of ProofNode objects
 * @throws If index is out of bounds
 */
export function computeMerkleProof(
  leaves: Uint8Array[],
  index: number,
  options?: MerkleOptions
): ProofNode[] {
  if (index < 0 || index >= leaves.length) throw new Error('Invalid leaf index');
  const sort = options?.sort !== false;
  const pad = options?.pad !== false;
  let nodes = leaves.slice();
  let idx = index;
  const proof: ProofNode[] = [];
  while (nodes.length > 1) {
    const next: Uint8Array[] = [];
    for (let i = 0; i < nodes.length; i += 2) {
      let left = nodes[i];
      let right = nodes[i + 1];
      if (right === undefined) {
        if (pad) right = left;
        else {
          next.push(left);
          continue;
        }
      }
      let pair = [left, right];
      if (sort && compareUint8(left, right) > 0) pair = [right, left];
      // If our index is in this pair, record the sibling
      if (i === idx || i + 1 === idx) {
        const isLeft = idx % 2 === 0;
        const sibling = isLeft ? right : left;
        proof.push({ sibling, position: isLeft ? 'right' : 'left' });
        idx = Math.floor(i / 2);
      }
      next.push(hashPair(pair[0], pair[1]));
    }
    nodes = next;
  }
  return proof;
}

/**
 * Verify that a given leaf + proof yields the expected root.
 * @param leaf The leaf hash
 * @param proof Array of sibling nodes (ProofNode[])
 * @param root The expected Merkle root
 * @param options Options for sorting
 * @returns `true` if the proof is valid, else `false`
 */
export function verifyMerkleProof(
  leaf: Uint8Array,
  proof: ProofNode[],
  root: Uint8Array,
  options?: Pick<MerkleOptions, 'sort'>
): boolean {
  let hash = leaf;
  const sort = options?.sort !== false;
  for (const node of proof) {
    let pair: [Uint8Array, Uint8Array];
    if (node.position === 'left') pair = [node.sibling, hash];
    else pair = [hash, node.sibling];
    if (sort && compareUint8(pair[0], pair[1]) > 0) pair = [pair[1], pair[0]];
    hash = hashPair(pair[0], pair[1]);
  }
  return compareUint8(hash, root) === 0;
}
