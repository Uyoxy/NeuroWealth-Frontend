# NeuroWealth — Frontend

This repository contains the Next.js frontend for NeuroWealth. It's a demo-ready frontend with mock authentication, UI components, and client-side adapters that let the app run without a backend.

**Assumptions**: This frontend targets the **Stellar testnet** by default (`NEXT_PUBLIC_STELLAR_NETWORK=testnet`). For production, configure `NEXT_PUBLIC_STELLAR_NETWORK=mainnet` and provide a real API backend via `NEUROWEALTH_API_BASE_URL`.

## Quick start

Requirements: Node.js 20+, Yarn (Corepack supported)

Install and run:

```bash
yarn install
yarn dev
```

Run tests:

```bash
yarn test
```

Inspect bundle size locally:

```bash
yarn analyze
```

This runs a production build with the Next.js bundle analyzer enabled via `ANALYZE=true`.
The report is written under `.next/analyze/`, which is already ignored by git.

Use this command when checking for bundle regressions before merging. We do not run it in CI
because analyzer builds are slower than the normal test/lint/build pipeline.

## What this repo contains

- Next.js 14 app under `src/app`
- Client-side mock auth (`src/lib/mock-auth.ts`) that persists an in-browser session in `localStorage` and mirrors it to a non-httpOnly cookie so `middleware.ts` can perform edge-side redirects.
- Edge middleware (`middleware.ts`) that protects routes under `/dashboard`, `/profile`, and `/settings` and redirects unauthenticated users to `/login?from=...`.
- Tests using the Node test runner (match: `src/**/*.test.ts`).

## Folder structure

```
src/
├── app/                   # Next.js App Router — routes and layouts
│   ├── (auth)/            # Auth-gated route group (login, onboarding)
│   ├── (errors)/          # Standalone error pages (401 unauthorized, 403 forbidden)
│   ├── api/               # Route handlers
│   ├── dashboard/         # Protected dashboard shell and sub-routes
│   │   ├── dev-errors/    # Dev-only error trigger routes (hidden in production)
│   │   ├── portfolio/
│   │   ├── activity/
│   │   ├── strategy/
│   │   └── settings/
│   ├── not-found.tsx      # Global 404 page
│   └── error.tsx          # Global 500 / uncaught error boundary
├── components/            # Shared UI components (ui/, dashboard/, auth/, layout/)
├── features/              # Feature-scoped logic co-located with its UI
├── hooks/                 # Reusable React hooks
├── lib/                   # Pure utilities, constants, and adapters
│   ├── mock-auth.ts       # Client-side mock auth session
│   ├── auth-constants.ts  # Canonical storage/cookie key names
│   └── …
└── types/                 # Shared TypeScript types and interfaces
```

TypeScript strict mode is enabled (`tsconfig.json` → `"strict": true`).
Lint runs via `yarn lint` (ESLint + `eslint-config-next`).

## Environment variables

See `docs/env.md` for the full variable reference, including the public/server-only split,
Edge middleware constraints, and runtime validation notes.

## Provider tree & data flow

The React provider tree is composed in `src/components/ClientProviders.tsx` in the following order (outer to inner):

```
ClientProviders
├── SandboxProvider          # Dev-only error trigger context
├── ThemeProvider            # Dark/light theme with localStorage persistence
├── I18nProvider             # Internationalization & locale state
├── AuthProvider             # User session: localStorage ↔ cookie sync
├── WalletProvider           # Stellar wallet connection (network-aware)
├── ToastProvider            # Toast notifications & alerts
└── CookieConsentProvider    # Privacy & cookie banner state
    └── ErrorTrackingMount   # Global error tracking (unhandledrejection, window errors)
        └── children
            └── CookieBanner, PrivacyModal
```

**Provider order matters**: Each provider depends on layers below it. For example, `ThemeProvider` is initialized before `AuthProvider` so theme preferences load before the user checks authentication.

### Key data flows

1. **Authentication**:
   - User signs in via `/login` → `AuthContext.signIn()` → `mock-auth.ts` creates session
   - Session stored in `localStorage` (key: `SESSION_STORAGE_KEY`)
   - Session mirrored to httpOnly cookie (key: `SESSION_COOKIE_NAME`) for middleware
   - Middleware (`middleware.ts`) reads cookie to redirect unauth users
   - Sign-in on other tabs triggers `storage` event → all tabs sync

2. **Stellar wallet integration**:
   - `WalletProvider` resolves network based on `NEXT_PUBLIC_STELLAR_NETWORK` env (testnet/mainnet)
   - Horizon URL configurable via `NEXT_PUBLIC_STELLAR_HORIZON_URL` (falls back to public nodes)
   - `useWallet()` hook provides wallet state and account info

3. **API requests**:
   - Browser → Next.js `/api/*` routes: authenticated via httpOnly cookie (no extra header needed)
   - Next.js → Real backend: use `createServerApiClient()` in route handlers to inject Bearer token (from `NEUROWEALTH_API_AUTH_TOKEN` env)
   - All responses must conform to the standard envelope (see NEUROWEALTH_API.md)
   - Demo mode (no backend): all `/api/*` routes return mock data

4. **Internationalization**:
   - Active locale stored in `localStorage` (key from `auth-constants.ts`)
   - `dictionaries` map locale codes to message objects
   - All formatters (`formatCurrency`, `formatDate`, etc.) use `getActiveIntlLocale()` for locale-aware output

5. **Theme**:
   - Light/dark mode persisted to `localStorage`
   - CSS variables injected into `:root` for tailwind theming
   - `ThemeProvider` initializes before auth so theme loads without flash

## Auth syncing note

The mock auth flow stores the session in `localStorage` using `SESSION_STORAGE_KEY` and mirrors it into a cookie named `SESSION_COOKIE_NAME`. This allows the browser UI and Next.js middleware to agree on authentication state in demo setups. See `src/lib/auth-constants.ts` for the canonical values.

## Contributing

- Follow existing patterns for components and hooks.
- Tests live next to logic under `src/` and run via `yarn test`.
- For bundle-size checks, run `yarn analyze` locally and review the generated report before
  changing code that affects route or vendor bundles.

## License

Internal/demo project — see repository owner for license details.
