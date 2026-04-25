---
title: "Add .env.example and validate src/lib/env.ts in development"
audit_queue_number: 9
labels:
  - env
  - devx
  - priority-medium
---

## Summary

Environment variables are easy to get wrong in deployment.

- Add `.env.example` (no secrets) listing `NEXT_PUBLIC_*` and any server keys.
- Fail fast in dev when required keys are missing, with a clear error message.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`env`, `devx`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
