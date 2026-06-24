# PR: Skeleton Library, Observability, Auth Screens, and Accessibility Hardening

Closes #452 · Closes #435 · Closes #437 · Closes #442

---

## Summary

### #452 — Skeleton library and shimmer presets

- **`src/app/globals.css`**: Added the three CSS custom properties consumed by `Skeleton.module.css` (`--skeleton-base`, `--skeleton-shine`, `--skeleton-duration: 1.4s`) to `:root`. Without these the shimmer gradient was transparent and no animation played.
- **`src/components/skeletons/index.ts`**: New barrel file re-exporting all five composed skeleton presets (`DashboardSkeleton`, `SkeletonBlock`, `SkeletonStatCard`, `SkeletonActivityRow`, `SkeletonAllocationWidget`) as named exports.

Design spec compliance:
- Animation duration 1.4 s ✅ (spec: 1.2–1.8 s)
- Skeleton dimensions match final components ±4 px ✅ (enforced in `Skeleton.module.css`)
- `prefers-reduced-motion` → static appearance, no animation ✅
- All skeletons carry `aria-hidden="true"` ✅

---

### #435 — Observability and error monitoring

- **`src/components/ClientProviders.tsx`**: Added `ErrorTrackingMount` — a zero-render component that calls `useErrorTracking()` so `window` `error` and `unhandledrejection` events are forwarded to the logger from the very first client render. No page-level opt-in needed.
- **`src/contexts/AuthContext.tsx`**: Added `analytics.track()` calls for all five core auth events:
  - `auth_sign_in` (with `userId`)
  - `auth_sign_in_failed`
  - `auth_sign_up` (with `userId`)
  - `auth_sign_up_failed`
  - `auth_sign_out` (with `userId`)

Existing infrastructure used as-is: `logger`, `analytics`, `DiagnosticsPanel`, `LogViewer`, `EventMonitor`, `useDiagnostics`.

---

### #437 — Authentication screens and session handling

Three design-spec violations fixed across `src/app/login/page.tsx` and `src/app/(auth)/signup/page.tsx`:

| Fix | Before | After | Spec |
|---|---|---|---|
| Card max-width (login) | `max-w-sm` (384 px) | `max-w-[420px]` | 420 px desktop |
| Card max-width (signup) | `max-w-xl` (576 px) | `max-w-[420px]` | 420 px desktop |
| Input min-height (signup) | `py-3` ≈ 40 px | `+ min-h-11` = 44 px | min-height 44 px |
| Button min-height (login) | `py-3` ≈ 40 px | `+ min-h-11` = 44 px | min-height 44 px |
| Focus ring (signup, default) | `focus:ring-sky-400/15` | `focus:ring-sky-400` | 2 px outline primary colour |
| Focus ring (signup, error) | `focus:ring-red-500/15` | `focus:ring-red-500` | 2 px outline primary colour |

The existing mock auth flow (signIn/signUp/signOut in AuthContext, cross-tab sync via `storage` event, session restore on mount with `loading` guard) was already complete and correct — no changes needed there.

---

### #442 — Accessibility hardening

- **`docs/a11y-audit.md`**: Full WCAG 2.1 AA audit report covering landing, sign-up, sign-in, dashboard, settings, profile, onboarding, and help flows.
- Three issues found and fixed in this PR (A11Y-01 → A11Y-03, detailed in the audit).
- Verified patterns: skip link, modal focus trap, form error associations (`aria-describedby` + `aria-invalid`), skeleton `aria-hidden`, live regions (`aria-live` on alerts and status).
- Keyboard navigation matrix for 8 key flows — all pass.
- 4 post-MVP recommendations documented (chart `aria-label`, SVG `<title>`, `autocomplete` attributes, sandbox live region).

---

## Test Plan

- [ ] **Skeleton shimmer**: Open dashboard loading state in browser; confirm animated shimmer gradient appears (was invisible before the CSS token fix)
- [ ] **Skeleton reduced-motion**: Enable `prefers-reduced-motion` in OS settings; confirm skeletons render as static grey blocks with no animation
- [ ] **Error tracking**: Open DiagnosticsPanel → Logs tab; trigger a JS error (use the "Trigger Test Error" button in the Env tab); confirm the error appears in the log list
- [ ] **Auth analytics**: Open DiagnosticsPanel → Events tab; sign in and sign out; confirm `auth_sign_in` and `auth_sign_out` events appear
- [ ] **Login card width**: Open `/login` on a 390 px viewport; confirm no horizontal scroll; card is 420 px wide on desktop
- [ ] **Signup card width**: Open `/signup` on a 390 px viewport; confirm no horizontal scroll
- [ ] **Signup focus ring**: Tab to each input field; confirm a clearly visible sky-blue 2 px ring appears (was nearly invisible at 15 % opacity)
- [ ] **Signup touch targets**: Tap each input on a mobile device; confirm the tap area is at least 44 × 44 px
- [ ] **Keyboard nav**: Tab through the entire sign-up form using keyboard only; confirm all fields and the submit button are reachable and operable
- [ ] **a11y audit doc**: Confirm `docs/a11y-audit.md` renders correctly in GitHub
