# 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day

- **Date:** 2026-11-06
- **Status:** Accepted

## Context

Home answers "what is the state today?" and Operations Center (ADR 0024) "what should I do first?". Both look at one day. Nothing shows the questions behind them: why capacity is lost, on which machines, on which days, and whether it is improving. We want a third page to compare, without changing the other two.

`GET /dashboard/home` already takes any date and answers with every machine's OEE parts and cycles, the time per mode and the top alarms, in about 25 ms on the development data. In that data no recent cycle has a standard time, so the server reports Performance as 100 % and OEE says nothing about speed, and part counts cover under 1 % of cycles. A dashboard that hides this would mislead.

## Decision

Add Main › Plant Intelligence (`/plant-intelligence`, `pages/PlantIntelligence/`) as a separate page.

- **One request per day of the period (7, 14 or 30 days), no new endpoint.** Today reloads every `MONITOR_REFRESH_MS`. Past days do not change, so they load once per period and customer.
- **Period figures use the server's formulas on summed seconds and cycles** (availability, quality), so days weigh by their time. Performance cannot be summed from this response, so no period OEE is shown: the tile gives today's OEE and the plain average of daily OEE, labelled as such.
- **The machine × day heatmap is the centre of the page.** It tells one bad day from a pattern. Machines that did not run are hidden until asked for, and a 0 is drawn neutral: absent, not low.
- **Findings in words are rules with a minimum of evidence**, and include warnings about the data itself (Performance at exactly 100 %, few part counts, time not recorded).
- **The time chart defaults to connected time**, since offline time hides everything else; the period totals always show all machine time.
- **Pieces of Home and Operations Center are imported** (`KpiTile`, `ActionRow`, `OeeTrendCard`, `CycleTrendCard`, `ReadinessCard`, `buildReadiness`, `currentShift`, `dayOffName`).

## Alternatives considered

- **Extend Operations Center:** the two could not be compared.
- **A new period endpoint:** fewer requests, and a true period OEE and an uncapped alarm list, but new server code before we know this page stays.
- **`/productivity/oee` per machine for the heatmap:** one request per machine instead of one per day.
- **Downtime reasons by frequency:** the most useful loss view, but no endpoint adds up `machine_mode_reasons` across periods. Left for a later change.

## Consequences

- Opening the page sends 1 request per day of the period plus 8 lists; only today and, every 5 minutes, the lists repeat.
- The alarm Pareto adds up each day's top 10 codes, so a rare code on a busy day can be left out; the card says so.
- An active machine counts for the whole period, also before it was added: its earlier time reads as Not recorded. The finding says so.
- Machines left active by test runs in a database lower every all-customers figure. Their cause is the test data, not this page.
- If one dashboard is chosen, shared pieces in `pages/Home/` and `pages/OperationsCenter/` must move before the others are removed.
