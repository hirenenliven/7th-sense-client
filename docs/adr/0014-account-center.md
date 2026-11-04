# 0014. Business Setup renamed Account Center; old Account Center item removed

- **Date:** 2026-11-04
- **Status:** Accepted (supersedes [0011](0011-business-setup-tabbed-page.md)); the Clientele tab is superseded by [0015](0015-clientele-masters-page.md); access amended by [0016](0016-account-center-superadmin-only.md)

## Context

The System section of the sidebar had two items: **Business Setup** (the ADR 0011 tabbed page: Customer, Licence Key, Clientele, Machine Catalog) and **Account Center** (`/account`). Account Center was only a Coming Soon placeholder (it was never in `PAGES`). We want one place, called Account Center, for these accounts and the catalog.

## Decision

- The ADR 0011 page is renamed **Account Center**. Its tabs, their routes, roles and behaviour are unchanged.
- The rename goes through the code, not only the label: `pages/AccountCenter/AccountCenterPage.jsx`, `constants/accountCenter.js` (`ACCOUNT_CENTER_TABS`, `ACCOUNT_CENTER_PATHS`), `ROUTES.ACCOUNT_CENTER`, nav key `account-center`. All wording changes too: page header, sidebar, field help, User Guide and docs.
- The redirect route moves from `/setup` to `/account-center`.
- The placeholder Account Center item and its unused `ROUTES.ACCOUNT` (`/account`) are removed.

## Alternatives considered

- Rename only the sidebar label: the page header, code names and docs would still say Business Setup, and the two names would drift apart.
- Keep `/setup` as the path: it no longer matches the name. Nothing outside the app links to it.

## Consequences

- One Account Center item in System, which opens the first tab the role may see.
- Old `/setup` and `/account` bookmarks now go to Not Found. The tab routes (`/masters/customers`, `/masters/licence-keys`, `/masters/clienteles`, `/masters/controllers`, `/masters/models`) are unchanged.
- A profile / password page, if one is built later, needs a new name and route.
