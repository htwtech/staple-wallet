# Tria CoreSDK integration

This app uses **Tria CoreSDK** for account creation and authentication, with **multi-chain** support (EVM: Ethereum, Polygon, Fuse, Arbitrum, Optimism, BNB, Avalanche, Sepolia, Amoy, etc.).

**Without the real Tria package**, the app runs with a **stub** (`src/lib/tria-auth-stub.tsx`): "Log In" simulates login with a zero address; sends and balances are placeholders. To use the real SDK: get access, install the packages, then **remove the `resolve.alias` block** in `vite.config.ts` and the **`paths`** entry for `@tria-sdk/authenticate-react` in `tsconfig.app.json`.

## 1. Request access

Tria is **invite-only**. Request access: https://form.typeform.com/to/ykRIDDfc

## 2. Get credentials

- **Analytics keys** (for the app): sign up at https://terminal.tria.so/ and get `clientId` and `projectId`.
- **NPM token** (for installing packages): use the token provided in Tria docs (e.g. for Vercel they mention `NPM_TOKEN`). You need it to install `@tria-sdk/authenticate-react`, `@tria-sdk/connect`, `@tria-sdk/utils`.

## 3. Install dependencies

```bash
# Option A: if Tria gave you a registry URL and token, create .npmrc:
# @tria-sdk:registry=https://...
# //registry.npmjs.org/:_authToken=${NPM_TOKEN}

export NPM_TOKEN=your_token_from_tria
pnpm install
```

If install fails with 404 for `@tria-sdk/*`, the packages are in a private registry; add the registry URL and auth to `.npmrc` as Tria instructs.

## 4. Environment variables

Copy `.env.example` to `.env.local` and set:

- `VITE_TRIA_CLIENT_ID` – from terminal.tria.so
- `VITE_TRIA_PROJECT_ID` – from terminal.tria.so
- `VITE_TRIA_ENV` – `mainnet` or `testnet`

## 5. Supported networks

Configured in `src/config/networks.ts`. Tria chainNames: ETH, POLYGON, FUSE, ARBITRUM, OPTIMISM, AVALANCHE, BINANCE, SEPOLIA, AMOY, etc. You can add or remove networks there.

## Docs

- https://docs.tria.so/coresdk
- https://docs.tria.so/getting-started
- https://docs.tria.so/supported-networks
