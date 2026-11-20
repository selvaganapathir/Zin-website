# ZIN — Experimental Blockchain Project

<div align="center">

**A mobile-first blockchain experiment, built in the open.**

[🌐 Open the ZIN website](https://selvaganapathir.github.io/Zin-website/) · [👛 Demo wallet](https://selvaganapathir.github.io/Zin-website/wallet.html) · [⛏️ Testnet explorer](https://selvaganapathir.github.io/Zin-website/explorer.html)

</div>

---

## Explore ZIN

The public ZIN website is the starting point for the project. It explains the vision, technical direction, engineering roadmap and current development status.

| Experience | What it does |
| --- | --- |
| **Project website** | Project overview, roadmap and development status |
| **Demo wallet** | Browser-local demo wallet with an encrypted vault and recovery phrase |
| **Testnet explorer** | Inspect locally stored demo blocks, transactions and mining activity |
| **Mining simulator** | Adjust proof-of-work difficulty and mine demo blocks |

## Important: experimental demo

The wallet and testnet explorer are browser-side educational simulations. They do **not** connect to a shared peer-to-peer network, and their data is stored in the current browser on the current device. Different visitors do not share a ledger. Clearing browser storage can remove local demo data.

- Demo credits have no monetary value.
- Do not send funds to these pages.
- Never reuse a real cryptocurrency recovery phrase or password.
- The ZIN demo recovery phrase is a project-specific local recovery mechanism, not a BIP-39 wallet phrase and not suitable for real assets.
- Mining demonstrates proof-of-work mechanics; it does not mine a live ZIN coin.

The separate blockchain implementation is maintained in the private [ZIN blockchain repository](https://github.com/selvaganapathir/zin-blockchain).

## Website development

This is the public GitHub Pages repository. The site is deployed from the `main` branch root.

- `index.html` — public project homepage
- `wallet.html`, `wallet.js`, `wallet.css` — browser-local demo wallet
- `explorer.html`, `explorer.js`, `explorer.css` — local testnet and mining simulator
- `styles.css`, `script.js` — homepage styling and navigation
- `docs/ROADMAP.md` — engineering roadmap
- `.github/workflows/site-checks.yml` — automated static checks

## Development and contributions

Browse the [website source](https://github.com/selvaganapathir/Zin-website), report issues, and follow the [blockchain engineering work](https://github.com/selvaganapathir/zin-blockchain/pulls).

---

**ZIN Project · Experimental development · No live coin or public network is offered.**
