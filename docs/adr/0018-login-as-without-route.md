# 0018. Log in as customer opens the dashboard directly (no /login-as page)

- **Date:** 2026-11-04
- **Status:** Accepted (supersedes [0017](0017-login-as-customer-tab.md))

## Context

ADR 0017 opened a `/login-as/:customerId` page in the new tab, which started the customer session and then reloaded. The tab showed that route, and a "Logged in as" badge. The tab should look exactly like a normal customer login: the dashboard at `/`, the customer's name and menus, normal logout. The server side (path-scoped session cookie, server [ADR 0008](../../../7th-sense-server/docs/adr/0008-login-as-path-scoped-session.md)) is unchanged.

## Decision

- View on a customer row ([CustomerList.jsx](../../src/pages/Customers/CustomerList.jsx)) opens an empty tab at once (`window.open('', '_blank')`, still inside the click, so pop-up blockers allow it), then calls `POST /auth/login-as` from the superadmin's tab. On success it cuts the tab's `opener` and sends it to `/#loginAs=<sessionKey>`; on failure it closes the tab and shows a toast.
- Before the first render ([main.jsx](../../src/main.jsx) → `takeLoginAsFromUrl()` in [loginAs.js](../../src/utils/loginAs.js)), the new tab keeps the key in its sessionStorage and removes the hash. The address bar shows `/`; the app starts on the customer's session (`apiBaseUrl()` = `/api/as/<sessionKey>/v1`), so `GET /auth/me` returns the customer.
- No badge, no special logout: Sign out ends the tab's session (server clears only its cookie), drops the key and shows the login screen, like any logout.
- The `/login-as` route and `pages/LoginAs/` are removed.

## Alternatives considered

- Keep the `/login-as` page: the route stays visible and the page needs its own loading / error screens.
- Copy the key into the new tab's sessionStorage through `window.open` (browsers copy session storage to a tab opened with an opener): the copy is taken at open time and differs between browsers.

## Consequences

- The key passes through the URL hash once. It is not a secret (the token is in the HttpOnly cookie) and a hash is never sent to the server or written to its logs.
- If the browser blocks pop-ups, the superadmin gets a toast asking to allow them.
- After logout the tab is a normal tab: logging in there with a password replaces the browser's normal session, as on any login screen.
