# ZIN Project Website

Public, mobile-responsive informational website for the ZIN experimental blockchain project.

**Live website:** https://selvaganapathir.github.io/Zin-website/

## Publish with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`.
4. Save and wait for the Pages deployment workflow to finish.

## Website files

- `index.html` — site content, SEO metadata and structured data
- `styles.css` — responsive styling
- `script.js` — accessible mobile navigation and footer year
- `assets/favicon.svg` — site icon
- `robots.txt` and `sitemap.xml` — search crawler guidance
- `docs/ROADMAP.md` — public engineering roadmap
- `docs/ANALYTICS-SETUP.md` — analytics and Search Console setup
- `tools/check_site.py` — dependency-free static checks
- `.github/workflows/site-checks.yml` — automated checks on pushes and pull requests

## Search visibility

The homepage includes a canonical URL, search description, Open Graph/Twitter preview metadata and basic WebSite structured data. The sitemap is available at:

https://selvaganapathir.github.io/Zin-website/sitemap.xml

Submit that sitemap through Google Search Console after verifying ownership. Search engines decide whether and when to index pages; metadata and sitemap submission do not guarantee rankings.

## Analytics

No visitor tracking is installed by default. See [docs/ANALYTICS-SETUP.md](docs/ANALYTICS-SETUP.md) for a privacy-conscious setup path. Add a provider only after creating the account and reviewing applicable privacy requirements.

## Accuracy and safety

This site intentionally describes ZIN as an early-stage experimental project. It does not claim that a production blockchain node, peer-to-peer network, mining, public testnet, mainnet, or production wallet exists. Do not advertise a token for sale or invite users to send funds. Update the project status only when implementation and testing evidence supports the change.

The website is a separate public repository. Keep private source code, credentials, API keys, private keys, wallet recovery phrases and confidential material out of this repository.

## External font

The design uses Google Fonts (DM Sans and Space Grotesk) when available. The site remains readable with local sans-serif fallbacks.
