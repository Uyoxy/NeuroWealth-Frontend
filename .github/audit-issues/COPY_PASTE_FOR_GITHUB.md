# Copy-paste into GitHub (Issues 1–30)

For each numbered block below:

1. **New issue** on your repo.
2. Put the line under **Title** in GitHub’s title field.
3. Add the **Labels** (create them in the repo if they do not exist yet).
4. Paste everything from `---` down to the end of that block into the **description** (or skip the `---` line and start at `## Summary`).

---

## 1

**Title:** Implement Next.js middleware for /dashboard and /login

**Labels:** `middleware`, `auth`, `nextjs`, `priority-high`

---

## Summary

The previous `src/proxy.ts` matched middleware shape but was never registered as `middleware.ts`, so route protection relied on client components only.

- Add `middleware.ts` at the project root (or `src/middleware` per your Next 14 layout).
- Read the same session cookie the app uses (`nw-auth-token` or the unified contract after auth unification work).
- Redirect unauthenticated users from `/dashboard/*` to `/login?from=…`.
- Redirect authenticated users from `/login` to `/dashboard` (or your chosen home).
- Use a tight `matcher` for performance; document security assumptions (httpOnly vs client cookie).

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 2

**Title:** Unify duplicate AuthContext implementations

**Labels:** `auth`, `refactor`, `frontend`, `priority-high`

---

## Summary

`src/context/AuthContext.tsx` (cookie + `signIn(token, user)`) and `src/contexts/AuthContext.tsx` (mock `mockAuth` email/password) implement two different session models.

- Choose a single `AuthProvider` (likely the one in `ClientProviders` under `src/contexts/`).
- Expose one `useAuth` contract covering demo sign-in, sign-up, and sign-out.
- Migrate `/login` and `/(auth)/*` to the unified API without breaking the dashboard.
- Document mock vs future real JWT flow in code comments or a short doc if needed.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 3

**Title:** Remove nested AuthProvider from DashboardShell

**Labels:** `auth`, `dashboard`, `refactor`, `priority-medium`

---

## Summary

`DashboardShell` wrapped an extra `AuthProvider` from `@/context/AuthContext` while the root already provides auth via `ClientProviders`.

- After unifying auth (see related issue), ensure only one provider wraps the tree.
- Update `TopHeader` / `Sidebar` to use the unified `useAuth`.
- Verify in React DevTools that context is not shadowed.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 4

**Title:** Consolidate /login and /(auth)/signin into one user journey

**Labels:** `ux`, `routing`, `auth`, `priority-medium`

---

## Summary

The app currently exposes more than one sign-in surface with different copy and behavior.

- Pick a canonical route and redirect the other.
- Avoid duplicate SEO and split analytics.
- Align messaging (wallet vs email) with product intent.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 5

**Title:** Single source of truth: Tailwind v4 @theme vs tailwind.config.ts

**Labels:** `design-system`, `tailwind`, `priority-medium`

---

## Summary

`globals.css` uses Tailwind v4 style import and `@theme`, while `tailwind.config.ts` still extends semantic colors. Drift is likely.

- Decide which layer owns production tokens.
- If both exist, add an explicit rule (for example: CSS-first, config for content paths only).

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 6

**Title:** Reconcile :root variables in globals with component classes

**Labels:** `design-system`, `css`, `priority-medium`

---

## Summary

`globals.css` defines many CSS variables; some components still use ad-hoc Tailwind classes.

- Map variables to the project design spec.
- Refactor high-traffic screens to consistent tokens where feasible.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 7

**Title:** CI: validate package.json and tsconfig.json on every PR

**Labels:** `ci`, `tooling`, `priority-high`

---

## Summary

Invalid JSON in config files from bad merges can break the whole team until noticed.

- Add a CI step that parses `package.json` and `tsconfig.json`.
- Optionally add the same in a pre-commit hook.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 8

**Title:** Regenerate lockfile and document install for Next + SWC

**Labels:** `tooling`, `devx`, `priority-high`

---

## Summary

`next build` can attempt to patch the lockfile for SWC. Contributors need a clear, repeatable path.

- Run a clean install and commit a healthy lockfile.
- Document the package manager in README (align with the `packageManager` field if present).

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 9

**Title:** Add .env.example and validate src/lib/env.ts in development

**Labels:** `env`, `devx`, `priority-medium`

---

## Summary

Environment variables are easy to get wrong in deployment.

- Add `.env.example` (no secrets) listing `NEXT_PUBLIC_*` and any server keys.
- Fail fast in dev when required keys are missing, with a clear error message.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 10

