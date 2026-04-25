---
title: "Harden or hide /dashboard/sandbox in production"
audit_queue_number: 21
labels:
  - security
  - qa
  - priority-high
---

## Summary

The internal sandbox for mock toggles should not be available to end users in production, or should be feature-flagged.

- Guard with `NODE_ENV` and/or a feature flag.
- Return 404 or redirect in production if disabled.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`security`, `qa`, `priority-high`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
