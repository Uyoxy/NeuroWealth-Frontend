---
title: "Build transaction history and activity timeline"
issue_number: 8
epic: "Product Surfaces"
labels:
  - frontend
  - activity
  - priority-medium
---

## Epic

Product Surfaces

## Description

- Display deposits, withdrawals, and rebalancing activity
- Support pagination/filtering by type/date/status
- Link events to tx hash where available
- Design spec (must use; measurable):
  - Tokens per Issue 3 (no substitutions)
  - Desktop: table with sticky header; Mobile: card list layout
  - Status tags: success #10B981; pending #F59E0B; failed #EF4444
  - Timestamp + tx hash: muted text and monospace
  - Filters: compact chips/selects; fully keyboard accessible
  - Empty state includes guidance and primary CTA

## Acceptance criteria

- [ ] History list loads from mock data
- [ ] Filters and pagination function
- [ ] Tx hash/explorer links shown when present
- [ ] Loading and no-data states implemented
- [ ] Follows the issue-level design spec
- [ ] PR includes screenshots with filters and states

## Suggested GitHub labels

`frontend`, `activity`, `priority-medium`

---
