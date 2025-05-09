/**
 * Merkle Tree randomized roundtrip tests.
 *
 * @module tests/randomized.test
 * @see ../src/index.ts
 */
import { describe, it, expect } from 'vitest';
import { computeMerkleRoot, computeMerkleProof, verifyMerkleProof } from '../src';

describe('Merkle Tree randomized roundtrip', () => {
  it('should pass randomized roundtrip tests', () => {
    for (let trial = 0; trial < 10; trial++) {
      const leafCount = Math.floor(Math.random() * 20) + 2;
      const leaves = Array.from({ length: leafCount }, () => {
        const arr = new Uint8Array(32);
        for (let i = 0; i < 32; i++) arr[i] = Math.floor(Math.random() * 256);
        return arr;
      });
      const root = computeMerkleRoot(leaves);
      for (let i = 0; i < leaves.length; i++) {
        const proof = computeMerkleProof(leaves, i);
        expect(verifyMerkleProof(leaves[i], proof, root)).toBe(true);
      }
    }
  });
});
