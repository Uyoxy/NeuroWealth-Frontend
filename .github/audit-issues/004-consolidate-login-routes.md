---
title: "Consolidate /login and /(auth)/signin into one user journey"
audit_queue_number: 4
labels:
  - ux
  - routing
  - auth
  - priority-medium
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

## Suggested labels

`ux`, `routing`, `auth`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
