# Post-audit engineering issues (1–30)

**Fast path:** [COPY_PASTE_FOR_GITHUB.md](./COPY_PASTE_FOR_GITHUB.md) has every title, label list, and body ready to paste into GitHub’s issue form.

Work items for **code health** (auth, config, performance, documentation) that came out of an internal audit. They complement the [product backlog](../backlog/README.md) (feature delivery, issues 1–50).

| # | Title |
|---|--------|
| 1 | [Implement Next.js middleware for /dashboard and /login](001-implement-next-middleware-auth-redirects.md) |
| 2 | [Unify duplicate AuthContext implementations](002-unify-auth-context-implementations.md) |
| 3 | [Remove nested AuthProvider from DashboardShell](003-remove-duplicate-authprovider-dashboard-shell.md) |
| 4 | [Consolidate /login and /(auth)/signin into one user journey](004-consolidate-login-routes.md) |
| 5 | [Single source of truth: Tailwind v4 @theme vs tailwind.config.ts](005-single-source-design-tokens.md) |
| 6 | [Reconcile :root variables in globals with component classes](006-reconcile-css-variables-tokens.md) |
| 7 | [CI: validate package.json and tsconfig.json on every PR](007-ci-validate-config-json.md) |
| 8 | [Regenerate lockfile and document install for Next + SWC](008-lockfile-health-contributor-docs.md) |
| 9 | [Add .env.example and validate src/lib/env.ts in development](009-env-example-runtime-validation.md) |
| 10 | [Unify /api/* JSON error shape and HTTP status codes](010-api-routes-consistent-error-envelope.md) |
| 11 | [Single isAuthenticated / session read for middleware and ProtectedRoute](011-auth-guard-single-helper.md) |
| 12 | [Harden error and loading UX when /api/portfolio and related fetches fail](012-dashboard-fetch-error-ux.md) |
| 13 | [TransactionFlow: recovery UX when /api/transactions fails](013-transaction-flow-api-failure-ux.md) |
| 14 | [Lazy-load Recharts on dashboard for smaller initial bundles](014-lazy-load-recharts.md) |
| 15 | [Run or document qa:visual-baseline and Playwright in CI or locally](015-playwright-visual-baseline-ci.md) |
| 16 | [Triage next/no-img-element and react-hooks/exhaustive-deps warnings](016-eslint-cleanup-warnings.md) |
| 17 | [Upgrade Next.js to a current patched 14.x release](017-upgrade-next-security-release.md) |
| 18 | [Document Stellar wallet localStorage keys and WalletProvider behavior](018-document-wallet-localstorage-keys.md) |
| 19 | [i18n: replace remaining hard-coded English in dashboard and settings](019-i18n-hardcoded-strings-audit.md) |
| 20 | [Align cookie consent storage keys and settings page labels](020-cookie-consent-storage-alignment.md) |
| 21 | [Harden or hide /dashboard/sandbox in production](021-sandbox-route-production-safety.md) |
| 22 | [Global search: debounce, empty, and error states](022-global-search-debounce-empty-states.md) |
| 23 | [History and audit: handle large mock datasets in the UI](023-history-virtualization-or-pagination.md) |
| 24 | [Accessibility: landmarks, headings, and focus in dashboard shell](024-a11y-dashboard-landmarks.md) |
| 25 | [Theme: reduce first-paint flash and document persistence keys](025-theme-FOUC-mitigation.md) |
| 26 | [Route metadata: keep `routeMetadata` aligned with App Router files](026-sync-breadcrumbs-route-metadata.md) |
| 27 | [Unify `User` type: mock-auth, `types/index`, and API responses](027-unify-user-type-definitions.md) |
| 28 | [npm audit: triage and policy for transitive Stellar/WalletConnect issues](028-npm-audit-triage-policy.md) |
| 29 | [Add unit tests for formatters, date filter, and list logic](029-unit-tests-formatters-and-hooks.md) |
| 30 | [README: provider tree, data flow, and Stellar testnet assumptions](030-readme-architecture-and-stellar.md) |

## How to use

1. **GitHub UI:** Create a new issue, set the title to match the `title` field in the file front matter, add the suggested labels, then paste the Markdown *below* the `---` YAML block as the description.

2. **GitHub CLI:**
   ```bash
   # Example: body without YAML (adjust path)
   tail -n +7 .github/audit-issues/001-implement-next-middleware-auth-redirects.md | gh issue create -t 'Implement Next.js middleware for /dashboard and /login' -l 'middleware' -F -
   ```

3. **Bulk** — A maintainer can script `gh` over all 30 files if labels exist in the repo first.

See [ISSUES.md](../ISSUES.md) for link to issue templates and backlog index.
