# 0016. Account Center is superadmin only; Users lists company members only

- **Date:** 2026-11-04
- **Status:** Accepted (amends the access rules of [0014](0014-account-center.md))

## Context

Account Center (ADR 0014) was open to every manager (superadmin, customer, admin): the superadmin saw the Customer list, Licence Key and Machine Catalog, while customers and admins saw only a read-only Licence Key tab. Masters › Users called `GET /users` without a filter: the superadmin got every account (customers and itself too) and the client dropped the non-members. Account Center is the account team's place; a customer's place is its own users. The superadmin may see everything.

## Decision

- **Account Center is superadmin only:** the sidebar item, `/account-center` and every tab (Customer, Licence Key, Machine Catalog) take `SUPERADMIN_ONLY`. The Customer tab fetches the main customers only: `GET /users?filterRole=customer`.
- **Masters › Users stays for every manager** (superadmin, customer, admin) and fetches company members only: `GET /users?membersOnly=true` (new server filter, `company_id IS NOT NULL`: no customers, no superadmin). The server already limits a customer or admin to its own company, so a customer sees only the users created for its company; the superadmin sees every company's, with a Customer column.
- Customer and user lists are filtered by the server, not by the client.

## Alternatives considered

- Keep a read-only Licence Key tab for customers: it was the only reason customers saw Account Center, and it made the page mean two things.
- Hide Users from the superadmin: the superadmin must be able to see and manage every account.
- Keep filtering members in the client: the API sent rows the page never shows.

## Consequences

- Customers and admins no longer see their licence keys in the UI (the API still returns them).
- `GET /users` has a new optional `membersOnly` query parameter; existing callers are unchanged.
