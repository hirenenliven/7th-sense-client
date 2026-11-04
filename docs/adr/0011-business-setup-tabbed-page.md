# 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page

- **Date:** 2026-11-03
- **Status:** Superseded by [0014](0014-account-center.md)

## Context

Customers (list + Add), Machine Catalog (Controllers, Models), Clientele and Licence Keys were four Masters sidebar items. They are set up rarely, mostly by the superadmin, and made the Masters section long. Unlike the organization levels (ADR 0010), the four have different roles: Customer and Machine Catalog are superadmin-only, Licence Key is for managers, and Clientele is for every role.

## Decision

Show them on one page in the sidebar's System section, [BusinessSetupPage.jsx](../../src/pages/AccountCenter/AccountCenterPage.jsx), using the ADR 0010 pattern: page header + `Nav variant="tabs"`, a tab per screen from `constants/businessSetup.js` (`BUSINESS_SETUP_TABS`). Each tab keeps its existing route and `PAGES` role guard; `PAGES` wraps that screen in `<BusinessSetupPage>`, and the screens render a `.ts-tab-header`.

- Tabs carry `roles` and are filtered with `useAuth().hasRole`, so each role sees only the tabs it may open.
- Machine Catalog has two screens: `subTabs` (Controllers / Models) shown as pills under the tabs.
- The sidebar item links to a new route, `/setup` (`ROUTES.BUSINESS_SETUP`), which redirects to the first tab the role may see; `BUSINESS_SETUP_PATHS` keeps the item active on every tab and on Add / Edit / View Customer (still separate pages).
- The Customer list is shared with Masters › Users (`kind`); only the customer kind is tabbed (`ACCOUNT_PAGES[kind].tabbed`).

## Alternatives considered

- Point the sidebar item at a fixed tab (e.g. Clientele, the only one every role sees): the superadmin would not land on the first tab.
- Role-specific sidebar paths: needs a new nav-config field and Sidebar logic for one item.
- Controllers and Models as two top-level tabs: five tabs instead of the four asked for, and splits one catalog.

## Consequences

- Links, reloads and Back open the right tab; each screen still loads lazily and only when its tab opens.
- Switching tabs reloads that screen (its filters reset).
- A new tab needs a row in `BUSINESS_SETUP_TABS` (with its `roles`) and a `PAGES` entry wrapped in `BusinessSetupPage`.
