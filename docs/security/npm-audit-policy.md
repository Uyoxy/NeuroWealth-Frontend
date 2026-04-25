# npm audit triage policy for Stellar and wallet dependencies

## Snapshot

- Reviewed on: `2026-04-24`
- Command: `corepack yarn audit --json`
- Summary: `3 critical`, `10 high`, `11 moderate`, `6 low`
- Current direct framework risk is concentrated in `next@14.2.3`
- Current wallet-stack risk is concentrated under `@creit.tech/stellar-wallets-kit@1.9.5`
- `yarn.lock` still pulls `@walletconnect/modal@2.6.2` and `@walletconnect/sign-client@2.11.2`, but this audit snapshot did not report separate `@walletconnect/*` advisories. The actionable wallet findings came from sibling transitive packages in the same SDK tree.

## Policy

- Do not run `npm audit fix --force` or any equivalent breaking upgrade without maintainer sign-off.
- Treat direct dependencies with patched releases as `must-fix`, especially framework and auth-routing packages.
- Treat transitive wallet findings as one of: `must-fix now`, `accepted temporary risk`, or `monitor only`. Every accepted risk needs a reason and a review date.
- Prefer this order of remediation:
  1. Patch or minor upgrade the direct dependency.
  2. Add a targeted override or resolution only after build, typecheck, tests, and wallet smoke checks pass.
  3. If no safe override exists, open or link an upstream issue and schedule a review instead of forcing the tree.

## Current decisions

| Package path | Severity | Decision | Reason | Next action |
| --- | --- | --- | --- | --- |
| `next@14.2.3` | `critical/high/moderate/low` | `must-fix` | This is a direct dependency and the audit reports multiple patched releases on the stable `14.2.x` line, including `14.2.35`. | Open a follow-up upgrade PR to `next@14.2.35` and rerun build plus auth route QA. |
| `next > postcss@8.4.31` | `moderate` | `must-fix with Next upgrade` | The reported `postcss` issue is coming through `next`, so a framework upgrade is safer than overriding `postcss` alone. | Resolve together with the `next` upgrade PR. |
| `@creit.tech/stellar-wallets-kit > @trezor/connect-web > @trezor/connect > @trezor/protobuf > protobufjs@7.4.0` and `... > @trezor/transport > @trezor/protobuf > protobufjs@7.4.0` | `critical` | `accepted temporary risk` | The advisory requires attacker-controlled protobuf definitions. This app does not define or decode custom protobuf schemas itself, but the dependency sits in a security-sensitive wallet tree and should not be ignored. | Keep wallet scope limited, ask upstream maintainers for a patched tree or compatible override, and review again within 7 days. |
| `@creit.tech/stellar-wallets-kit > @hot-wallet/sdk > @solana/web3.js > jayson > uuid` and `... > rpc-websockets > uuid` | `moderate` | `accepted temporary risk` | The finding is a buffer-bounds issue in transitive UUID helpers, not a directly invoked application surface in the current Stellar flows. | Recheck on the next wallet SDK bump and prefer an upstream dependency refresh over a forced override. |
| `@creit.tech/stellar-wallets-kit > ... > elliptic@6.6.1` | `low` | `monitor only` | The advisory currently lists no patched version recommendation. Forcing replacements here is higher risk than the reported low-severity issue. | Track upstream maintainer guidance and rerun audit on each wallet SDK update. |

## Review cadence

- Re-run `yarn audit --json` on every dependency upgrade PR that touches `next`, wallet SDKs, or auth/middleware code.
- Re-review accepted wallet risks within 7 days while `@creit.tech/stellar-wallets-kit` remains in use.
- Do a full audit at least monthly until the direct `next` findings are cleared.

## PR QA checklist for dependency triage changes

- `yarn typecheck`
- `yarn test`
- `yarn build`
- Smoke test `/login`, `/dashboard`, `/dashboard/settings/security`, and wallet-connect entry points after any dependency upgrade
