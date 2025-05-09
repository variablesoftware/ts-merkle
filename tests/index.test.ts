/**
 * Merkle Tree basic unit tests.
 *
 * @module tests/index.test
 * @see ../src/index.ts
 */
import { describe, it, expect } from 'vitest';
import { computeMerkleRoot, computeMerkleProof, verifyMerkleProof } from '../src';

describe('Merkle Tree', () => {
  it('should compute the root for a single leaf', () => {
    const leaf = new Uint8Array([1, 2, 3, 4]);
    const root = computeMerkleRoot([leaf]);
    expect(root).toBeInstanceOf(Uint8Array);
    expect(root.length).toBeGreaterThan(0);
  });

  it('should verify a valid proof', () => {
    const leaves = [
      new Uint8Array([1]),
      new Uint8Array([2]),
      new Uint8Array([3]),
      new Uint8Array([4])
    ];
    const root = computeMerkleRoot(leaves);
    for (let i = 0; i < leaves.length; i++) {
      const proof = computeMerkleProof(leaves, i);
      expect(verifyMerkleProof(leaves[i], proof, root)).toBe(true);
    }
  });

  it('should fail for an invalid proof', () => {
    const leaves = [
      new Uint8Array([1]),
      new Uint8Array([2]),
      new Uint8Array([3]),
      new Uint8Array([4])
    ];
    const root = computeMerkleRoot(leaves);
    const proof = computeMerkleProof(leaves, 0);
    // Tamper with the proof
    proof[0].sibling = new Uint8Array([99]);
    expect(verifyMerkleProof(leaves[0], proof, root)).toBe(false);
  });
});
