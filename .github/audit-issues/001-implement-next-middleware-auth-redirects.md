---
title: "Implement Next.js middleware for /dashboard and /login"
audit_queue_number: 1
labels:
  - middleware
  - auth
  - nextjs
  - priority-high
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

## Suggested labels

`middleware`, `auth`, `nextjs`, `priority-high`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
