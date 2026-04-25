---
title: "History and audit: handle large mock datasets in the UI"
audit_queue_number: 23
labels:
  - performance
  - data
  - priority-low
---

## Summary

Hundreds of rows can cause jank. Consider list virtualization or strict pagination.

- Align with filter chips and existing data hooks.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`performance`, `data`, `priority-low`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
