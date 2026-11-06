# 0024. Operations Center: a second dashboard beside Home, on the existing APIs

- **Date:** 2026-11-06
- **Status:** Accepted

## Context

Home (`/`) shows the fleet and the day, but answers "what is the state?" more than "what should I do first?". Schedules, warranties, licences, holidays, trends and the machines per line sit in their own modules, so a manager has to move between screens to connect them. We want one screen that gives most of that picture, and to compare it with Home before choosing.

Part counts are unreliable: most controllers send none, which is why Home hides Parts per hour. A dashboard that compares parts with the plan would report machines as behind when they are not.

## Decision

Add Main › Operations Center (`/operations-center`, `pages/OperationsCenter/`) as a separate page. Home stays as it is; shared pieces are imported from it (`KpiTile`, `TimeCard`, `HourlyCard`, `LowestOeeCard`, `AlarmsCard`, `homeSettings.js`).

- **Existing APIs only**, no new endpoint and no change to the data. `GET /dashboard/home` is the live base; `/productivity/oee` and `/productivity/cycle-counts` give 7 days of the machines it returned; the master lists give what only they know. All run under the user's own access. Licence keys are read only by `MANAGERS`, as the server requires.
- **An action queue is the centre of the page:** it ranks problems across modules, for example a job scheduled on an offline machine, each opening where it can be fixed.
- **Plan progress is completed cycles against quantity**, the same measure as the Virtual Screen's batch progress. Parts appear only when the controllers report them.
- **Anchored on the server's day:** trends and date checks use the `date` the server answered with.
- **Panels fail on their own:** only a failed `/dashboard/home` stops the page.

## Alternatives considered

- **Change Home:** the two could not be compared, and a mistake would hit the page everyone opens first.
- **One new endpoint returning everything:** fewer requests, but new server code before we know this page is the one we keep.
- **Estimate pace and output (time left, expected parts):** the data does not support it; nothing here is estimated.

## Consequences

- The page sends about 11 requests when opened, then repeats `/dashboard/home` every 30 s and the rest every 5 minutes. If it replaces Home, a combined endpoint could be worth building.
- OEE trend and cycle counts cost the server per machine and day, so they refresh less often than the live data.
- If Operations Center is chosen, Home and its nav item can be removed, moving the shared pieces out of `pages/Home/`.
