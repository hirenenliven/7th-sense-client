# 0010. Organization levels on one tabbed page, a route per tab

- **Date:** 2026-11-03
- **Status:** Accepted

## Context

Country, State, City, Branch, Location, Shop, Line, Cell and Supervisor were nine sidebar items and nine pages. Users set them up one after the other, so the sidebar was long and moving between levels meant going back to it.

## Decision

Show them on one page, [OrganizationPage.jsx](../../src/pages/Organization/OrganizationPage.jsx): a page header and `Nav variant="tabs"` (the Theme Showcase tab style), with a tab per level from `constants/organization.js` (`ORGANIZATION_TABS`). Each tab keeps its existing route; `PAGES` wraps that route's list in `<OrganizationPage>`, and a tab is a link to its route. The lists keep their own data, filters, modals and access rules, and only render a tab header (`.ts-tab-header`) instead of a page header. The sidebar has one Organization item, active on every tab and on Add / Edit Branch (`activePaths`). Add / Edit Branch stay separate pages.

## Alternatives considered

- One route with `?tab=`: breaks every existing link to a level (empty states, User Guide, Back from the branch form).
- Tabs that keep every list mounted (`Tab.Container`): loads all nine lists at once and needs a new state for the tab.

## Consequences

- Links, reloads and Back open the right tab; each list still loads lazily and only when its tab opens.
- Switching tabs reloads that list (its filters reset), as switching pages did before.
- A new level needs a row in `ORGANIZATION_TABS` and a `PAGES` entry wrapped in `OrganizationPage`.
