---
title: "Run or document qa:visual-baseline and Playwright in CI or locally"
audit_queue_number: 15
labels:
  - testing
  - ci
  - priority-medium
---

## Summary

The `qa:visual-baseline` script and Playwright should have a clear owner: CI, nightly, or local-only.

- If CI: add caching and store failure artifacts.
- If local: document prerequisites (browser install) in README.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`testing`, `ci`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
