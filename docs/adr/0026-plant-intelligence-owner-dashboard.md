# 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before

- **Date:** 2026-11-16
- **Status:** Accepted

## Context

There are three dashboards: Home (the state today), Operations Center (what to do first, ADR 0024) and Plant Intelligence (why capacity is lost over a period, ADR 0025). The owner wants one page that is the single source of truth for decisions. A decision needs a figure, its direction against an earlier period, and how far the data can be trusted. Plant Intelligence already had the period figures but no comparison, and today's action queue and the production plan were only on Operations Center.

## Decision

Make Plant Intelligence that page and leave Home and Operations Center unchanged.

- **Executive summary first** (`ExecutiveSummaryCard`, replacing the period tiles): Availability, OEE (average of daily OEE), Quality, Cycles completed, Plan attainment and Downtime share. Each is a number with its daily line and the change against the same number of days before the period (`compareFigures`). Exact numbers are easier to act on than values read off a chart.
- **Comparison rules:** shares (availability, OEE, quality, downtime) change in points over the whole period. Cycles and plan attainment compare per finished day, because today is only part of a day.
- **Plan attainment** = completed cycles of the machines with a job against their scheduled quantity, each machine capped at its quantity so one machine's extra cycles cannot hide another's shortfall. It uses cycles because part counts are unreliable (ADR 0024).
- **A data line** under the tiles: days read, connected time, and a warning when Performance is a flat 100 % (no standard cycle time).
- **Today's Action queue and Production plan** from Operations Center sit under Right now.
- **The previous period comes from the same API**: `GET /dashboard/home` for twice the period's days (once each; only today reloads).

## Alternatives considered

- **A new page:** a fourth dashboard would be one more page to keep in sync, which is the opposite of one source of truth.
- **Compare the earlier and later halves of the period:** no extra requests, but halves of 7 days are too short and are not what an owner calls "the period before".
- **A period endpoint on the server:** fewer requests and a true period OEE, but a server change. Worth doing if the 30-day view is slow (59 day requests).
- **Coloured thresholds for plan attainment:** there is no agreed target, so the tile stays neutral instead of using a made-up limit.

## Consequences

- The page makes twice as many day requests: 13 / 27 / 59 past days for 7 / 14 / 30. Each loads once per period, customer and day.
- Home and Operations Center could later be retired; Plant Intelligence still imports their pieces, so those have to move first.
- Downtime by reason is still missing, since no endpoint adds up `machine_mode_reasons` (see ADR 0025).
