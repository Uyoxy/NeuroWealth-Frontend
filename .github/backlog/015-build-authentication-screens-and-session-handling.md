---
title: "Build authentication screens and session handling"
issue_number: 15
epic: "Quality and Delivery"
labels:
  - frontend
  - auth
  - priority-high
---

## Epic

Quality and Delivery

## Description

- Implement sign in, sign up, and session restore UI flows (mock auth)
- Support mock token/session storage in browser
- Add protected route handling and unauthorized redirects (mock guard)
- Design spec (must use; measurable):
  - Tokens per Issue 3 (no substitutions)
  - Form fields min-height 44px; error text size 14px
  - Authentication cards centered; max width 420px on desktop
  - Focus state 2px outline in primary color

## Acceptance criteria

- [ ] Mock sign in flow complete and validated
- [ ] Mock session persists across refresh
- [ ] Protected routes block unauthenticated users via mock guard
- [ ] PR includes screenshots (desktop/mobile, success/error states)

## Suggested GitHub labels

`frontend`, `auth`, `priority-high`

---
