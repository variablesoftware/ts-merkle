/**
 * Merkle Tree stress test (shortened).
 *
 * @module tests/stress.test
 * @see ../src/index.ts
 */
import { computeMerkleRoot, computeMerkleProof, verifyMerkleProof } from '../src';
import { describe, it, expect } from 'vitest';

function randomLeaf(size = 32): Uint8Array {
  const arr = new Uint8Array(size);
  for (let i = 0; i < size; i++) arr[i] = Math.floor(Math.random() * 256);
  return arr;
}

describe('Merkle Tree stress test', () => {
  it('should handle long chains and repeated verification for ~7 seconds', async () => {
    const start = Date.now();
    let iterations = 0;
    let maxLen = 0;
    while (Date.now() - start < 7000) {
      const len = Math.floor(Math.random() * 200) + 100;
      maxLen = Math.max(maxLen, len);
      const leaves = Array.from({ length: len }, () => randomLeaf());
      const root = computeMerkleRoot(leaves);
      for (let i = 0; i < leaves.length; i++) {
        const proof = computeMerkleProof(leaves, i);
        if (!verifyMerkleProof(leaves[i], proof, root)) {
          throw new Error(`Verification failed at index ${i} (iteration ${iterations})`);
        }
      }
      iterations++;
    }
    console.log(`Stress test completed: ${iterations} iterations, max chain length: ${maxLen}`);
    expect(iterations).toBeGreaterThan(0);
  }, 90000); // Set timeout to 90 seconds
});
