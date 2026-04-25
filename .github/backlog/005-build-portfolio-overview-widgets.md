---
title: "Build portfolio overview widgets"
issue_number: 5
epic: "Product Surfaces"
labels:
  - frontend
  - portfolio
  - priority-high
---

## Epic

Product Surfaces

## Description

- Show total balance, total yield, APY, and strategy
- Add asset allocation and recent activity cards
- Use local mock data sources (JSON/fixtures) only
- Design spec (must use; measurable):
  - Tokens per Issue 3 (no substitutions)
  - KPI cards: one primary metric (Inter 700) + helper text (Inter 400, #94A3B8)
  - Color rules: positive #10B981; negative #EF4444; neutral #94A3B8
  - Numeric text uses monospaced font for alignment
  - Charts: limited to primary/accent/warning plus neutrals (#64748B/#94A3B8)
  - Empty state includes icon (24px), helper copy (max 120 chars), and CTA

## Acceptance criteria

- [ ] Summary cards populated from mock data
- [ ] Allocation and activity visible
- [ ] Empty states handled
- [ ] Formatting for currency/percentages consistent
- [ ] Follows the issue-level design spec
- [ ] PR includes screenshots of widgets (light/dark)

## Suggested GitHub labels

`frontend`, `portfolio`, `priority-high`

---
