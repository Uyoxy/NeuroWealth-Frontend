---
title: "Regenerate lockfile and document install for Next + SWC"
audit_queue_number: 8
labels:
  - tooling
  - devx
  - priority-high
---

## Summary

`next build` can attempt to patch the lockfile for SWC. Contributors need a clear, repeatable path.

- Run a clean install and commit a healthy lockfile.
- Document the package manager in README (align with the `packageManager` field if present).

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`tooling`, `devx`, `priority-high`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
