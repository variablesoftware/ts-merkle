# Merkle Tree Library Comparison 🤝

## Libraries Compared
- 🌳 **ts-merkle** (this library)
- 🪵 **merkletreejs** ([npm](https://www.npmjs.com/package/merkletreejs))
- 🧱 **merkle-lib** ([npm](https://www.npmjs.com/package/merkle-lib))

## API Comparison

| Feature                | ts-merkle 🌳 | merkletreejs 🪵 | merkle-lib 🧱 |
|------------------------|:-----------:|:--------------:|:------------:|
| TypeScript native      | ✅           | ⚠️ (types)      | ❌           |
| SHA-256 support        | ✅           | ✅              | ✅           |
| Custom hash functions  | ✅           | ✅              | ✅           |
| Proof generation       | ✅           | ✅              | ✅           |
| Padding (odd leaves)   | ✅           | ⚠️ (optional)   | ❌           |
| Sorting pairs          | ✅           | ✅              | ❌           |
| Bundle size            | 🥇 Smallest  | Large           | Medium       |

## Example: Cross-library root check

```ts
import { computeMerkleRoot } from '@variablesoftware/ts-merkle';
import { MerkleTree } from 'merkletreejs';
import { createHash } from 'crypto';

const leaves = [Buffer.from('a'), Buffer.from('b'), Buffer.from('c')];
const ourRoot = computeMerkleRoot(leaves.map(l => new Uint8Array(l)), { sort: true, pad: false });
const mt = new MerkleTree(leaves, x => createHash('sha256').update(x).digest(), { sortPairs: true });
console.log('Roots match?', Buffer.from(ourRoot).equals(mt.getRoot()));
```

## See also
- [USAGE.md](./USAGE.md)
- [SIZE.md](./SIZE.md)
