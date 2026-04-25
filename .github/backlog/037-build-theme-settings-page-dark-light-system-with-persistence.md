---
title: "Build theme settings page (dark/light/system) with persistence"
issue_number: 37
epic: "Page Design Issues (Dummy Data Only)"
labels:
  - frontend
  - theming
  - settings
  - priority-medium
---

## Epic

Page Design Issues (Dummy Data Only)

## Description

- Add user theme controls for dark, light, and system preference
- Persist selection via local storage
- Ensure all components honor theme tokens
- Design spec (must use; measurable):
  - Tokens per Issue 3
  - Theme switch control min-height 44px
  - Theme transition duration <= 200ms and no flash on load
  - Contrast remains WCAG AA in both themes

## Acceptance criteria

- [ ] Theme setting toggles correctly
- [ ] Preference persists after refresh
- [ ] No theme flash on initial render
- [ ] PR includes screenshots in all 3 modes

## Suggested GitHub labels

`frontend`, `theming`, `settings`, `priority-medium`

---
