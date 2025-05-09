# @variablesoftware/ts-merkle 🌳🔗🛡️

> 🌳🔗🛡️ A lightweight, fast, and auditable TypeScript library for creating and verifying Merkle trees.

- ⚡ **Fast**: Minimal dependencies, optimized for performance
- 🧩 **Interoperable**: Compatible with popular libraries like `merkletreejs`
- 🔒 **Secure**: Uses SHA-256 and strong cryptographic primitives
- 🧪 **Well-tested**: Robust test suite with edge cases, stress, and cross-library checks

## Install

```sh
yarn add @variablesoftware/ts-merkle
# or
npm install @variablesoftware/ts-merkle
```

## Usage

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

## Features
- Merkle root computation (with/without padding, sorting)
- Proof generation and verification
- Cross-library compatibility (see docs/)
- Fully typed, TSDoc documented

## See Also
- [docs/](./docs/) for advanced usage, benchmarks, and comparisons
- [tests/](./tests/) for robust test coverage

---

## Badges

[![Test Suite](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/variablesoftware/template/actions)
[![NPM version](https://img.shields.io/npm/v/@variablesoftware/template?style=flat-square)](https://www.npmjs.com/package/@variablesoftware/template)
[![License](https://img.shields.io/github/license/variablesoftware/template?style=flat-square)](https://github.com/variablesoftware/template/blob/main/LICENSE.txt)

---

## 📄 License

MIT © Rob Friedman / Variable Software

---

> Built with ❤️ by [@variablesoftware](https://github.com/variablesoftware)  
> Thank you for downloading and using this project. Pull requests are warmly welcomed!

---

## 🌐 Inclusive & Accessible Design

- Naming, logging, error messages, and tests avoid cultural or ableist bias
- Avoids assumptions about input/output formats or encodings
- Faithfully reflects user data — no coercion or silent transformations
- Designed for clarity, predictability, and parity with underlying platforms (e.g., Cloudflare APIs)
- Works well in diverse, multilingual, and inclusive developer environments

---

Made with ❤️ by Variable Software
