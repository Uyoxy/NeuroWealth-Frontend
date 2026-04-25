---
title: "Build authenticated user dashboard shell"
issue_number: 4
epic: "Product Surfaces"
labels:
  - frontend
  - dashboard
  - priority-high
---

## Epic

Product Surfaces

## Description

- Create layout with sidebar/top nav
- Add placeholders for portfolio, activity, strategy, and settings
- Support loading/empty/error states
- Design spec (must use; measurable):
  - Palette and typography per Issue 3
  - Layout: Desktop (left sidebar + top header); Mobile (bottom nav + compact header)
  - Widget surfaces: #111827 with #1F2937 border
  - Type weights: headings 600/700; body 400/500
  - Loading: skeletons present for all primary widgets
  - Focus ring: 2px outline in #0EA5E9; all interactive elements tabbable

## Acceptance criteria

- [ ] Dashboard route protected
- [ ] Layout renders on desktop and mobile
- [ ] Skeleton/loading states implemented
- [ ] Error boundary for dashboard routes
- [ ] Follows the issue-level design spec
- [ ] PR includes screenshots of key states (empty, loading, populated)

## Suggested GitHub labels

`frontend`, `dashboard`, `priority-high`

---
