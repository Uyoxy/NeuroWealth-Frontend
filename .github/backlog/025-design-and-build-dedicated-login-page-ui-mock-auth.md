---
title: "Design and build dedicated login page UI (mock auth)"
issue_number: 25
epic: "Page Design Issues (Dummy Data Only)"
labels:
  - frontend
  - page-design
  - auth
  - priority-high
---

## Epic

Page Design Issues (Dummy Data Only)

## Description

- Create a standalone login page with email/password and social placeholder buttons
- Use mock submit and validation flows only
- Provide variants: default, invalid credentials, loading, success redirect
- Design spec (must use; measurable):
  - Tokens per Issue 3
  - Form card width 420px max on desktop; full-width on mobile with 16px gutters
  - Input labels always visible; helper/error text at 14px
  - Primary CTA min-height 44px

## Acceptance criteria

- [ ] Login page UI complete with mock handlers
- [ ] All four states implemented (default/error/loading/success)
- [ ] Keyboard and screen reader checks pass
- [ ] PR includes screenshots for each state (desktop/mobile)

## Suggested GitHub labels

`frontend`, `page-design`, `auth`, `priority-high`

---
