# 0017. Log in as customer in a new tab, on the tab's own API path

- **Date:** 2026-11-04
- **Status:** Superseded by [0018](0018-login-as-without-route.md)

## Context

The superadmin's View button in Account Center › Customer should open the app as that customer, in a new tab, without touching the superadmin's own login: logging out in either tab must not end the other. All tabs share the HttpOnly session cookie, so the client cannot keep two sessions by itself. The server gives the customer session its own cookie scoped to `/api/as/<sessionKey>` (server [ADR 0008](../../../7th-sense-server/docs/adr/0008-login-as-path-scoped-session.md)).

## Decision

- View on a customer row opens `/login-as/:customerId` with `window.open(…, '_blank', 'noopener')`. That page ([LoginAs.jsx](../../src/pages/LoginAs/LoginAs.jsx)) is outside `ProtectedRoute`. It calls `POST /auth/login-as` on the superadmin's session, keeps `{sessionKey, customerName}` in **sessionStorage** (`STORAGE_KEYS.LOGIN_AS`, per tab), then reloads into the app.
- [utils/loginAs.js](../../src/utils/loginAs.js) `apiBaseUrl()` turns `/api/v1` into `/api/as/<sessionKey>/v1` while the key is set. The axios request interceptor and the part drawing link use it, so every call of that tab goes to its own session. The token stays in an HttpOnly cookie.
- Sign out in that tab ends only its session, clears the key and closes the tab (or reloads it as the superadmin when the browser keeps it open). A 401 there clears the key and shows the login screen as usual. The top bar shows a "Logged in as <customer>" badge.
- The separate "Log in as" placeholder action is removed: View does it. Users keep their detail page.

## Alternatives considered

- Keep the token in sessionStorage and send `Authorization: Bearer`: page scripts could read it (see the server ADR).
- Open the customer in the same tab and offer "switch back": the superadmin's session would be replaced.

## Consequences

- A link opened from that tab in another tab (middle-click, a copied URL) has no key: it opens as the superadmin.
- The Customer detail page (`/masters/customers/:id`) is no longer opened from the list; its route stays.
