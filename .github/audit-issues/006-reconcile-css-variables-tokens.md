---
title: "Reconcile :root variables in globals with component classes"
audit_queue_number: 6
labels:
  - design-system
  - css
  - priority-medium
---

## Summary

`globals.css` defines many CSS variables; some components still use ad-hoc Tailwind classes.

- Map variables to the project design spec.
- Refactor high-traffic screens to consistent tokens where feasible.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`design-system`, `css`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
