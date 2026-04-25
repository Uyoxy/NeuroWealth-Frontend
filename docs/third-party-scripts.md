# Third-party scripts (analytics, SDKs)

## Current status

This repository currently avoids adding third-party analytics script tags by default.

The only script injected at app root today is a small inline theme bootstrap in `src/app/layout.tsx` using `next/script` with `strategy="beforeInteractive"` to prevent a theme flash.

## If you need to add a third-party script

Use `next/script` instead of raw `<script>` tags.

Recommended strategies:

- `afterInteractive`: for most analytics/SDKs that can wait until hydration
- `lazyOnload`: for non-critical scripts that can wait until the browser is idle

Notes:

- Adding large scripts can regress LCP/INP and increase total JS. Treat changes here as performance-sensitive.
- Prefer dynamic import (e.g. `import("...")`) when the integration can be loaded only on specific routes or user actions.
- Defer consent and data collection behavior to the privacy/cookie workstreams.

## QA checklist for script changes

- Confirm the script loads with the intended strategy (`afterInteractive` / `lazyOnload`)
- Validate no blocking network requests happen before first paint unless explicitly intended
- Re-run `yarn build` and sanity check bundle size and performance
