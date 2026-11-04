# 0015. Clientele is a Masters page, not an Account Center tab

- **Date:** 2026-11-04
- **Status:** Accepted (supersedes the Clientele tab of [0011](0011-business-setup-tabbed-page.md) / [0014](0014-account-center.md))

## Context

Account Center (System) holds the account team's screens: Customer, Licence Key and Machine Catalog. Clientele was a fourth tab there, but it is not account administration: each customer keeps its own clients (the companies it makes parts for), next to its parts. It was also the only Account Center tab open to every role, so supervisors and operators saw an Account Center with just that one tab.

## Decision

- Clientele moves to the Masters section as its own sidebar item (a link, no submenu), just above Parts.
- `ClienteleList` renders a page header ("Masters · Clientele") instead of a tab header; `PAGES` renders it directly, without `AccountCenterPage`. The route `/masters/clienteles` and its access (everyone reads their company's, managers add / edit / delete) are unchanged.
- The tab is removed from `ACCOUNT_CENTER_TABS`. Every tab left needs `MANAGERS` or higher, so the Account Center sidebar item and the `/account-center` route get `roles: MANAGERS`.

## Alternatives considered

- Keep the tab and add a Masters link to the same route: two places for one screen, and the sidebar would light up both.
- Put Clientele under the Parts submenu: the user asked for a plain item, and clientele is used outside parts too (it is the customer's client list).

## Consequences

- Account Center is only for managers; other roles no longer see it in the sidebar, and `/account-center` sends them to the not-allowed screen.
- Links and bookmarks to `/masters/clienteles` keep working.
- Field help (Add Part) and the User Guide now say "Masters › Clientele".
