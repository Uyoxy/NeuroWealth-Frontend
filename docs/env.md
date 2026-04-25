# Environment variables

## Public vs server-only

In Next.js, any variable prefixed with `NEXT_PUBLIC_` is embedded into the client bundle and **must be treated as public**.

- `NEXT_PUBLIC_*`: safe to expose to browsers (URLs, feature flags, non-secrets)
- Non-`NEXT_PUBLIC_*`: server-only secrets/config (API keys, private tokens, encryption keys)

Do not put secrets in `NEXT_PUBLIC_*` variables.

## Variables used by this repository

### Public (browser)

Set these in `.env.local`:

- `NEXT_PUBLIC_WEBHOOK_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STELLAR_NETWORK` (supported: `testnet`, `mainnet`, `public`)
- `NEXT_PUBLIC_STELLAR_HORIZON_URL` (optional override)

Example:

```bash
NEXT_PUBLIC_WEBHOOK_URL=http://localhost:2000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

### Server-only (Node runtime)

These must not be exposed to the browser:

- `NEUROWEALTH_API_BASE_URL` (optional; if not set, the UI uses demo/mock data)
- `NEUROWEALTH_PORTFOLIO_PATH` (optional)
- `NEUROWEALTH_TRANSACTIONS_PATH` (optional)
- `AUTH_SECRET`

## Edge runtime and middleware constraints (future)

If/when this repo introduces Next.js Middleware or Edge Route Handlers, keep in mind:

- Edge runtime does not support all Node.js APIs (e.g. many `crypto` and filesystem patterns)
- Secrets should remain server-only and should never be referenced by client components
- Prefer passing data through server components/route handlers rather than reading secrets in client code

This repository currently assumes a Node.js runtime for any future “real backend” integration.
