/**
 * Merkle Tree cross-implementation tests with merkletreejs.
 *
 * @module tests/merkletreejs.test
 * @see ../src/index.ts
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'crypto';
import { computeMerkleRoot } from '../src';
import { MerkleTree } from 'merkletreejs';

function sha256(data: Buffer | Uint8Array): Buffer {
  return createHash('sha256').update(data).digest();
}

describe('Merkle Tree cross-implementation (merkletreejs)', () => {
  it('should match roots with merkletreejs for random leaves', () => {
    for (let trial = 0; trial < 10; trial++) {
      const leafCount = Math.floor(Math.random() * 20) + 2;
      const leaves = Array.from({ length: leafCount }, () => {
        const arr = Buffer.alloc(32);
        for (let i = 0; i < 32; i++) arr[i] = Math.floor(Math.random() * 256);
        return arr;
      });
      // merkletreejs expects Buffers, our implementation uses Uint8Array
      const ourRoot = Buffer.from(computeMerkleRoot(leaves.map(l => new Uint8Array(l)), { sort: true, pad: false }));
      const mt = new MerkleTree(leaves, sha256, { sortPairs: true });
      const theirRoot = mt.getRoot();
      expect(ourRoot.equals(theirRoot)).toBe(true);
    }
  });
});
