---
title: "Unify `User` type: mock-auth, `types/index`, and API responses"
audit_queue_number: 27
labels:
  - typescript
  - data-model
  - priority-medium
---

## Summary

Multiple `User` shapes can diverge at fetch boundaries.

- One exported `User` type and thin adapters for mock vs API data.
- Typecheck the touched code paths in strict mode.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`typescript`, `data-model`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
