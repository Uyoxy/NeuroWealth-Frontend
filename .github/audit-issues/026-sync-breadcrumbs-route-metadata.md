---
title: "Route metadata: keep `routeMetadata` aligned with App Router files"
audit_queue_number: 26
labels:
  - navigation
  - maintainability
  - priority-medium
---

## Summary

When new routes are added, breadcrumbs and labels should update from one place.

- Consider a typed map or a test that dashboard routes have a label in `lib/routeMetadata.tsx` when you add sections.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`navigation`, `maintainability`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
