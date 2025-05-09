/**
 * Merkle Tree odd leaves tests.
 *
 * @module tests/oddleaves.test
 * @see ../src/index.ts
 */
import { describe, it, expect } from 'vitest';
import { computeMerkleRoot, computeMerkleProof, verifyMerkleProof } from '../src';

describe('Merkle Tree odd number of leaves', () => {
  it('should handle odd number of leaves (with and without padding)', () => {
    const leaves = [new Uint8Array([1]), new Uint8Array([2]), new Uint8Array([3])];
    // With padding (default)
    const rootPad = computeMerkleRoot(leaves);
    for (let i = 0; i < leaves.length; i++) {
      const proof = computeMerkleProof(leaves, i);
      expect(verifyMerkleProof(leaves[i], proof, rootPad)).toBe(true);
    }
    // Without padding: only first (leaves.length - 1) leaves are provable
    const rootNoPad = computeMerkleRoot(leaves, { pad: false });
    for (let i = 0; i < leaves.length - 1; i++) {
      const proof = computeMerkleProof(leaves, i, { pad: false });
      expect(verifyMerkleProof(leaves[i], proof, rootNoPad, { sort: true })).toBe(true);
    }
  });
});
