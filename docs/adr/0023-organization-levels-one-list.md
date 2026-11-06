# 0023. One list, row and form for the name-under-a-parent organization levels

- **Date:** 2026-11-06
- **Status:** Accepted

## Context

Masters › Organization had a list, row, form modal and form file per level. City, Location, Shop, Line, Cell and Supervisor were the same screen: after replacing the level names, each list differed from the others by about 58 lines, all names, icons and links. That was about 2,500 lines, and any fix had to be made six times, with one miss making the screens behave differently.

## Decision

City, Location, Shop, Line, Cell and Supervisor are one `OrgLevelList`, `OrgLevelRow` and `OrgLevelFormModal` (`pages/Organization/`), driven by a config per level in `orgLevels.js`: its wording, icon, service calls, delete note and parent. `PAGES` renders `<OrgLevelList key={ORG_LEVEL.X} level={ORG_LEVEL.X} />`, the same way `ReasonList` serves its kinds. `ORG_LEVEL` lives in `constants/organization.js`, so the route table does not pull the config and its services out of the lazy chunk.

Each level keeps its route, its service file and its docs page. Country and State keep their own screens (they pick from libraries), and Branch keeps its own pages.

## Alternatives considered

- **Keep the copies:** no refactor risk, but every change stays six edits.
- **A shared hook, with six thin pages:** still six rows, modals and forms to keep in step, for no behaviour that differs.
- **One service for all levels too:** other screens import the level services by name (`machineFilter.js`), and they are short, so the gain is small.

## Consequences

- A change to these screens is one edit, and they cannot drift apart.
- A level that needs different behaviour needs a config field or its own screen again.
- A level's wording is built from its config, so the text cannot be searched as a whole sentence in the code.
