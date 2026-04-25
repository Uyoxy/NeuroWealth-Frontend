---
title: "Build strategy selection and risk profile screen"
issue_number: 7
epic: "Product Surfaces"
labels:
  - frontend
  - strategy
  - priority-medium
---

## Epic

Product Surfaces

## Description

- Provide Conservative, Balanced, Growth strategy cards
- Explain risk/APY expectations
- Save user strategy preference in local state/storage (mock persistence)
- Design spec (must use; measurable):
  - Tokens per Issue 3 (no substitutions)
  - 3 cards with equal visual weight; selected state: border 2px primary + background tint
  - Risk badges: Conservative (accent), Balanced (warning), Growth (danger)
  - Card content: title, APY range, risk label, ≤140-char description, primary action
  - Comparison table: mobile horizontally scrollable with sticky header on desktop

## Acceptance criteria

- [ ] User can view all strategies
- [ ] User can update preference
- [ ] Mock persistence confirmed (local state/storage)
- [ ] Strategy change confirmation UX complete
- [ ] Follows the issue-level design spec
- [ ] PR includes screenshots of strategy cards and confirmation

## Suggested GitHub labels

`frontend`, `strategy`, `priority-medium`

---
