---
title: "i18n: replace remaining hard-coded English in dashboard and settings"
audit_queue_number: 19
labels:
  - i18n
  - ux
  - priority-medium
---

## Summary

`I18nContext` exists but many strings are still inline.

- Inventory high-traffic routes.
- Move strings to dictionaries; verify behavior when changing locale in the UI.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`i18n`, `ux`, `priority-medium`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
