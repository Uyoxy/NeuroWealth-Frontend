# PR: Component tests for ProtectedRoute + landing hero visual regression

Closes #308 · Closes #309

---

## Summary

- **#308 — ProtectedRoute component tests**: Extended the existing
  `src/components/auth/ProtectedRoute.test.ts` suite from 29 to 36 tests
  by adding edge-case scenarios across all three guard branches
  (loading / unauthenticated / authenticated).

- **#309 — Landing hero visual regression**: Extended
  `scripts/capture-visual-baselines.mjs` (`qa:visual-baseline`) with
  dedicated landing-hero scenarios captured at every Tailwind responsive
  breakpoint used by `src/features/landing/HeroSection.tsx`.

---

## Changes

### `src/components/auth/ProtectedRoute.test.ts` (#308)

Added 7 new tests that fill gaps not covered by the original 29:

| New test | What it verifies |
|---|---|
| `'from' handles paths with query strings` | Query params survive `encodeURIComponent` round-trip |
| `'from' preserves hash fragments` | Hash anchors (e.g. `#security`) survive encoding |
| `'from' handles root path` | `/` is correctly encoded and decoded |
| `default redirectTo is /login` | `SIGN_IN_PATH` constant matches expected value |
| `all three outcomes are distinct` | `loading`, `redirect`, `children` are mutually exclusive |
| `/onboarding requires auth` | `/onboarding` prefix is in `PROTECTED_PREFIXES` |
| `/onboarding/step/1 nested requires auth` | Nested onboarding paths are also protected |

All 36 tests pass (`node --import tsx --test`).

### `scripts/capture-visual-baselines.mjs` (#309)

**New viewports** covering the responsive breakpoints in `HeroSection.tsx`:

| Viewport constant | Width | Tailwind tier triggered |
|---|---|---|
| `SM_VIEWPORT` | 640 px | `sm:text-5xl` activates |
| `MD_VIEWPORT` | 768 px | `md:text-6xl` activates |
| `LG_VIEWPORT` | 1024 px | `lg:` utilities activate |

(Mobile 390 px and Desktop 1440 px were already present.)

**New `LANDING_SCENARIOS`** targeting `src/features/landing/**`:

| Scenario | State | What is captured |
|---|---|---|
| `landing-hero` | `above-fold` | Hero at initial scroll position |
| `landing-hero` | `stats-visible` | Scrolled to the stats grid row |
| `landing-hero` | `wallet-error` | Connect Wallet clicked — error message visible |

All three scenarios run against all 5 viewports in `LANDING_VIEWPORTS`,
adding **15 new screenshots** per baseline run on top of the existing 48.

---

## Test plan

- [x] `npm run test` — all 36 ProtectedRoute tests pass, no regressions
- [x] `node --check scripts/capture-visual-baselines.mjs` — script is
  syntactically valid
- [ ] Run `npm run qa:visual-baseline` against a live dev server to verify
  the 15 new screenshots are generated correctly (requires a running
  Next.js instance)
