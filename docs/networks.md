# Networks

## Current default

The frontend defaults to Stellar testnet. If no network variables are set, wallet connectivity and Horizon requests use:

- Network: `testnet`
- Horizon URL: `https://horizon-testnet.stellar.org`

## Environment variables

Set these in `.env.local` to control the active network:

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Wallet + provider network selector. Supported values: `testnet`, `mainnet`, `public`. | `testnet` |
| `NEXT_PUBLIC_STELLAR_HORIZON_URL` | Optional Horizon endpoint override for the selected network. | `https://horizon-testnet.stellar.org` |

Mainnet example:

```bash
NEXT_PUBLIC_STELLAR_NETWORK=mainnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon.stellar.org
```

## Current phase and scope

Mainnet launch is out of scope for the current frontend milestone. Switching to `mainnet` only changes wallet and Horizon network configuration in the UI layer.

The following flows remain mock or simulation-first in this phase:

- Transaction lifecycle previews in `src/lib/transactions.ts`
- Demo portfolio and service data in `src/lib/mock-services.ts`
- API fallback behavior when backend endpoints are not configured

Treat mainnet usage in this repository as preparation and QA only until a separate mainnet milestone is approved.

## Quick QA steps

1. Set `NEXT_PUBLIC_STELLAR_NETWORK=testnet`, start the app, and confirm the navbar network badge shows `TESTNET` after wallet connection.
2. Switch to `NEXT_PUBLIC_STELLAR_NETWORK=mainnet` with `NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon.stellar.org`, restart, and confirm the badge shows `PUBLIC`.
3. Run deposit and withdrawal UI flows and confirm they still behave as simulated previews in this milestone.
