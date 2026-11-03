# Architecture Decision Records

Client (frontend) decisions, one file each (Michael Nygard template). Never edit an accepted ADR: write a new one and mark the old one "Superseded by NNNN".

| # | Title | Status | Date |
|---|---|---|---|
| 0001 | [Single-page app with React 19 and Vite](0001-react-vite-spa.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0002 | [React Router with one route table and role guards](0002-central-route-table-with-role-guards.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0003 | [Server state via service modules and useLoad, Context only for the session](0003-data-fetching-with-service-modules.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0004 | [Axios client with the HttpOnly session cookie](0004-axios-with-httponly-session-cookie.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0005 | [Forms with react-hook-form and zod](0005-forms-react-hook-form-zod.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0006 | [React-Bootstrap with SCSS design tokens](0006-react-bootstrap-scss-tokens.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0007 | [Recharts for charts, plain SVG for the Gantt](0007-recharts-for-charts.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0008 | [Folder structure by page and by concern](0008-folder-structure-by-page.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0009 | [Page-wise flow documentation in docs/pages](0009-page-wise-flow-documentation.md) | Accepted | 2026-11-03 |

New ADR: copy the newest file, take the next number, status "Proposed" until agreed, then "Accepted"; add a row here.
