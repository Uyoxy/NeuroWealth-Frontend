---
title: "Harden error and loading UX when /api/portfolio and related fetches fail"
audit_queue_number: 12
labels:
  - ux
  - dashboard
  - priority-medium
---

## Summary

Users should not see infinite skeletons on failed requests.

- Audit `PortfolioDashboard` and related data-fetch paths.
- Use existing `ErrorBlock` / `InlineBanner` patterns and retry where appropriate.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`ux`, `dashboard`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
