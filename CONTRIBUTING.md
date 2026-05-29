# Contributing

## Package manager

This repo uses **Yarn 1** (`yarn.lock` is canonical). Enable Corepack or install
Yarn 1.22.x, then:

```bash
yarn install
yarn lint
yarn typecheck
```

Do not commit `package-lock.json` or `npm-shrinkwrap.json`.

## Hook imports (auth + wallet)

Use the `@/contexts` barrel as the single public surface for auth and wallet hooks/providers.

Allowed:
- `import { useAuth, useWallet, useWalletConfig, AuthProvider, WalletProvider } from "@/contexts";`

Disallowed:
- `@/context/AuthContext`
- `@/contexts/AuthContext`
- `@/contexts/WalletProvider`

This is enforced in ESLint via `no-restricted-imports`.

## Optional: pre-commit lint with lint-staged + Husky

`yarn lint` is the source of truth and runs in CI. Husky and lint-staged are
committed so hooks install automatically after `yarn install` (via the
`prepare` script). The hook is **optional** in practice — skip it when needed.

Staged-file rules live in `.lintstagedrc` at the repo root (ESLint via
`next lint --fix --file` on changed sources only).

### Skipping the hook

```bash
git commit --no-verify -m "wip: skip pre-commit"
```

### Why not mandatory?

Mandatory hooks slow down contributors on large changesets and can block
emergency commits. CI (`yarn lint`) is the enforced gate; run `yarn typecheck`
locally before pushing when you change types.
