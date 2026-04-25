---
title: "Lazy-load Recharts on dashboard for smaller initial bundles"
audit_queue_number: 14
labels:
  - performance
  - frontend
  - priority-low
---

## Summary

`recharts` is heavy. Consider `next/dynamic` for chart sections with skeleton fallbacks.

- Measure before/after chunk size.
- Respect `prefers-reduced-motion` where applicable.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`performance`, `frontend`, `priority-low`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
