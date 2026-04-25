---
title: "Build number/currency formatting utilities and UI helpers"
issue_number: 49
epic: "Page Design Issues (Dummy Data Only)"
labels:
  - frontend
  - utilities
  - formatting
  - priority-high
---

## Epic

Page Design Issues (Dummy Data Only)

## Description

- Create utilities for currency, percent, and compact number formatting
- Provide components for formatted values with tooltips for full precision
- Ensure locale awareness (mock)
- Design spec (must use; measurable):
  - Tokens per Issue 3
  - Default precision: 2 dp for currency, 2–4 for APY
  - Tooltip shows full precision; mono font for numbers
  - Negative values red; positive green; zero neutral

## Acceptance criteria

- [ ] Utilities documented and unit-tested
- [ ] Components used in at least 3 widgets
- [ ] Locale switching does not break formats
- [ ] PR includes screenshots showing variants

## Suggested GitHub labels

`frontend`, `utilities`, `formatting`, `priority-high`

---
