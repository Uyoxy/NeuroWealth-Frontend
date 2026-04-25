---
title: "Upgrade Next.js to a current patched 14.x release"
audit_queue_number: 17
labels:
  - security
  - nextjs
  - priority-high
---

## Summary

The pinned Next version may be behind security patches.

- Read release notes, upgrade, and run smoke tests.
- Re-check middleware and any `next.config` after upgrade.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`security`, `nextjs`, `priority-high`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
