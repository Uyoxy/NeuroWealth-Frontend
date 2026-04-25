---
title: "Remove nested AuthProvider from DashboardShell"
audit_queue_number: 3
labels:
  - auth
  - dashboard
  - refactor
  - priority-medium
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

## Suggested labels

`auth`, `dashboard`, `refactor`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
