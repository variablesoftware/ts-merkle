# ts-merkle Usage & API 🍃

## Basic Usage

```ts
import { computeMerkleRoot, computeMerkleProof, verifyMerkleProof } from '@variablesoftware/ts-merkle';

const leaves = [
  new Uint8Array([1]),
  new Uint8Array([2]),
  new Uint8Array([3]),
  new Uint8Array([4])
];
const root = computeMerkleRoot(leaves);
const proof = computeMerkleProof(leaves, 2);
const isValid = verifyMerkleProof(leaves[2], proof, root);
console.log('Proof valid?', isValid); // true
```

## Options
- `sort`: Sort pairs before hashing (default: true)
- `pad`: Duplicate last node if odd (default: true)

## See [../README.md](../README.md) for more.
