# ZIN — Experimental Blockchain Project

<div align="center">

**A mobile-first blockchain project, developed transparently and incrementally.**

[Open the live website](https://selvaganapathir.github.io/Zin-website/) · [Open wallet demo](https://selvaganapathir.github.io/Zin-website/wallet.html) · [Open local testnet explorer](https://selvaganapathir.github.io/Zin-website/testnet.html)

</div>

---

## What visitors should know

This repository contains the **public website** for ZIN. The website is the product-facing entry point; the source repository is for contributors and developers.

- **Website:** project overview, technical direction, roadmap and verified status.
- **Wallet demo:** browser-local encrypted demo wallet, custom demo recovery phrase, transfer queue and proof-of-work block mining.
- **Explorer:** inspect, search, export and import the local test chain saved by the browser.

## Try the browser demo

1. Open the [ZIN wallet](https://selvaganapathir.github.io/Zin-website/wallet.html).
2. Create a password and securely write down the generated 12-word **demo-only** recovery phrase.
3. Queue a test transfer, choose mining difficulty and mine a block.
4. Open the [Testnet Explorer](https://selvaganapathir.github.io/Zin-website/testnet.html) to inspect blocks and transactions.

### Important network limitation

The wallet, proof-of-work miner and explorer currently use browser JavaScript and this site's origin-local browser storage. Data persists in the same browser profile on the same device and can be exported/imported as JSON. **It is not shared between visitors or devices and is not a peer-to-peer blockchain testnet.** A shared testnet requires independently running nodes and a persistent network API/backend; GitHub Pages alone is static hosting.

The recovery phrase is a custom demo format, **not BIP-39**, and does not control real cryptocurrency. Test ZIN has no monetary value. Never enter a real wallet seed phrase or send funds.

## Repository layout

- `index.html`, `styles.css`, `script.js` — public project website
- `wallet.html`, `wallet.css`, `wallet.js` — standalone wallet and local proof-of-work demo
- `testnet.html`, `testnet.js` — local chain explorer and JSON import/export
- `docs/ROADMAP.md` — engineering roadmap
- `.github/workflows/` — automated website and wallet checks

## Development

The public site is deployed through GitHub Pages from `main` at `/(root)`. Automated checks validate static references and wallet wiring.

The protocol implementation remains in the separate private repository: [zin-blockchain](https://github.com/selvaganapathir/zin-blockchain).

---

**Project status:** experimental. A browser demo is not evidence of a deployed public network, production wallet, mainnet or token offering.
