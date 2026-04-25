---
title: "Build localization-ready UI structure (i18n preparation)"
issue_number: 36
epic: "Page Design Issues (Dummy Data Only)"
labels:
  - frontend
  - i18n
  - ux
  - priority-medium
---

## Epic

Page Design Issues (Dummy Data Only)

## Description

- Externalize UI strings into translation dictionaries
- Add locale switch UI with mock language packs
- Validate layout behavior for longer translated strings
- Design spec (must use; measurable):
  - Tokens per Issue 3
  - Locale switcher accessible by keyboard and screen reader
  - No truncated primary labels at 320px width
  - Date/number formatters support locale changes

## Acceptance criteria

- [ ] Strings externalized from components
- [ ] Locale switching works with mock translations
- [ ] Layout remains stable in long-string languages
- [ ] PR includes screenshots for at least 2 locales

## Suggested GitHub labels

`frontend`, `i18n`, `ux`, `priority-medium`

---
