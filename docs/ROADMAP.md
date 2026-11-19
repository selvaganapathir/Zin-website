# ZIN project roadmap

This roadmap describes intended engineering stages, not completed functionality or a promise of launch dates. A stage advances only when its acceptance evidence is published.

## 1. Project foundation — in progress

- Maintain a public information website with accurate status disclosures.
- Keep the experimental browser demo clearly separated from any future real-value system.
- Maintain private protocol source separately from the public website.
- Add automated checks for documentation, website metadata and safety wording.

**Exit evidence:** reviewed project specification, reproducible baseline checks and documented threat model.

## 2. Protocol and node implementation — not yet complete

- Specify transaction format, state transitions, consensus assumptions and monetary rules.
- Implement a persistent ledger and deterministic transaction/state validation.
- Implement peer discovery and authenticated peer-to-peer message handling.
- Define chain selection, reorganisation behaviour, replay protection and upgrade rules.
- Create unit, integration, property-based and adversarial tests.

**Exit evidence:** reproducible node build, independent test vectors, multi-node integration tests and documented protocol specification.

## 3. Mobile wallet and public test environment — future

- Design a mobile-first wallet with locally controlled keys and safe recovery UX.
- Keep private keys and recovery phrases out of websites, analytics and server logs.
- Publish a test environment with valueless test tokens and clear reset/finality rules.
- Invite independent node operators and publish monitoring and incident procedures.

**Exit evidence:** reviewed wallet threat model, device testing, multi-operator test network and security review.

## 4. Independent validation and launch decision — future

- Commission independent protocol, node, wallet and infrastructure security reviews.
- Complete performance, failure-recovery, backup/restore and upgrade testing.
- Obtain appropriate legal and compliance advice for intended operating jurisdictions.
- Publish audit findings, remediation status, token/monetary policy and launch criteria.

**Exit evidence:** all critical findings resolved, public test results, documented governance and an explicit go/no-go decision. A mainnet launch is not guaranteed.

## Non-negotiable principles

- No real funds or public token sale during experimental development.
- No claim of decentralisation until independent nodes can verify and maintain the network.
- Protocol changes require review, tests and an explicit governance process.
- Automation may propose changes, but must not independently approve consensus changes or releases.
- Public blockchains expose transaction data; never place personal or confidential information on-chain.
