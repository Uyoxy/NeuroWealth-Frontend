---
title: "Triage next/no-img-element and react-hooks/exhaustive-deps warnings"
audit_queue_number: 16
labels:
  - eslint
  - quality
  - priority-low
---

## Summary

ESLint can block builds if warnings become errors in CI.

- Replace `img` with `next/image` where appropriate, or document exceptions.
- Fix `useEffect` dependency warnings in `TimePicker` with a correct pattern.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`eslint`, `quality`, `priority-low`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
