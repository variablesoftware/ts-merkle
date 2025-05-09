/**
 * Merkle Tree edge case tests.
 *
 * @module tests/edgecases.test
 * @see ../src/index.ts
 */
import { describe, it, expect } from 'vitest';
import { computeMerkleRoot, computeMerkleProof, verifyMerkleProof } from '../src';

describe('Merkle Tree edge cases', () => {
  it('should throw if leaves array is empty', () => {
    expect(() => computeMerkleRoot([])).toThrow();
    expect(() => computeMerkleProof([], 0)).toThrow();
  });

  it('should throw if proof index is out of bounds', () => {
    const leaves = [new Uint8Array([1]), new Uint8Array([2])];
    expect(() => computeMerkleProof(leaves, -1)).toThrow();
    expect(() => computeMerkleProof(leaves, 2)).toThrow();
  });

  it('should handle duplicate leaves', () => {
    const leaves = [new Uint8Array([1]), new Uint8Array([1]), new Uint8Array([1])];
    const root = computeMerkleRoot(leaves);
    for (let i = 0; i < leaves.length; i++) {
      const proof = computeMerkleProof(leaves, i);
      expect(verifyMerkleProof(leaves[i], proof, root)).toBe(true);
    }
  });

  it('should handle large leaves (256 bytes)', () => {
    const leaves = [
      new Uint8Array(256).fill(1),
      new Uint8Array(256).fill(2),
      new Uint8Array(256).fill(3)
    ];
    const root = computeMerkleRoot(leaves);
    for (let i = 0; i < leaves.length; i++) {
      const proof = computeMerkleProof(leaves, i);
      expect(verifyMerkleProof(leaves[i], proof, root)).toBe(true);
    }
  });
});
