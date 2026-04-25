---
title: "npm audit: triage and policy for transitive Stellar/WalletConnect issues"
audit_queue_number: 28
labels:
  - security
  - process
  - priority-medium
---

## Summary

Some dependencies are security-sensitive. Document accepted risk versus must-fix and schedule review.

- Avoid `npm audit fix --force` without maintainer sign-off on breaking changes.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`security`, `process`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
