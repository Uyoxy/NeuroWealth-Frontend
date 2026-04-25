# Error boundary recovery matrix

| Segment | Trigger route | Boundary expected | Recovery path |
| --- | --- | --- | --- |
| Dashboard route-level errors | `/dashboard/dev-errors/route-error` (dev-only, throws on render) | `src/app/dashboard/error.tsx` | Primary: `Try again` calls `reset()`. Secondary: `Back to dashboard home`. |
| Global client render errors | `/dashboard/dev-errors/boundary-error` then click `Trigger client error` | `src/components/ErrorBoundary.tsx` | `Try again` clears the boundary state and re-renders the subtree. |
| Global app route error | Any unhandled route render error outside dashboard segment | `src/app/error.tsx` | Primary: `Try again` via `reset()`. Secondary: `Back to home`. |

## QA steps

1. Run `yarn dev`.
2. Visit `/dashboard/dev-errors/route-error` and confirm the dashboard-specific error copy is rendered.
3. Visit `/dashboard/dev-errors/boundary-error`, click `Trigger client error`, and confirm global boundary fallback copy and retry action.
4. Confirm production safety by running a production build and verifying `/dashboard/dev-errors` returns 404.
