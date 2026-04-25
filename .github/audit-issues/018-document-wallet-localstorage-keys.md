---
title: "Document Stellar wallet localStorage keys and WalletProvider behavior"
audit_queue_number: 18
labels:
  - docs
  - wallet
  - priority-low
---

## Summary

`WalletProvider` persists connection metadata. New engineers need a data dictionary: key names, formats, clear-on-logout.

- Distinguish wallet connection from session/cookie auth in docs.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`docs`, `wallet`, `priority-low`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