**Title:** Unify /api/* JSON error shape and HTTP status codes

**Labels:** `api`, `frontend`, `priority-medium`

---

## Summary

Portfolio and transaction API routes should return a predictable error body for the UI to parse defensively.

- Introduce a small shared helper in `lib/` and types for the envelope.
- Update `PortfolioDashboard`, `TransactionFlow`, and other fetch call sites to handle it.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 11

**Title:** Single isAuthenticated / session read for middleware and ProtectedRoute

**Labels:** `auth`, `refactor`, `priority-medium`

---

## Summary

Avoid three slightly different definitions of logged in.

- Centralize session validation where Next allows (Edge vs Node vs client).
- `ProtectedRoute` and middleware should share the same source of truth for cookie name and format.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 12

**Title:** Harden error and loading UX when /api/portfolio and related fetches fail

**Labels:** `ux`, `dashboard`, `priority-medium`

---

## Summary

Users should not see infinite skeletons on failed requests.

- Audit `PortfolioDashboard` and related data-fetch paths.
- Use existing `ErrorBlock` / `InlineBanner` patterns and retry where appropriate.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 13

**Title:** TransactionFlow: recovery UX when /api/transactions fails

**Labels:** `ux`, `transactions`, `priority-medium`

---

## Summary

Network and server errors from `fetch` should be actionable: retry, edit amount, or contact support.

- Map each failure mode to product copy.
- Ensure loading and pending states clean up on unmount.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 14

**Title:** Lazy-load Recharts on dashboard for smaller initial bundles

**Labels:** `performance`, `frontend`, `priority-low`

---

## Summary

`recharts` is heavy. Consider `next/dynamic` for chart sections with skeleton fallbacks.

- Measure before/after chunk size.
- Respect `prefers-reduced-motion` where applicable.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 15

**Title:** Run or document qa:visual-baseline and Playwright in CI or locally

**Labels:** `testing`, `ci`, `priority-medium`

---

## Summary

The `qa:visual-baseline` script and Playwright should have a clear owner: CI, nightly, or local-only.

- If CI: add caching and store failure artifacts.
- If local: document prerequisites (browser install) in README.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 16

**Title:** Triage next/no-img-element and react-hooks/exhaustive-deps warnings

**Labels:** `eslint`, `quality`, `priority-low`

---

## Summary

ESLint can block builds if warnings become errors in CI.

- Replace `img` with `next/image` where appropriate, or document exceptions.
- Fix `useEffect` dependency warnings in `TimePicker` with a correct pattern.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 17

**Title:** Upgrade Next.js to a current patched 14.x release

**Labels:** `security`, `nextjs`, `priority-high`

---

## Summary

The pinned Next version may be behind security patches.

- Read release notes, upgrade, and run smoke tests.
- Re-check middleware and any `next.config` after upgrade.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 18

**Title:** Document Stellar wallet localStorage keys and WalletProvider behavior

**Labels:** `docs`, `wallet`, `priority-low`

---

## Summary

`WalletProvider` persists connection metadata. New engineers need a data dictionary: key names, formats, clear-on-logout.

- Distinguish wallet connection from session/cookie auth in docs.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 19

**Title:** i18n: replace remaining hard-coded English in dashboard and settings

**Labels:** `i18n`, `ux`, `priority-medium`

---

## Summary

`I18nContext` exists but many strings are still inline.

- Inventory high-traffic routes.
- Move strings to dictionaries; verify behavior when changing locale in the UI.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 20

**Title:** Align cookie consent storage keys and settings page labels

**Labels:** `privacy`, `compliance`, `priority-medium`

---

## Summary

Banner, modal, and `CookieConsentSettings` should use one namespaced storage contract.

- Add a small integration checklist for accept, reject, and revoke paths.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 21

**Title:** Harden or hide /dashboard/sandbox in production

**Labels:** `security`, `qa`, `priority-high`

---

## Summary

The internal sandbox for mock toggles should not be available to end users in production, or should be feature-flagged.

- Guard with `NODE_ENV` and/or a feature flag.
- Return 404 or redirect in production if disabled.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 22

**Title:** Global search: debounce, empty, and error states

**Labels:** `ux`, `a11y`, `priority-medium`

---

## Summary

Search should feel fast but not chatty, with clear empty and error feedback.

- Implement debounce in the 250–400ms range from the design backlog.
- Verify keyboard and screen reader behavior.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 23

**Title:** History and audit: handle large mock datasets in the UI

**Labels:** `performance`, `data`, `priority-low`

---

## Summary

Hundreds of rows can cause jank. Consider list virtualization or strict pagination.

- Align with filter chips and existing data hooks.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 24

**Title:** Accessibility: landmarks, headings, and focus in dashboard shell

**Labels:** `a11y`, `wcag`, `priority-medium`

---

## Summary

Sidebar, header, and main should form a clear outline for keyboard and assistive technology.

- One keyboard-only pass with fixes for obvious focus traps.
- Confirm skip link targets the main content region correctly.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 25

**Title:** Theme: reduce first-paint flash and document persistence keys

**Labels:** `ux`, `theming`, `priority-low`

---

## Summary

If users see the wrong theme briefly, trust drops.

- Confirm storage key and `ThemeProvider` init order.
- Document dark-only vs system preference behavior.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 26

**Title:** Route metadata: keep `routeMetadata` aligned with App Router files

**Labels:** `navigation`, `maintainability`, `priority-medium`

---

## Summary

When new routes are added, breadcrumbs and labels should update from one place.

- Consider a typed map or a test that dashboard routes have a label in `lib/routeMetadata.tsx` when you add sections.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 27

**Title:** Unify `User` type: mock-auth, `types/index`, and API responses

**Labels:** `typescript`, `data-model`, `priority-medium`

---

## Summary

Multiple `User` shapes can diverge at fetch boundaries.

- One exported `User` type and thin adapters for mock vs API data.
- Typecheck the touched code paths in strict mode.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 28

**Title:** npm audit: triage and policy for transitive Stellar/WalletConnect issues

**Labels:** `security`, `process`, `priority-medium`

---

## Summary

Some dependencies are security-sensitive. Document accepted risk versus must-fix and schedule review.

- Avoid `npm audit fix --force` without maintainer sign-off on breaking changes.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 29

**Title:** Add unit tests for formatters, date filter, and list logic

**Labels:** `testing`, `quality`, `priority-medium`

---

## Summary

High-value, mostly pure code: `lib/formatters`, `useDateFilter`, and transaction list helpers.

- Use the test runner the team standardizes on with minimal config churn.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

---

## 30

**Title:** README: provider tree, data flow, and Stellar testnet assumptions

**Labels:** `docs`, `onboarding`, `priority-medium`

---

## Summary

Onboarding: what runs where (mock, Horizon testnet) and which providers wrap the app.

- Optional mermaid or ASCII architecture diagram.
- Link to this audit queue and the product backlog under `.github/backlog`.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.
