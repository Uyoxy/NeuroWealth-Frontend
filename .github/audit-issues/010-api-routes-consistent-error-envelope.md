---
title: "Unify /api/* JSON error shape and HTTP status codes"
audit_queue_number: 10
labels:
  - api
  - frontend
  - priority-medium
---

## Summary

Portfolio and transaction API routes should return a predictable error body for the UI to parse defensively.

- Introduce a small shared helper in `lib/` and types for the envelope.
- Update `PortfolioDashboard`, `TransactionFlow`, and other fetch call sites to handle it.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`api`, `frontend`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
