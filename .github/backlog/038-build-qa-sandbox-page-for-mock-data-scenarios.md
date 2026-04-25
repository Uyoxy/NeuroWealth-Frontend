---
title: "Build QA sandbox page for mock data scenarios"
issue_number: 38
epic: "Page Design Issues (Dummy Data Only)"
labels:
  - frontend
  - qa
  - mock-data
  - priority-high
---

## Epic

Page Design Issues (Dummy Data Only)

## Description

- Create internal sandbox route to toggle mock scenarios globally
- Include presets for success, empty, loading, partial failure, and timeout
- Allow scenario switching per module (portfolio/history/transactions)
- Design spec (must use; measurable):
  - Tokens per Issue 3
  - Scenario controls grouped by module
  - Current scenario visibly displayed in page header
  - Sandbox route protected behind dev-only flag

## Acceptance criteria

- [ ] Sandbox route created and documented
- [ ] Scenario presets switch UI states reliably
- [ ] Dev-only access guard works
- [ ] PR includes screenshots of each scenario preset

## Suggested GitHub labels

`frontend`, `qa`, `mock-data`, `priority-high`

---
