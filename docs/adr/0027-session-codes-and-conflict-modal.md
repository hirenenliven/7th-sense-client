# 0027. Session message codes worded on the client, and a conflict modal at login

- **Date:** 2026-11-17
- **Status:** Accepted

## Context

The server now manages sessions (server [ADR 0014](../../../7th-sense-server/docs/adr/0014-session-modes-and-login-conflict.md)): a login can answer 409 `session_conflict` with the sessions in the way, and a request can answer 401 `session_revoked` (with a revoke reason) or `session_expired`. Until now every 401 was one event (`notifyUnauthorized()`) with one toast, "Your session has ended", and every error message from the server was shown as is. The live socket's `session:expired` had no payload.

## Decision

- **The server sends fixed codes; the client words them** in [constants/session.js](../../src/constants/session.js): `SESSION_CODES`, `REVOKE_REASONS`, `sessionEndedMessage({ code, reason })` (e.g. `replaced_by_new_login` → "You were logged out because your account signed in on another device.").
- **One path for every way a session ends.** `apiClient` keeps `data` on rejected errors and calls `notifyUnauthorized({ code, reason })` on every 401; the socket's `session:expired {reason, revokeReason}` calls the same function. `AuthProvider` closes the live socket, shows the worded toast (also when no user was loaded yet, for revoked / expired) and drops the user, so the routes redirect to `/login`.
- **The conflict is a decision the user makes on the Login page**, in a react-bootstrap modal ([SessionConflictModal.jsx](../../src/pages/Login/SessionConflictModal.jsx)) that lists the sessions in the way. "Log out other device and continue" resubmits the same form values with `forceLogoutOthers: true`; Cancel keeps the other session. The password is never stored beyond the form's values in that page's state.
- **One session table for both lists** ([SessionTable.jsx](../../src/pages/Sessions/SessionTable.jsx)): My Sessions (every role, System menu) and the superadmin's User sessions (from the account's View) share it; `adminView` swaps the Current column for the session type and allows logging out every row, `customerLabel` adds the Customer column.

## Alternatives considered

- **Show the server's message as is (human sentences from the server).** The 401s are handled away from any form, and the same code needs different words in the toast and the modal. Rejected.
- **Retry the login automatically with forceLogoutOthers.** It would silently log out a device the user may still be working on, the very thing the conflict exists to prevent. Rejected.
- **A separate "sessions" route for the conflict.** It would need the password to travel or be kept between routes. Rejected for the modal on the Login page.

## Consequences

- The three codes are a contract with the server (`internal/response`): changing them on one side breaks the other.
- Every 401 now carries `{ code, reason }`; listeners of `onUnauthorized` get it as their argument.
- There is still no client test framework: the conflict flow and the toast wording are checked by hand and by the server's integration tests.
