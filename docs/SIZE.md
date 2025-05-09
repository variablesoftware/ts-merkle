# Merkle Tree Library Size & Performance 📏⚡

## Bundle Size Comparison

| Library           | Minified Size | Gzipped Size |
|-------------------|--------------|--------------|
| ts-merkle 🌳      | ~4 KB        | ~1.5 KB      |
| merkletreejs 🪵   | ~30 KB       | ~10 KB       |
| merkle-lib 🧱     | ~7 KB        | ~2.5 KB      |

*Numbers are approximate. See [bundlephobia.com](https://bundlephobia.com/) for latest.*

## Performance
- `ts-merkle` is optimized for batch proof generation and verification.
- See [../tests/stress.test.ts](../tests/stress.test.ts) for stress test results.

## Emoji Legend
- 🌳: This library
- 🪵: [merkletreejs](https://github.com/miguelmota/merkletreejs)
- 🧱: [merkle-lib](https://github.com/bitcoinjs/merkle-lib)
