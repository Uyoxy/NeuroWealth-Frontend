---
title: "Single isAuthenticated / session read for middleware and ProtectedRoute"
audit_queue_number: 11
labels:
  - auth
  - refactor
  - priority-medium
---

## Summary

Avoid three slightly different definitions of logged in.

- Centralize session validation where Next allows (Edge vs Node vs client).
- `ProtectedRoute` and middleware should share the same source of truth for cookie name and format.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`auth`, `refactor`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
