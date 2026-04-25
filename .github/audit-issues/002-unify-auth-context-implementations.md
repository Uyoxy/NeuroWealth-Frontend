---
title: "Unify duplicate AuthContext implementations"
audit_queue_number: 2
labels:
  - auth
  - refactor
  - frontend
  - priority-high
---

## Summary

`src/context/AuthContext.tsx` (cookie + `signIn(token, user)`) and `src/contexts/AuthContext.tsx` (mock `mockAuth` email/password) implement two different session models.

- Choose a single `AuthProvider` (likely the one in `ClientProviders` under `src/contexts/`).
- Expose one `useAuth` contract covering demo sign-in, sign-up, and sign-out.
- Migrate `/login` and `/(auth)/*` to the unified API without breaking the dashboard.
- Document mock vs future real JWT flow in code comments or a short doc if needed.

## Acceptance criteria

- [ ] Clear owner and scope agreed in the issue thread if ambiguous.
- [ ] Change is verifiable: tests, screenshots, or written QA steps in the PR.
- [ ] No new duplicate abstractions without a one-line note explaining why.

## Suggested labels

`auth`, `refactor`, `frontend`, `priority-high`

## Notes

Filing: use these files as the issue body, or `gh issue create` with a trimmed file. This queue complements the feature [backlog](../backlog) (001–050).
