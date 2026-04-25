# Contributing

## Hook imports (auth + wallet)

Use the `@/contexts` barrel as the single public surface for auth and wallet hooks/providers.

Allowed:
- `import { useAuth, useWallet, useWalletConfig, AuthProvider, WalletProvider } from "@/contexts";`

Disallowed:
- `@/context/AuthContext`
- `@/contexts/AuthContext`
- `@/contexts/WalletProvider`

This is enforced in ESLint via `no-restricted-imports`.
