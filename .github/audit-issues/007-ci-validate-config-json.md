---
title: "CI: validate package.json and tsconfig.json on every PR"
audit_queue_number: 7
labels:
  - ci
  - tooling
  - priority-high
---

## Summary

Invalid JSON in config files from bad merges can break the whole team until noticed.

- Add a CI step that parses `package.json` and `tsconfig.json`.
- Optionally add the same in a pre-commit hook.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`ci`, `tooling`, `priority-high`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
