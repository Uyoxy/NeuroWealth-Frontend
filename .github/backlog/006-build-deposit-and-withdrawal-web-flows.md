---
title: "Build deposit and withdrawal web flows"
issue_number: 6
epic: "Product Surfaces"
labels:
  - frontend
  - transactions
  - priority-high
---

## Epic

Product Surfaces

## Description

- Add forms for deposit and withdrawal
- Validate amount and wallet conditions
- Show transaction lifecycle (pending, success, failure)
- Design spec (must use; measurable):
  - Tokens per Issue 3 (no substitutions)
  - Controls: min-height 44px; radius 8px
  - Validation colors: error #EF4444; success #10B981; warning #F59E0B
  - Status chips: color-coded with text label; min tap area 40×40 on mobile
  - Confirm screens: display amount, fees, tx reference with visual hierarchy
  - Mobile: primary action anchored at bottom for long forms

## Acceptance criteria

- [ ] Deposit flow works with mock transaction handlers
- [ ] Withdrawal flow works with mock transaction handlers
- [ ] Validation and error messaging clear
- [ ] Success receipts/tx references shown
- [ ] Follows the issue-level design spec
- [ ] PR includes screenshots for each step and state

## Suggested GitHub labels

`frontend`, `transactions`, `priority-high`

---
