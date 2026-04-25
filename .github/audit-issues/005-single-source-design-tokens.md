---
title: "Single source of truth: Tailwind v4 @theme vs tailwind.config.ts"
audit_queue_number: 5
labels:
  - design-system
  - tailwind
  - priority-medium
---

## Summary

`globals.css` uses Tailwind v4 style import and `@theme`, while `tailwind.config.ts` still extends semantic colors. Drift is likely.

- Decide which layer owns production tokens.
- If both exist, add an explicit rule (for example: CSS-first, config for content paths only).

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`design-system`, `tailwind`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
